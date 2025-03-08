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

        response = self.client.Completions.create(
            model="gpt-4-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
        )

        return response.choices[0].message["content"].strip()

    def get_field_value(self, user_id, question_text, form_questions, extra_input=""):
        """
        Retrieves the best answer for a given question. Uses OpenAI for long-form answers.
        """
        # Determine the best profile based on the form context
        profile_name = self.determine_profile(form_questions)

        # Get the field key from FAISS
        field_key = self.interpreter.query(question_text)

        # Retrieve structured data from Neo4j
        structured_data = self.neo4j_db.get_field_value(user_id, field_key)

        # If the answer is short and structured, return it directly
        if field_key in ["email", "name", "crsid", "job_title"] and structured_data:
            return structured_data

        # If it's a long-answer field, use OpenAI for generation
        prompt = f"""
        Form Context:
        {form_questions}

        User Profile: {profile_name}
        Known User Data: {structured_data}
        Additional Information: {extra_input}

        Question: {question_text}

        Generate a well-written answer based on the user's profile and additional input.
        """

        response = self.client.Completions.create(
            model="gpt-4-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
        )

        return response.choices[0].message["content"].strip()
