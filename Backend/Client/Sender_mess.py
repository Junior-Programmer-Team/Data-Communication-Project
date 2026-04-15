import requests
# สำหรับระบุ URLหรือIP ของ Server
SERVER_URL = "http://localhost:5000" 

def send_message(message):
    data = {"message": message} # เตรียมข้อมูลสำหรับส่ง
    response = requests.post(f"{SERVER_URL}/send_message", json=data) # ส่งข้อความไปที่ Server

    if response.status_code == 200: # ตรวจสอบผลลัพธ์
        print(f"[Client A] ส่งข้อความสำเร็จ: {message}")
    else:
        print(f"[Client A] ส่งข้อความล้มเหลว: {response.json()}")
MESSAGE = input("Enter message to send: ")  # input ข้อความที่ต้องการส่ง
send_message(MESSAGE) # เรียกฟังก์ชันส่งข้อความ