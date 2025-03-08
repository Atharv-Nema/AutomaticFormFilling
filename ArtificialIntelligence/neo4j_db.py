from neo4j import GraphDatabase

class Neo4jDatabase:
    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

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
