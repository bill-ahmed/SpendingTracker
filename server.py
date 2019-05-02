from flask import Flask, request

app = Flask(__name__)

@app.route('/test', methods = ['GET'])
def test():
    return {'hello': 'world'}


if __name__ == '__main__':
    app.run(debug=True, port=5000)