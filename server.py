from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS
CORS(app)

@app.route('/test', methods = ['GET'])
def test():
    # Format the response as JSON object
    return jsonify({"response": "hello world"})


if __name__ == '__main__':
    app.run(debug=True, port=5000)