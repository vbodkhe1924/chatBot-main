from flask import Flask, render_template, request, jsonify, session, redirect, url_for, flash
import random, spacy, json, os
import torch
import torch.nn.functional as NNF
from sklearn.metrics.pairwise import cosine_similarity
from transformers import AutoTokenizer, AutoModel
from flask_cors import CORS
import openai  # OpenAI integration
from dotenv import load_dotenv  
from pymongo import MongoClient  # MongoDB integration

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = '7063b0e6bb0f98096c1aa870ea54957fbee9925f0f24260131c1a4ae72304a3b'
nlp = spacy.load("en_core_web_sm")

# Set OpenAI API Key from .env
openai.api_key = os.getenv("OPENAI_API_KEY")

# MongoDB connection
client = MongoClient("mongodb+srv://abcd:1234@cluster1.1dvtj.mongodb.net/?retryWrites=true&w=majority&appName=cluster1")
db = client['main_db']
users_collection = db['users']
feedback_collection = db['feedback']  # Collection for feedback

# Load Transformer model and tokenizer
tokenizer = AutoTokenizer.from_pretrained('sentence-transformers/all-MiniLM-L6-v2')
model = AutoModel.from_pretrained('sentence-transformers/all-MiniLM-L6-v2')

# Load intents from the JSON file
with open(os.path.join(os.getcwd(), 'About us.json'), 'r') as file:
    intents = json.load(file)['intents']

users = {}

def load_users():
    global users
    if os.path.exists(os.path.join(os.getcwd(), 'users.json')):
        with open('users.json', 'r') as file:
            users = json.load(file)

def save_users():
    with open(os.path.join(os.getcwd(), 'users.json'), 'w') as file:
        json.dump(users, file)

load_users()

# Mean pooling for sentence embeddings
def mean_pooling(model_output, attention_mask):
    token_embeddings = model_output[0]
    input_mask_expanded = attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()
    return torch.sum(token_embeddings * input_mask_expanded, 1) / torch.clamp(input_mask_expanded.sum(1), min=1e-9)

# Function to compute similarity scores using Transformer embeddings
def compute_similarity(input_sentence, sentences):
    encoded_input = tokenizer(input_sentence, padding=True, truncation=True, return_tensors='pt')
    with torch.no_grad():
        input_model_output = model(**encoded_input)
    input_sentence_embedding = mean_pooling(input_model_output, encoded_input['attention_mask'])
    input_sentence_embedding = NNF.normalize(input_sentence_embedding, p=2, dim=1)

    encoded_sentences = tokenizer(sentences, padding=True, truncation=True, return_tensors='pt')
    with torch.no_grad():
        sentences_model_output = model(**encoded_sentences)
    sentences_embeddings = mean_pooling(sentences_model_output, encoded_sentences['attention_mask'])
    sentences_embeddings = NNF.normalize(sentences_embeddings, p=2, dim=1)

    similarities = cosine_similarity(input_sentence_embedding, sentences_embeddings)
    sentences_with_scores = list(zip(sentences, similarities[0]))
    sorted_sentences = sorted(sentences_with_scores, key=lambda x: x[1], reverse=True)

    return sorted_sentences[0][0], sorted_sentences[0][1]

# Function to get a response from OpenAI if no good match is found
def get_openai_response(user_message):
    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are an assistant that provides responses over RCOEM(Shri Ramdeobaba college of Engineeering and Management Nagpur) Nagpur which is recently renamed as RBU Nagpur(Ramdeobaba University Nagpur) ."},
            {"role": "user", "content": user_message}
        ],
    )
    content = response['choices'][0]['message']['content']
    return content.replace('**', '').replace('###', '').strip()

# Route for the chatbot
@app.route('/chatbot')
def chatbot():
    session['conversation'] = []
    return render_template('index.html')

SIMILARITY_THRESHOLD = 0.75
@app.route('/ask', methods=['POST'])
def ask():
    data = request.get_json()
    user_message = data.get('inputValue', '').lower()

    if 'conversation' not in session:
        session['conversation'] = []

    session['conversation'].append({'user': user_message})

    predefined_patterns = []
    intent_responses = {}

    for intent in intents:
        predefined_patterns.extend(intent['patterns'])
        for pattern in intent['patterns']:
            intent_responses[pattern] = random.choice(intent['responses'])

    best_match, best_match_score = compute_similarity(user_message, predefined_patterns)

    if best_match_score < SIMILARITY_THRESHOLD:
        response = get_openai_response(user_message)
    else:
        response = intent_responses.get(best_match, "I'm not sure how to respond to that, but I'm learning!")

    session['conversation'].append({'bot': response})
    
    # Ask user if they are satisfied
    return jsonify({'response': response, 'satisfaction': 'Are you satisfied with this response?'})

# Route for handling satisfaction feedback
# FEEDBACK_FILE = 'feedback.json'

@app.route('/feedback', methods=['POST'])
def feedback():
    data = request.get_json()
    satisfied = data.get('satisfied', False)  # Boolean: True or False
    email = data.get('email', '')  # Email if dissatisfied

    # Create the feedback entry
    feedback_entry = {
        'satisfied': satisfied,
        'Feedback': email,
        'message': 'User dissatisfied with chatbot response' if not satisfied else 'User satisfied with chatbot response'
    }

    # Check if the feedback is from a satisfied user
    if not satisfied:
        if email:
            # Insert feedback into MongoDB
            feedback_collection.insert_one(feedback_entry)
            return jsonify({'message': 'Thank you! We will reach out to you for further assistance.'}), 200
        else:
            return jsonify({'message': 'Please provide your email for further assistance.'}), 400
    else:
        # Insert feedback into MongoDB for satisfied user as well
        feedback_collection.insert_one(feedback_entry)
        return jsonify({'message': 'Thank you for your feedback!'}), 200


# Route for user login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['username']
    password = data['password']

    # Check if the user exists in MongoDB
    user = users_collection.find_one({'email': email})

    if user and user['password'] == password:
        session['email'] = email  # Save email in session
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'message': 'Invalid email or password'}), 401

# Route for user signup
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        first = request.json.get('first-name')
        last = request.json.get('last-name')
        email = request.json.get('email')
        password = request.json.get('password')

        # Check if the email is already taken in MongoDB
        if users_collection.find_one({'email': email}):
            return jsonify({'success': False, 'message': 'Email already taken'}), 400
        else:
            # Insert the new user into MongoDB
            users_collection.insert_one({'first-name': first, 'last-name': last, 'email': email, 'password': password})
            return jsonify({'success': True, 'message': 'Account created successfully! Please login.'}), 201

@app.route('/logout', methods=['POST'])
def logout():
    session.clear()  # Clear the session
    return jsonify({'message': 'Logged out successfully!'}), 200

if __name__ == "__main__":
    app.run(debug=True)
