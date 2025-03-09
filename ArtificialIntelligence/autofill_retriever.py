import os
from dotenv import load_dotenv
from openai import OpenAI
from neo4j_db import Neo4jDatabase
from question_interpreter import QuestionInterpreter

dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


class AutofillRetriever:
    def __init__(self, neo4j_db, interpreter):
        self.neo4j_db = neo4j_db
        self.interpreter = interpreter
        self.client = OpenAI(api_key=os.getenv(OPENAI_API_KEY))  # Load API Key from .env

    def determine_profile(self, form_questions):
        """
        Uses OpenAI to analyze the form's questions and determine the best user profile.
        """
        prompt = f"""
        The user has multiple profiles: Work, University, and Leisure.
        Based on the following form questions, decide which profile is most relevant:

        {form_questions}

        Respond with one of: 'Work', 'University', or 'Leisure'.
        """
        
        print("THIS IS THE PROMPT:")
        print(prompt)
        print("PROMPT IS OVER!!!")
        response = self.client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
        )
        print("THIS IS MY RESPONSE")
        print(response)
        print("RESPONSE IS OVER")
        return response.choices[0].message.content.strip()

    def get_field_value(self, user_id, question_text, form_questions, extra_input="", answer_type="short"):
        # Determine the profile based on form context.
        profile_name = self.determine_profile(form_questions)
        print("Determined Profile:", profile_name)

        

        # Get the field key from the question interpreter.
        field_key = self.interpreter.query(question_text)
        print("Field Key:", field_key)

        # For short-answer types, try to fetch structured data from Neo4j.
        if answer_type == "short" and field_key in ["email", "name", "crsid", "job_title"]:
            structured_data = self.neo4j_db.get_field_value(user_id, field_key)
            print("Structured Data from Neo4j:", structured_data)
            if structured_data and structured_data != "No data found":
                return structured_data

        # For long-answer fields, build a prompt using context.
        known_data = self.neo4j_db.get_field_value(user_id, field_key)
        print("Known Data:", known_data)

        prompt = f"""
        Form Context:
        {form_questions}

        User Profile: {profile_name}
        Known User Data: {known_data}
        Additional Information: {extra_input}

        Question: {question_text}

        Generate a well-written answer based on the user's profile and additional input.
        """
        print("Final Prompt for OpenAI:", prompt)

        try:
            response = self.client.chat.completions.create(
                model="gpt-4-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
            )
            generated_answer = response.choices[0].message.content.strip()
            print("Generated Answer:", generated_answer)
            return generated_answer
        except Exception as e:
            print("Error during OpenAI call:", str(e))
            return "Error generating answer"
