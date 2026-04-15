# client_receiver.py
import requests

SERVER_URL = "http://localhost:5000"
SAVE_PATH = "received_image.png"  # บันทึกไฟล์ที่รับมา

def list_available_files():
    response = requests.get(f"{SERVER_URL}/files")
    files = response.json()["files"]
    print(f"[Client B] ไฟล์ที่มีบน Server: {files}")
    return files

def download_file(filename, save_path):
    response = requests.get(f"{SERVER_URL}/download/{filename}", stream=True)
    if response.status_code == 200:
        with open(save_path, "wb") as f: # เปิดไฟล์เพื่อเขียนเป็น binary
            for chunk in response.iter_content(chunk_size=8192): # อ่านข้อมูลเป็นชิ้นๆ
                f.write(chunk) # เขียนข้อมูลลงไฟล์
        print(f"[Client B] รับไฟล์สำเร็จ → บันทึกที่: {save_path}")
    else:
        print(f"[Client B] ดาวน์โหลดล้มเหลว: {response.json()}")

# ดูไฟล์ที่มี แล้วดาวน์โหลด
files = list_available_files()
if files:
    download_file(files[0], SAVE_PATH)