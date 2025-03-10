from neo4j import GraphDatabase
import os
from dotenv import load_dotenv

load_dotenv()

class Neo4jDatabase:
    def __init__(self, uri=None, user=None, password=None):
        self.uri = uri or os.getenv("NEO4J_URI", "bolt://localhost:7687")
        self.user = user or os.getenv("NEO4J_USER", "neo4j")
        self.password = password or os.getenv("NEO4J_PASSWORD", "password")
        self.driver = GraphDatabase.driver(self.uri, auth=(self.user, self.password))

    def close(self):
        self.driver.close()

    def insert_user_profile(self, user_id, profile_name, fields):
        with self.driver.session() as session:
            session.execute_write(self._insert_profile, user_id, profile_name, fields)

    @staticmethod
    def _insert_profile(tx, user_id, profile_name, fields):
        user_id = "123"

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
            MERGE (p)-[:HAS_FIELD]->(f:Field {key: "crsid"})
            SET f.value = $crsid
            """, crsid=crsid)
            university_email = f"{crsid}@cam.ac.uk"
            tx.run("""
            MATCH (p:Profile {name: "University"})
            MERGE (p)-[:HAS_FIELD]->(f:Field {key: "email"})
            SET f.value = $email_val
            """, email_val=university_email)
        elif email:
            tx.run("""
            MATCH (p:Profile {name: $profile_name})
            MERGE (p)-[:HAS_FIELD]->(f:Field {key: "email"})
            SET f.value = $email
            """, profile_name=profile_name, email=email)

    def update_user_profile(self, user_id, profile_name, fields):
        user_id = "123"

        """
        Updates fields for an existing user profile.
        """
        with self.driver.session() as session:
            session.execute_write(self._update_profile, user_id, profile_name, fields)

    @staticmethod
    def _update_profile(tx, user_id, profile_name, fields):
        user_id = "123"

        # Ensure the user and profile exist.
        query = """
        MATCH (u:User {id: $user_id})-[:HAS_PROFILE]->(p:Profile {name: $profile_name})
        RETURN p
        """
        result = tx.run(query, user_id=user_id, profile_name=profile_name)
        if not result.single():
            # If the profile doesn't exist, create it.
            tx.run("""
            MERGE (u:User {id: $user_id})
            MERGE (p:Profile {name: $profile_name})
            MERGE (u)-[:HAS_PROFILE]->(p)
            """, user_id=user_id, profile_name=profile_name)

        # Update each field.
        for key, value in fields.items():
            field_query = """
            MATCH (u:User {id: $user_id})-[:HAS_PROFILE]->(p:Profile {name: $profile_name})
            MERGE (p)-[r:HAS_FIELD]->(f:Field {key: $key})
            SET f.value = $value
            """
            tx.run(field_query, user_id=user_id, profile_name=profile_name, key=key, value=value)

        # If updating the CRSid in a University profile, auto-derive the email.
        if profile_name.lower() == "university" and "crsid" in fields:
            crsid = fields["crsid"]
            university_email = f"{crsid}@cam.ac.uk"
            tx.run("""
            MATCH (u:User {id: $user_id})-[:HAS_PROFILE]->(p:Profile {name: "University"})
            MERGE (p)-[r:HAS_FIELD]->(f:Field {key: "email"})
            SET f.value = $email
            """, user_id=user_id, email=university_email)

    def get_field_value(self, user_id, field_key):
        user_id = "123"
        with self.driver.session() as session:
            result = session.run("""
                MATCH (u:User {id: $user_id})-[:HAS_PROFILE]->(p)-[:HAS_FIELD]->(f {key: $field_key})
                RETURN f.value AS value LIMIT 1
            """, user_id=user_id, field_key=field_key)
            record = result.single()
            return record["value"] if record else "No data found"