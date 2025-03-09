import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from openai import OpenAI
from flask_cors import CORS

load_dotenv()
# Load OpenAI API key from environment variable or .env file
OpenAI.api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI()

app = Flask(__name__)
CORS(app)

@app.route('/ask', methods=['POST'])
def ask_question():
    # Extract question and context from the request
    data = request.get_json()
    question = data.get("question")
    context = data.get("context")

    if not question or not context:
        return jsonify({"error": "Both 'question' and 'context' are required!"}), 400

    # Combine context and question for OpenAI prompt
    prompt = f"Context: {context}\n\nQuestion: {question}\nAnswer:"
    print("Prompt:", prompt)
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

if __name__ == "__main__":
    app.run(debug=True)
