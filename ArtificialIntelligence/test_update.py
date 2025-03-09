from neo4j_db import Neo4jDatabase

def test_update():
    # Initialize the database connection
    neo4j_db = Neo4jDatabase()
    
    user_id = "123"
    profile_name = "University"  # Or another profile, like "Work"
    
    # New data to update (e.g., adding a new field 'cat_name')
    new_fields = {
        "cat_name": "Whiskers",
        "email": "johndoe@unknown.com",  # This might be overwritten if CRSid exists
        "crsid": "jd123"  # For University, this would auto-generate the email
    }
    
    # Update the user's profile with new information
    neo4j_db.update_user_profile(user_id, profile_name, new_fields)
    
    # Retrieve the updated fields to verify
    updated_cat_name = neo4j_db.get_field_value(user_id, "cat_name")
    updated_email = neo4j_db.get_field_value(user_id, "email")
    updated_crsid = neo4j_db.get_field_value(user_id, "crsid")
    
    print("Updated cat name:", updated_cat_name)
    print("Updated email:", updated_email)
    print("Updated CRSid:", updated_crsid)
    
    neo4j_db.close()

if __name__ == "__main__":
    test_update()
