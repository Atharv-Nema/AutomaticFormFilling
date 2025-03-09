import json
from neo4j_db import Neo4jDatabase

def process_json(file_path, user_id, profile_name):
    with open(file_path, "r") as file:
        form_data = json.load(file)

    structured_fields = {}
    
    for response in form_data["responses"]:
        question_text = response["question"].lower().strip()
        answer = response["answer"].strip()

        if "email" in question_text:
            key = "email"
        elif "crsid" in question_text:
            key = "crsid"
        elif "name" in question_text:
            key = "name"
        elif "age" in question_text:
            key = "age"
        else:
            key = question_text

        structured_fields[key] = answer

    # Insert into Neo4j
    neo4j_db = Neo4jDatabase("bolt://localhost:7687", "neo4j", "password")
    neo4j_db.insert_user_profile(user_id, profile_name, structured_fields)
    neo4j_db.close()
    print(f"Inserted data from {file_path} for user {user_id} into Neo4j.")

process_json("form_responses/dummy_form.json", user_id="123", profile_name="University")
