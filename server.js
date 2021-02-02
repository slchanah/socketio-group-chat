const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
const server = http.Server(app);

const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

io.on('connection', (socket) => {});

server.listen(3030, () => {
  console.log('Server starts');
});
