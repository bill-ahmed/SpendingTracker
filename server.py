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
@app.route('/_api/fetchTransactions', methods = ['GET'])
def fetchTransactions():

    # 1. Verify user's accessToken
    try:
        decoded_token = auth.verify_id_token(request.headers.get("accessToken"))
    except:
        # If verification fails, return error message
        response = jsonify({"ErrorMessage": "Invalid Access Token"})
        response.status_code = 400
        return response
    
    uid = decoded_token['uid']
    
    # 2. Build the path where the user UID has all their transactions
    endpoint = u'users/' + uid + u'/records'

    # 2.1 Before retrieving results, check if user with UID uid exists in our database; if not, create entry
    userExists = verifyUserExists(db, uid, endpoint=u'users')

    if(not userExists):
        createNewUserEntry(db, uid, decoded_token, endpoint=u'users')

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
    resp["amountPerLocation"] = dict()
    resp["amountPerDay"] = dict()
    totalTransactionsPerDate = dict()

    raw_data = []

    # 1.1 Store ID's of eahc transaction
    uid = []
    # 1.2 User defined titles of each transaction
    titles = []
    # 1.3 Store the names of each location
    locations = []
    # 1.4 Store the amount spent at each location
    amountSpent = []

    # 2.1 All the unique dates that transactions were made
    transactionDates = []
    # 2.2 Total expenses per date
    totalExpenses = []

    for doc in docs:
        temp_doc = doc.to_dict()

        # Apend appropriate information to each arrayp
        uid.append(doc.id)
        titles.append(temp_doc["Title"])
        locations.append(temp_doc["Location"])
        amountSpent.append(temp_doc["Amount"])

        # Add data to the resp["amountPerDay"] dictionary
        if(temp_doc["Date"] in totalTransactionsPerDate):
            totalTransactionsPerDate[temp_doc["Date"]] += temp_doc["Amount"]
        else:
            totalTransactionsPerDate[temp_doc["Date"]] = temp_doc["Amount"]

        # Append unformatted data to the end in case we need it later on...
        raw_data.append({"id": doc.id, "data": doc.to_dict()})
    
    print(totalTransactionsPerDate)
    # Go through the resp["amountPerDay"] dictionary an collect all keys and values into separate 
    for key in totalTransactionsPerDate:
        transactionDates.append(key)
        totalExpenses.append("%.2f" % totalTransactionsPerDate[key]) # Round to 2 decimal places
    
    resp["amountPerDay"]["dates"] = transactionDates
    resp["amountPerDay"]["totalExpenses"] = totalExpenses

    resp["amountPerLocation"]["uid"] = uid
    resp["amountPerLocation"]["Title"] = titles
    resp["amountPerLocation"]["locations"] = locations
    resp["amountPerLocation"]["amountSpent"] = amountSpent
    resp["amountPerLocation"]["raw_data"] = raw_data

    return resp

'''*** A funtion to check if a user with UID uid exists in our Cloud Firestore database ***
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

'''*** A funtion to create initial entries for user with UID uid in Firestore ***
    * (object, string, string) => none
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
    # We use "add" so Firebase can give it an auto-generated ID
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
    