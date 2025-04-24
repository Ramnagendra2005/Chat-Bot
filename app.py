from flask import Flask, render_template, request, jsonify
import google.generativeai as genai

app = Flask(__name__)

# Initialize Gemini API
API_KEY = ""
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-1.5-pro")  # Use latest model

# Function to format bot responses properly
def format_response(text):
    formatted_text = text.replace("\n", "<br>")  # Preserve line breaks
    return formatted_text

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message", "")

    try:
        response = model.generate_content(user_message)
        if response and response.text:
            formatted_response = format_response(response.text)
        else:
            formatted_response = "I'm sorry, I couldn't understand that."

        return jsonify({"response": formatted_response})
    except Exception as e:
        return jsonify({"response": f"Error: {str(e)}"})

if __name__ == "__main__":
    app.run(debug=True)
