from fastapi import FastAPI, Request
from neo4j_db import Neo4jDatabase
from question_interpreter import QuestionInterpreter
from autofill_retriever import AutofillRetriever

app = FastAPI()

neo4j_db = Neo4jDatabase("bolt://localhost:7687", "neo4j", "password")
interpreter = QuestionInterpreter()
retriever = AutofillRetriever(neo4j_db, interpreter)

@app.post("/autofill")
async def autofill(request: Request):
    data = await request.json()
    question = data["question"]
    user_id = data["user_id"]

    answer = retriever.get_field_value(user_id, question)
    return {"answer": answer}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
