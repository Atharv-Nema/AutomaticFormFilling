from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

class QuestionInterpreter:
    def __init__(self):
        self.model = SentenceTransformer("all-MiniLM-L6-v2")  # Lightweight & fast
        self.index = faiss.IndexFlatL2(384)
        self.questions = []
        self.mappings = {}
        self.add_question("What is your email?", "email")
        self.add_question("Please enter email", "email")
        self.add_question("Email:", "email")
        self.add_question("crsid@cam.ac.uk, please enter crsid", "crsid")
        self.add_question("What is your CRSid?", "crsid")
        self.add_question("What is your name?", "name")
        self.add_question("name: ", "name")
        self.add_question("what is your age", "age")
        self.add_question("How old are you?", "age")
        self.add_question("How is your cat", "cat")
        self.add_question("What is your cat", "cat")
        self.add_question("What is your email?", "email")
        self.add_question("Please enter email", "email")
        self.add_question("Email:", "email")
        self.add_question("crsid@cam.ac.uk, please enter crsid", "crsid")
        self.add_question("What is your CRSid?", "crsid")
        self.add_question("What is your name?", "name")
        self.add_question("name: ", "name")
        self.add_question("what is your age", "age")
        self.add_question("How old are you?", "age")
        self.add_question("How is your cat", "cat")
        self.add_question("What is your cat", "cat")
        self.add_question("What is your email?", "email")
        self.add_question("Please enter email", "email")
        self.add_question("Email:", "email")
        self.add_question("crsid@cam.ac.uk, please enter crsid", "crsid")
        self.add_question("What is your CRSid?", "crsid")
        self.add_question("What is your name?", "name")
        self.add_question("name: ", "name")
        self.add_question("what is your age", "age")
        self.add_question("How old are you?", "age")
        self.add_question("How is your cat", "cat")
        self.add_question("What is your cat", "cat")
        self.add_question("What is your email?", "email")
        self.add_question("Please enter email", "email")
        self.add_question("Email:", "email")
        self.add_question("crsid@cam.ac.uk, please enter crsid", "crsid")
        self.add_question("What is your CRSid?", "crsid")
        self.add_question("What is your name?", "name")
        self.add_question("name: ", "name")
        self.add_question("what is your age", "age")
        self.add_question("How old are you?", "age")
        self.add_question("How is your cat", "cat")
        self.add_question("What is your cat", "cat")

    def add_question(self, question_text, field_key):
        vector = self.model.encode(question_text)
        self.index.add(np.array([vector]))
        self.questions.append(question_text)
        self.mappings[len(self.questions) - 1] = field_key

    def query(self, input_question):
        vector = self.model.encode(input_question)
        distances, indices = self.index.search(np.array([vector]), k=1)

        print(f"Query: '{input_question}'")
        print(f"Closest Distance: {distances[0][0]}, Index: {indices[0][0]}")

        if indices[0][0] == -1:
            print("No suitable match found, returning 'unknown'")
            return "unknown"

        return self.mappings[indices[0][0]]

interpreter = QuestionInterpreter()