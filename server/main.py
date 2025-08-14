from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
from dotenv import load_dotenv
import os
from langchain_groq import ChatGroq

load_dotenv()

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)  # Enable CORS for React

# GROQ
@app.route('/api/chat1', methods=['POST'])
def chat1():
    user_input = request.json.get('message')
    llm = ChatGroq(
        model_name="llama-3.3-70b-versatile", 
        api_key=os.getenv("GROQ_API_KEY")
    )

    res = llm.invoke(
       "give small and quick replies like human to the user query, " + user_input
    )

    return jsonify({"response": res.content})

# Deepseek
@app.route('/api/chat2', methods=['POST'])
def chat2():
    user_input = request.json.get('message')
    API_KEY = os.getenv("OPENROUTER_API_KEY")
    MODEL = "deepseek/deepseek-r1:free"

    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        f"Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": "You are an expert in fitness trainer. Give brief explaination in a human centric way. No need of much formating of the text. Give answer to the user query breifly."},
            {"role": "user", "content": user_input}
        ],
        "temperature": 0.8,  # Adjusts randomness; higher = more creative
        "top_p": 0.7,  # Controls token probability sampling
    }

    try:
        response = requests.post(url, headers=headers, data=json.dumps(data))
        
        if response.status_code == 200:
            result = response.json()
            choice = result.get("choices", [{}])[0]
            bot_response = choice.get("message", {}).get("content", "No response available")
            finish_reason = choice.get("finish_reason", "")

            return jsonify({"response": bot_response.strip()})
        else:
            return jsonify({"response": "Error: " + response.text})

    except requests.exceptions.RequestException as e:
        return jsonify({"response": "Error: " + str(e)})    
    
#Llama 3.2
@app.route('/api/chat3', methods=['POST'])
def chat3():
    user_input = request.json.get('message')
    response = ollama.chat(
        model="llama3.2",
        messages=[
            {"role": "system", "content": "You are an expert in business management. Give brief explaination and put it out in points."},
            {"role": "user", "content": user_input},
        ]
    )

    return jsonify({"response": response['message']['content']})

# WikiPedia Image
@app.route('/api/image', methods=['POST'])
def image():
    try:
        user_input = request.json.get('message')
        reponse = requests.get(f"https://en.wikipedia.org/w/api.php?action=query&titles={user_input}&prop=pageimages&format=json&pithumbsize=500")
        data = reponse.json()
        pages = data["query"]["pages"]
        first_page = next(iter(pages.values()))
        image_link = first_page["thumbnail"]["source"]

        return jsonify({"response": image_link})
    except Exception as e:
        return jsonify({"response": "Error: " + str(e)})

# WikiPedia Text
@app.route('/api/text', methods=['POST'])
def text():
    user_input = request.json.get('message')
    # reponse = requests.get(f"https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext&titles={user_input}&format=json")
    # data = reponse.json()

    # pages = data["query"]["pages"]
    # page = next(iter(pages.values()))  # Get the first (and only) page
    # text = page.get("extract", "")

    # llm = ChatGroq(
    #     model_name="llama-3.3-70b-versatile", 
    #     api_key=os.getenv("GROQ_API_KEY")
    # )

    # res = llm.invoke(
    #    "convert this text into points and make it easy to understand for humans, " + text
    # )

    # return jsonify({"response": res.content})

    webhook_url = 'https://adityarish.app.n8n.cloud/webhook/a011a4a7-4b48-4fd6-aaf3-7be82315a47f/chat'

    payload = {
        'chatInput': "tell about this topic in points, " + user_input,
        'sessionId': '123',
    }

    headers = {
        'Content-Type': 'application/json'
    }

    try:
        response = requests.post(webhook_url, json=payload, headers=headers)

        response.raise_for_status()

        return jsonify({"response": response.text})

    except requests.exceptions.RequestException as e:
        return jsonify({"response": "Error: " + str(e)})


if __name__ == '__main__':
    # Create templates and static directories if they don't exist
    os.makedirs('templates', exist_ok=True)
    os.makedirs('static', exist_ok=True)
    app.run(debug=True)
