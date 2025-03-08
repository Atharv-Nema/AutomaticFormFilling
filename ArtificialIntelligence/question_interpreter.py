from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

class QuestionInterpreter:
    def __init__(self):
        self.model = SentenceTransformer("all-MiniLM-L6-v2")  # Lightweight & fast
        self.index = faiss.IndexFlatL2(384)
        self.questions = []
        self.mappings = {}

    def add_question(self, question_text, field_key):
        vector = self.model.encode(question_text)
        self.index.add(np.array([vector]))
        self.questions.append(question_text)
        self.mappings[len(self.questions) - 1] = field_key

    def query(self, input_question):
        vector = self.model.encode(input_question)
        _, indices = self.index.search(np.array([vector]), k=1)
        return self.mappings[indices[0][0]]

# Load predefined question mappings
interpreter = QuestionInterpreter()
interpreter.add_question("What is your email?", "email")
interpreter.add_question("Please enter email", "email")
interpreter.add_question("Email:", "email")
interpreter.add_question("crsid@cam.ac.uk, please enter crsid", "crsid")
interpreter.add_question("What is your CRSid?", "crsid")
