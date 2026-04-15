# server.py
from flask_cors import Flask, request, send_file, jsonify
import os

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Client A อัปโหลดไฟล์
@app.route("/upload", methods=["POST"]) 
def upload():
    if "file" not in request.files:
        return jsonify({"error": "No file"}), 400
    
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No filename"}), 400
    
    save_path = os.path.join(UPLOAD_FOLDER, file.filename) # เตรียม path สำหรับบันทึกไฟล์
    file.save(save_path) # บันทึกไฟล์ลงในโฟลเดอร์ uploads
    print(f"[Server] รับไฟล์: {file.filename}")
    return jsonify({"message": "Upload success", "filename": file.filename}), 200

# Client B ดาวน์โหลดไฟล์
@app.route("/download/<filename>", methods=["GET"])
def download(filename):
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404 # ไฟล์ไม่พบ
    
    print(f"[Server] ส่งไฟล์: {filename}")
    return send_file(file_path, mimetype="image/png")

# ดูรายการไฟล์ทั้งหมด
@app.route("/files", methods=["GET"])
def list_files():
    files = os.listdir(UPLOAD_FOLDER)
    return jsonify({"files": files})

@app.route("/send_message", methods=["POST"])
def send_message():
    data = request.get_json()
    message = data.get("message")
    print(f"[Server] รับข้อความ: {message}")
    global M
    M = message
    return jsonify({"message": "Message received"}), 200

@app.route("/receive_message", methods=["GET"])
def receive_message():
    # ตัวอย่างการส่งข้อความกลับไปยัง Client
    global M
    print(f"[Server] ส่งข้อความ: {M}")
    return jsonify({"message": M}), 200

M = "Default Message" # ตัวแปรเก็บข้อความที่ Client A ส่งมา
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
