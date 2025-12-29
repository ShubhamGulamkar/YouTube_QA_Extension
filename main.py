# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from qa import get_transcript, answer_question

app = FastAPI()

# Allow requests from your Chrome extension
origins = [
    "chrome-extension://mbojbnmdlbcfkddinbhjcjlbfbgjmpco",
    "http://localhost",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model for request
class AskRequest(BaseModel):
    video_id: str
    question: str

@app.post("/ask")
async def ask_question(req: AskRequest):
    try:
        # Fetch transcript
        transcript = get_transcript(req.video_id)
        # if not transcript:
        #     raise HTTPException(status_code=404, detail="Transcript not found")

        # Get answer
        answer = answer_question(transcript, req.question)
        return {"answer": answer}

    except Exception as e:
        # Catch all errors and return as JSON
        raise HTTPException(status_code=500, detail=str(e))


