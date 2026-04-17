const { createSocketServer } = require('./backend/socket.js');
const { app } = require('./backend/api.js');

require('dotenv').config(); // for environment || .env

const http = require('http');
const server = http.createServer(app)
createSocketServer(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));