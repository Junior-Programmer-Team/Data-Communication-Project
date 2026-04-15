from flask import Flask, send_from_directory, jsonify, request
from flask_sqlalchemy import SQLAlchemy
import os
import uuid

app = Flask(__name__, static_folder='public')

# ----- Database ----- #
db_url = os.environ.get('DATABASE_URL', 'postgresql://user:password@localhost/dbname')
# db_url = 'sqlite:///test.db'

if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

app.config['SQLALCHEMY_DATABASE_URI'] = db_url + "?sslmode=require"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Table Model
class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String(80))

# Create Table (First time only)
with app.app_context():
    db.create_all()

# Input send to database and console.log 
@app.post('/input')
def sendtoDB():
    data = request.json
    messageText = data.get('input_text')

    new_message = Message(id=(uuid.uuid4()), message=messageText)

    db.session.add(new_message)
    db.session.commit()

    print("This is sent message: " + new_message)

    return jsonify({"id":new_message.id, "message_object": new_message})

# Route for HTML
@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    app.run(host="0.0.0.0", 
            port=int(os.environ.get("PORT", 3000)), 
            debug = os.environ.get("ENV") != "production" )