from flask import Flask, render_template
import socket

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    host = '0.0.0.0'
    port = 5000
    
    app.run(host=host, port=port, debug=True)