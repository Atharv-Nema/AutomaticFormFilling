import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS
from openai import OpenAI
from neo4j_db import Neo4jDatabase
from question_interpreter import QuestionInterpreter
from autofill_retriever import AutofillRetriever
import json


load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OpenAI.api_key = OPENAI_API_KEY
client = OpenAI()

app = Flask(__name__)
CORS(app)


@app.route('/ask', methods=['POST'])
def ask_question():
    # Extract question and context from the request
    data = request.get_json()
    question = data.get("question")
    context = data.get("context")
    additional_context = data.get("additional_context", "No additional context")

    if not question or not context:
        return jsonify({"error": "Both 'question' and 'context' are required!"}), 400

    # Combine context and question for OpenAI prompt
    prompt = f"Context: {context}\n\nAdditional Context: {additional_context} \n\nQuestion: {question}\nAnswer:"
    print("Prompt:", prompt)
    print("Context: ", context)
    try:
        # Query the OpenAI model for an answer
        completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "developer", "content": "You are a helpful assistant."},
            {
                "role": "user",
                "content": prompt
            }
        ])
        answer = completion.choices[0].message.content
        print("Answer:", answer)
        return jsonify({"answer": answer})

    except Exception as e:
        return jsonify({"error": str(e)}), 500



neo4j_db = Neo4jDatabase()
interpreter = QuestionInterpreter()
retriever = AutofillRetriever(neo4j_db, interpreter)

@app.route('/autofill', methods=['POST'])
def autofill():
    """
    Expects JSON payload with:
      - user_id: string (e.g., "123")
      - question: the current form question (string)
      - form_questions: a string combining all form questions for context
      - extra_input: optional additional context for long-form answers
      - question_form: "short" or "long"
    Returns a JSON response with the generated autofill answer.
    """
    data = request.get_json()
    user_id = data.get("user_id")
    question = data.get("question")
    form_questions = data.get("form_questions")
    extra_input = data.get("extra_input", "")
    question_form = data.get("question_form", "short")

    if not user_id or not question or not form_questions:
        return jsonify({"error": "Missing required fields: user_id, question, form_questions"}), 400

    try:
        answer = retriever.get_field_value(user_id, question, form_questions, extra_input, question_form)
        return jsonify({"answer": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/addDatabase', methods=['POST'])
def addDatabase():
    data = request.get_json()
    print(f"Received data is {data}")
    # jsonified_data = json.loads(data)
    neo4j_db.update_user_profile(0, "Test profile", data)
    return "Accepted"

if __name__ == "__main__":
    app.run(port=8080, debug=True)
