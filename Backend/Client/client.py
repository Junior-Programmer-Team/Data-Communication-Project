#6730611036 นายธเนศ งามพสุธาดล
#6730611019 นายศุภกร ทวีรันต์

import socket

# Create a TCP/IP socket
client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# 172.19.182.251
# 172.19.183.26
# Connect the socket to the server
server_address = ("172.19.183.26", 10000)

client_socket.connect(server_address)

try:
    while True:
        # Send message
        message = input('You: ')
        client_socket.sendall(message.encode())

        # Receive response
        data = client_socket.recv(1024)
        print('Server:', data.decode())
finally:
    client_socket.close()