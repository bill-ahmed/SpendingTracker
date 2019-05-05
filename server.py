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

# If in dev environment, use relative local path
try:
    if os.environ['ENV'] == 'dev':
        cred = credentials.Certificate('./serviceAccount.json')
except:
    cred = credentials.Certificate('/etc/secrets/serviceAccount.json')


'''*** Initialize connection to Firebase databse (firestore) ***'''
# Use a service account
firebase_admin.initialize_app(cred)

# Initialize db
db = firestore.client()

'''*** API routes ***'''
@app.route('/_api/fetchTransactions', methods = ['POST'])
def test():
    data = request.json

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

    resp = formatTransactionRecords(docs)

    # 4. Format and return the response as JSON object
    return jsonify(resp)


'''*** Format the data recieved from Firestore into a more usable format ***
    * (dict) => dict
'''
def formatTransactionRecords(docs):
    resp = {}
    raw_data = []

    # 1. Store ID's of eahc transaction
    uid = []
    # 2. Store the names of each location
    locations = []
    # 3. Store the amount spent at each location
    amountSpent = []

    for doc in docs:
        temp_doc = doc.to_dict()

        # Append appropriate information to each array
        uid.append(doc.id)
        locations.append(temp_doc["Title"])
        amountSpent.append(temp_doc["Amount"])

        # Append unformatted data to the end in case we need it later on...
        raw_data.append({"id": doc.id, "data": doc.to_dict()})

    resp["uid"] = uid
    resp["locations"] = locations
    resp["amountSpend"] = amountSpent
    resp["raw_data"] = raw_data

    return resp

if __name__ == '__main__':
    try:
        if os.environ['ENV'] == 'dev':
            app.run(debug=True, port=5000)
    except:
        app.run()
    