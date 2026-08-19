# 📩 SpamGuard AI — Email/SMS Spam Classifier

An AI-powered **Email/SMS Spam Classifier** built with Python, Natural Language Processing (NLP), Machine Learning, and a modern web interface.

This project was built collaboratively by **Ahsan Naaz** and **Abdul Rab**.

## 🚀 Features

- Detects whether a message is **Spam** or **Not Spam**
- Text preprocessing with NLTK
- Tokenization
- Stopword removal
- Porter Stemming
- TF-IDF feature extraction
- Machine Learning-based classification
- Saved model and vectorizer using Pickle
- FastAPI backend for model inference
- Professional HTML, CSS, and JavaScript frontend
- Prediction confidence display
- Recent prediction history
- Basic prediction statistics
- Responsive interface for desktop and mobile

## 🧠 How It Works

The application follows this pipeline:

```text
User Message
     ↓
Text Preprocessing
     ↓
Tokenization
     ↓
Remove Non-Alphanumeric Tokens
     ↓
Remove Stopwords
     ↓
Porter Stemming
     ↓
TF-IDF Vectorization
     ↓
Machine Learning Model
     ↓
Spam / Not Spam
```

The original model implementation loads a saved TF-IDF vectorizer and ML model from Pickle files and applies the same preprocessing pipeline before prediction.

## 🛠️ Tech Stack

### Machine Learning & NLP
- Python
- NLTK
- Scikit-learn
- TF-IDF
- Porter Stemmer
- Pickle

### Backend
- FastAPI
- Uvicorn
- Pydantic

### Frontend
- HTML5
- CSS3
- JavaScript

### UI / Development
- Responsive modern dashboard
- REST API communication
- LocalStorage for frontend statistics/history

## 📁 Project Structure

```text
spam-classifier/
│
├── backend/
│   ├── app.py
│   ├── model.pkl
│   └── vectorizer.pkl
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── README.md
└── requirements.txt
```

> File names may differ depending on the final saved model/vectorizer files.

## ⚙️ Installation

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd spam-classifier
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

If NLTK resources are not already available:

```python
import nltk

nltk.download("punkt")
nltk.download("punkt_tab")
nltk.download("stopwords")
```

## ▶️ Run the Backend

Open a terminal in the `backend` directory:

```bash
cd backend
uvicorn app:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

## 🌐 Run the Frontend

Open `frontend/index.html` in your browser.

The JavaScript frontend sends prediction requests to:

```text
POST http://127.0.0.1:8000/predict
```

Example request:

```json
{
  "message": "Congratulations! You have won a free prize!"
}
```

Example response:

```json
{
  "prediction": "spam",
  "confidence": 0.98
}
```

## 🧪 Example Messages

### Spam

```text
Congratulations! You have won a free prize. Click here to claim your reward!
```

### Not Spam

```text
Hey, are we still meeting at 5 pm today?
```

The exact prediction and confidence depend on the trained model.

## 👥 Team

### Ahsan Naaz
Machine Learning, NLP, backend integration, and project development.

### Abdul Rab
Project collaboration, Machine Learning/NLP development, and model implementation.

The professional frontend design and implementation was developed with assistance from **ChatGPT**.

## 🎯 Learning Outcomes

Through this project, we worked with:

- Natural Language Processing
- Text preprocessing
- Feature extraction with TF-IDF
- Machine Learning classification
- Model serialization with Pickle
- REST API development
- FastAPI
- Frontend and backend integration
- JavaScript API requests
- Building a complete end-to-end ML application

## 🔮 Future Improvements

- Add more training data
- Compare multiple ML algorithms
- Improve model evaluation and accuracy
- Add a larger message history
- Deploy the FastAPI backend
- Deploy the frontend
- Add authentication
- Add model performance metrics
- Add automated testing

## 📄 License

This project is intended for educational and portfolio purposes.

---

⭐ If you find this project useful, consider giving the repository a star!
