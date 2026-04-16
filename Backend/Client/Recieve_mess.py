# import requests
# SERVER_URL = "http://localhost:5000"
# def receive_message():
#     response = requests.get(f"{SERVER_URL}/receive_message") # ส่งคำขอรับข้อความจาก Server

#     if response.status_code == 200: # ตรวจสอบผลลัพธ์
#         data = response.json() # แปลงผลลัพธ์เป็น JSON
#         print(f"[Client B] รับข้อความสำเร็จ: {data['message']}")
#     else:
#         print(f"[Client B] รับข้อความล้มเหลว: {response.json()}")
# receive_message() # เรียกฟังก์ชันรับข้อความ

