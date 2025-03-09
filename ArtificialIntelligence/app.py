from flask import Flask, request, jsonify
from neo4j_db import Neo4jDatabase
from question_interpreter import QuestionInterpreter

app = Flask(__name__)

neo4j_db = Neo4jDatabase()
interpreter = QuestionInterpreter()

@app.route("/autofill", methods=["POST"])
def autofill():
    """
    Receives a form question and user_id, retrieves the best autofill response.
    """
    data = request.get_json()
    user_id = data.get("user_id")
    question = data.get("question")

    if not user_id or not question:
        return jsonify({"error": "Missing user_id or question"}), 400

    field_key = interpreter.query(question)
    answer = neo4j_db.get_field_value(user_id, field_key)

    return jsonify({"answer": answer})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
