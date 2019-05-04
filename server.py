from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import sys
import os

app = Flask(__name__)

# Enable CORS
CORS(app)

'''*** Initialize connection to Firebase databse (firestore) ***'''
# Use a service account
cred = credentials.Certificate('./serviceAccount.json')
firebase_admin.initialize_app(cred)

# Initialize db
db = firestore.client()

users_ref = db.collection(u'users')
docs = users_ref.stream()

for doc in docs:
    print(u'{} => {}'.format(doc.id, doc.to_dict()))

'''*** API routes ***'''
@app.route('/test', methods = ['GET'])
def test():
    # Format the response as JSON object
    return jsonify({"response": "hello world"})


if __name__ == '__main__':
    if os.environ['ENV'] == 'dev':
        app.run(debug=True, port=5000, ssl_context="adhoc")
    else:
        app.run(port=5000)
    