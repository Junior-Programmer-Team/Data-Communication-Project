from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder='public')

# Route for HTML
@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 3000)), debug = os.environ.get("ENV") != "production")