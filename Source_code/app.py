# app.py
from fastapi import FastAPI
from pydantic import BaseModel
from joblib import load
import numpy as np
import random

# FastAPI app
app = FastAPI(title="Mental Health Chatbot")

# Load trained model and embedder
# Make sure model_bundle.joblib is in the same folder as app.py
model, embedder = load("model_bundle.joblib")

# Map numeric labels to multiple possible responses
label_to_response = {
    0: [
        "Feeling good? Keep it up!",
        "Take a moment to enjoy the present.",
        "You are doing great — celebrate small wins!",
        "Keep your positive mindset alive."
    ],
    1: [
        "Talk to someone you trust — sharing lightens the load.",
        "Believe in yourself — you've overcome before, and you will again.",
        "Journaling helps you process your emotions.",
        "Sometimes talking helps more than thinking alone."
    ],
    2: [
        "Take deep breaths — inhale calm, exhale stress.",
        "Listen to relaxing music to calm anxiety.",
        "Try a quick meditation — even 2 minutes helps.",
        "Take a short walk to release tension."
    ]
}

# Input schema
class Message(BaseModel):
    message: str

# Model prediction & response
def get_model_response(user_text: str) -> str:
    # Encode text using SentenceTransformer
    embedding = embedder.encode([user_text])
    
    # Optional: include length feature if used during training
    length_feat = np.array([[len(user_text)]])
    X = np.hstack([embedding, length_feat])
    
    # Predict label with XGBoost
    label = model.predict(X)[0]
    
    # Pick a random response for the predicted label
    return random.choice(label_to_response.get(label, ["I'm here to listen."]))

# API endpoint
@app.post("/chat")
def chat(msg: Message):
    response = get_model_response(msg.message)
    return {"reply_text": response}
