from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import pickle
import nltk
import string

from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer


# ============================================
# NLTK
# ============================================

nltk.download("punkt")
nltk.download("punkt_tab")
nltk.download("stopwords")


# ============================================
# APP
# ============================================

app = FastAPI(
    title="SpamGuard AI API",
    description="SMS Spam Detection API",
    version="1.0.0"
)


# ============================================
# CORS
# ============================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================
# LOAD MODEL
# ============================================

with open("model.pkl", "rb") as file:
    model = pickle.load(file)


with open("vectorizer.pkl", "rb") as file:
    vectorizer = pickle.load(file)


# ============================================
# TEXT PREPROCESSING
# ============================================

ps = PorterStemmer()

stop_words = set(
    stopwords.words("english")
)


def transform_text(text):

    text = text.lower()

    text = nltk.word_tokenize(text)

    # Remove non-alphanumeric words
    text = [
        word
        for word in text
        if word.isalnum()
    ]

    # Remove stopwords
    text = [
        word
        for word in text
        if word not in stop_words
    ]

    # Stemming
    text = [
        ps.stem(word)
        for word in text
    ]

    return " ".join(text)


# ============================================
# REQUEST MODEL
# ============================================

class MessageRequest(BaseModel):

    message: str


# ============================================
# ROOT
# ============================================

@app.get("/")
def home():

    return {
        "status": "online",
        "message": "SpamGuard AI API is running"
    }


# ============================================
# HEALTH CHECK
# ============================================

@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


# ============================================
# PREDICTION
# ============================================

@app.post("/predict")
def predict(request: MessageRequest):

    message = request.message.strip()


    # Empty message
    if not message:

        return {
            "prediction": "ham",
            "confidence": 0,
            "error": "Message cannot be empty"
        }


    # Preprocess
    transformed_text = transform_text(
        message
    )


    # Vectorize
    vector_input = vectorizer.transform(
        [transformed_text]
    )


    # Prediction
    prediction = model.predict(
        vector_input
    )[0]


    # ========================================
    # CONFIDENCE
    # ========================================

    confidence = 0.0


    if hasattr(model, "predict_proba"):

        probabilities = model.predict_proba(
            vector_input
        )[0]

        confidence = float(
            max(probabilities)
        )


    # ========================================
    # CONVERT PREDICTION
    # ========================================

    if prediction == 1 or str(prediction).lower() == "spam":

        result = "spam"

    else:

        result = "ham"


    return {
        "prediction": result,
        "confidence": confidence,
        "original_message": message,
        "processed_text": transformed_text
    }