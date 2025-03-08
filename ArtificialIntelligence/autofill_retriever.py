class AutofillRetriever:
    def __init__(self, neo4j_db, interpreter):
        self.neo4j_db = neo4j_db
        self.interpreter = interpreter

    def get_field_value(self, user_id, question_text):
        field_key = self.interpreter.query(question_text)
        
        if field_key == "email":
            with self.neo4j_db.driver.session() as session:
                result = session.run("""
                    MATCH (u:User {id: $user_id})-[:HAS_PROFILE]->(p:Profile {name: "University"})-[:HAS_FIELD]->(f {key: "crsid"})
                    RETURN f.value LIMIT 1
                """, user_id=user_id)
                record = result.single()
                if record:
                    return f"{record['f.value']}@cam.ac.uk"

        return self.neo4j_db.get_field_value(user_id, field_key)
