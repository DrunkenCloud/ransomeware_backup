from flask import Flask, jsonify, render_template
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/logs')
def get_logs():
    try:
        with open("detection_logs.txt", "r") as f:
            logs = f.read()
        return jsonify({"logs": logs})
    except FileNotFoundError:
        return jsonify({"logs": "No logs found yet."})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
