from dataFormatter import *
from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore, auth
import json
import sys
import os
import datetime

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

# Initialize dictionary as a cache
USER_INFO = dict()

'''*** API routes ***'''
@app.route('/_api/fetchTransactions', methods = ['GET'])
def fetchTransactions():

    # 1. Verify user's accessToken
    accessToken = request.headers.get("accessToken")
    isAuth = isAuthenticated(accessToken)

    if(not isAuth[0]):
        # If verification fails, return error message
        response = jsonify({"ErrorMessage": "Invalid Access Token"})
        response.status_code = 400
        return response

    decoded_token = isAuth[1]
    uid = decoded_token['uid']

    # Check if user with UID uid already exists in memory
    if(uid in USER_INFO):
        # Return this info
        return jsonify(USER_INFO[uid])
    
    # 2. Build the path where the user UID has all their transactions
    endpoint = u'users/' + uid + u'/records'

    # 2.1 Before retrieving results, check if user with UID uid exists in our database; if not, create entry
    userExists = verifyUserExists(db, uid, endpoint=u'users')

    if(not userExists):
        createNewUserEntry(db, uid, decoded_token, endpoint=u'users')

    # 3. Get all records for current user, ordered by date
    docs = db.collection(endpoint).order_by(u"Date").get()
    resp = formatTransactionRecords(docs)

    # Add this data to memory for user with UID uid
    USER_INFO[uid] = resp
    print("Added user with UID", uid, "to memory.")

    # 4. Format and return the response as JSON object
    return jsonify(resp)

@app.route('/_api/createTransaction', methods = ['POST'])
def createTransaction():

    # 1. Verify user's accessToken
    accessToken = request.headers.get("accessToken")
    isAuth = isAuthenticated(accessToken)

    if(not isAuth[0]):
        # If verification fails, return error message
        response = jsonify({"ErrorMessage": "Invalid Access Token"})
        response.status_code = 400
        return response

    # Retrieve user's UID
    decoded_token = isAuth[1]
    uid = decoded_token['uid']

    # Transaction data in the form of a dictionary
    newTransactionData = request.get_json()
    
    # Validarte transaction data
    if(not (validateDate(newTransactionData))):
        # Since there are errors in the transaction data, return bad request
        response = jsonify({"ErrorMessage": "Improper transaction data"})
        response.status_code = 400
        return response

    # Clear entry for user with UID uid from memory
    if(uid in USER_INFO):
        USER_INFO.pop(uid)
        print("Removed user with UID", uid, "from memory.")

    print(newTransactionData)
    # Format the new transaction data into something Firestore will accept
    postData = {
        u'Title': newTransactionData['title'],
        u'Amount': float(newTransactionData['amountSpent']),
        u'Date': formatDate(newTransactionData['date']),
        u'Location': newTransactionData['location'],
        u'Category': newTransactionData['category'],
        u'Notes': newTransactionData['additionalNotes']
    }

    # 4. Format and return the response as JSON object
    try:
        db.collection(u'users').document(uid).collection(u'records').add(postData)
        return jsonify({"ok": True})
    except:
        return jsonify({"ok": False, "Error": "An error ocurred while attempting to create a new transaction."})


@app.route('/_api/deleteTransaction', methods = ['POST'])
def deleteTransaction():
     # 1. Verify user's accessToken
    accessToken = request.headers.get("accessToken")
    isAuth = isAuthenticated(accessToken)

    if(not isAuth[0]):
        # If verification fails, return error message
        response = jsonify({"ErrorMessage": "Invalid Access Token"})
        response.status_code = 400
        return response

    # Retrieve user's UID
    decoded_token = isAuth[1]
    uid = decoded_token['uid']

    # Transaction ID in the form of a dictionary
    transactionID = request.get_json()
    print("Removing transaction with ID:", transactionID['transactionID'])

    # Clear entry for user with UID uid from memory
    if(uid in USER_INFO):
        USER_INFO.pop(uid)
        print("Removed user with UID", uid, "from memory.")

    # If transaction exists with id, delete it. Otherwise, this line does nothing
    db.collection(u'users').document(uid).collection(u'records').document(transactionID['transactionID']).delete()

    return jsonify("Done")

'''* Check if recieved accessToken is valid or not *
    * (object) => [bool, str/None]
'''
def isAuthenticated(accessToken):
    try:
        decoded_token = auth.verify_id_token(accessToken)
        return [True, decoded_token]
    except:
        # If verification fails, return False
        return [False, None]


'''* A funtion to check if a user with UID uid exists in our Cloud Firestore database *
    * (object, string, string) => bool
'''
def verifyUserExists(db, uid, endpoint):
    users = db.collection(endpoint).stream()
    
    # Set of all users in database
    userList = set()

    for user in users:
        userList.add(user.id)

    # Check if uid exists in userList, and return true if so
    if(uid in userList):
        return True

    return False

'''* A funtion to create initial entries for user with UID uid in Firestore *
    * (object, string, string, string) => none
'''
def createNewUserEntry(db, uid, decoded_token, endpoint):

    # Parse decoded token for user's name and extract
    userName = decoded_token["name"].split(" ")
    middleNames = ""

    # If the person has middle names
    if(len(userName) > 2):
        # Join all middle names into a single string
        middleNames = ' '.join(userName[1 : len(userName) - 1])

    # STEP 1: Create fields for this new user which include the data below
    newUserFields = db.collection(endpoint).document(uid)
    newUserFields.set({
        u'firstName': userName[0],
        u'middleNames': middleNames,
        u'lastName': userName[-1]
    })

    # STEP 2: Create a new collection "records" to hold all transactions made by this user
    newUserTransactions = db.collection(endpoint).document(uid).collection(u'records').document()
    # We use "set" so Firebase can give it an auto-generated ID
    newUserTransactions.set({
        u'Amount': 200,
        u'Date': u'01-01-1970',
        u'Location': u'__initial_record__',
        u'Notes': u'something blah blah',
        u'Title': u'__initial_record__'
    })

    print("ADDED NEW USER", userName, "with UID", uid)


if __name__ == '__main__':
    try:
        if os.environ['ENV'] == 'dev':
            app.run(debug=True, port=5000, threaded=True)
    except:
        app.run(threaded=True)
    