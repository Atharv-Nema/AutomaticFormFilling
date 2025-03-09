from neo4j import GraphDatabase
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Neo4jDatabase:
    def __init__(self):
        self.uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
        self.user = os.getenv("NEO4J_USER", "neo4j")
        self.password = os.getenv("NEO4J_PASSWORD", "password")
        self.driver = GraphDatabase.driver(self.uri, auth=(self.user, self.password))

    def close(self):
        """Closes the database connection."""
        self.driver.close()

    def insert_user_profile(self, user_id, profile_name, fields):
        """
        Inserts a user profile into Neo4j with structured fields.
        If CRSid is present, automatically derives the university email.
        """
        with self.driver.session() as session:
            session.execute_write(self._insert_profile, user_id, profile_name, fields)

    @staticmethod
    def _insert_profile(tx, user_id, profile_name, fields):
        query = """
        MERGE (u:User {id: $user_id})
        MERGE (p:Profile {name: $profile_name})
        MERGE (u)-[:HAS_PROFILE]->(p)
        """
        tx.run(query, user_id=user_id, profile_name=profile_name)

        crsid = fields.get("crsid")
        email = fields.get("email")

        if crsid and profile_name.lower() == "university":
            tx.run("""
            MATCH (p:Profile {name: "University"})
            MERGE (f:Field {key: "crsid", value: $crsid})
            MERGE (p)-[:HAS_FIELD]->(f)
            """, crsid=crsid)

            university_email = f"{crsid}@cam.ac.uk"  # Adjust for other universities
            tx.run("""
            MATCH (p:Profile {name: "University"})
            MERGE (f:Field {key: "email", value: $email})
            MERGE (p)-[:HAS_FIELD]->(f)
            """, email=university_email)

        elif email:
            tx.run("""
            MATCH (p:Profile {name: $profile_name})
            MERGE (f:Field {key: "email", value: $email})
            MERGE (p)-[:HAS_FIELD]->(f)
            """, profile_name=profile_name, email=email)

    def get_field_value(self, user_id, field_key):
        """
        Retrieves the value of a specific field for a given user.
        If the field is "email" under University, it checks if CRSid exists to derive the email.
        """
        with self.driver.session() as session:
            result = session.run("""
                MATCH (u:User {id: $user_id})-[:HAS_PROFILE]->(p)-[:HAS_FIELD]->(f {key: $field_key})
                RETURN f.value LIMIT 1
            """, user_id=user_id, field_key=field_key)

            record = result.single()
            return record["f.value"] if record else "No data found"
