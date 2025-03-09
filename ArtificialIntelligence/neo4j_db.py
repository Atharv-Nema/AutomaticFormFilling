import os
from neo4j import GraphDatabase
from dotenv import load_dotenv

load_dotenv()

NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "password")


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
            session.write_transaction(self._insert_profile, user_id, profile_name, fields)

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

        if crsid:  # Ensure CRSid is under University
            if profile_name.lower() == "university":
                tx.run("""
                MATCH (p:Profile {name: "University"})
                MERGE (f:Field {key: "crsid", value: $crsid})
                MERGE (p)-[:HAS_FIELD]->(f)
                """, crsid=crsid)

                # Automatically derive university email
                university_email = f"{crsid}@cam.ac.uk"  # Change logic for other universities
                tx.run("""
                MATCH (p:Profile {name: "University"})
                MERGE (f:Field {key: "email", value: $email})
                MERGE (p)-[:HAS_FIELD]->(f)
                """, email=university_email)

        elif email:  # Handle normal email cases
            tx.run("""
            MATCH (p:Profile {name: $profile_name})
            MERGE (f:Field {key: "email", value: $email})
            MERGE (p)-[:HAS_FIELD]->(f)
            """, profile_name=profile_name, email=email)
