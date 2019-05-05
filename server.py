from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore, auth
import json
import sys
import os

app = Flask(__name__)

# Enable CORS
CORS(app)

'''*** Initialize connection to Firebase databse (firestore) ***'''
# Use a service account
# If in dev environment, use relative local path
if os.environ['ENV'] == 'dev':
    cred = credentials.Certificate('./serviceAccount.json')
else:
    cred = credentials.Certificate('/etc/secrets/serviceAccount.json')

firebase_admin.initialize_app(cred)

# Initialize db
db = firestore.client()

'''*** API routes ***'''
@app.route('/_api/fetchData', methods = ['POST'])
def test():
    data = request.json

    # Store results from firestore
    resp = []

    # 1. Verify user's accessToken
    try:
        decoded_token = auth.verify_id_token(data["accessToken"])
    except:
        # If verification fails, return error message
        response = jsonify({"ErrorMessage": "Invalid Access Token"})
        response.status_code = 400
        return response
    
    uid = decoded_token['uid']
    
    # 2. Build the path where the user UID has all their transactions
    endpoint = u'users/' + uid + u'/records'
    # print(endpoint, file=sys.stdout)

    # 3. Get all records for current user
    users_ref = db.collection(endpoint)
    docs = users_ref.stream()

    for doc in docs:
        # Format and append results to resp array
        resp.append({"id": doc.id, "data": doc.to_dict()})

    # 4. Format and return the response as JSON object
    return jsonify(resp)


if __name__ == '__main__':
    if os.environ['ENV'] == 'dev':
        app.run(debug=True, port=5000)
    else:
        app.run()
    