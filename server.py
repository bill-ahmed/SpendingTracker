from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)

# Enable CORS
CORS(app)

@app.route('/test', methods = ['GET'])
def test():
    # Format the response as JSON object
    return jsonify({"response": "hello world"})


if __name__ == '__main__':
    if os.environ['ENV'] == 'dev':
        app.run(debug=True, port=5000, ssl_context="adhoc")
    else:
        app.run(port=5000)
    