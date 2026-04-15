import requests
import os
# สำหรับระบุ URLหรือIP ของ Server
SERVER_URL = "http://localhost:5000" 

FILE_PATH = "page2.png"  # input ไฟล์ที่ต้องการส่ง
def  upload_file(filepath):
    filename = os.path.basename(filepath) #ดึงชื่อไฟล์จาก path

    with open(filepath,"rb") as f: # เปิดไฟล์อ่านเป็น binary
        files = {"file":(filename,f,"image/png")} #เตรียมข้อมูลสำหรับส่ง
        response = requests.post(f"{SERVER_URL}/upload",files=files) #ส่งไฟล์ไปที่ Server

    if response.status_code == 200: #ตรวจสอบผลลัพธ์
        data = response.json() #แปลงผลลัพธ์เป็น JSON
        print(f"[Client A] ส่งสำเร็จ: {data['filename']}")
        return data["filename"]
    else:
        print(f"[Client A] ส่งล้มเหลว: {response.json()}")
        return None
    

filename = upload_file(FILE_PATH) #เรียกฟังก์ชันส่งไฟล์