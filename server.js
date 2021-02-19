const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
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

io.on('connection', (socket) => {
  socket.on('validate-roomId', (ROOM_ID) => {
    const isExisted = io.sockets.adapter.rooms.get(ROOM_ID);

    if (isExisted) {
      socket.emit('validated-roomId', ROOM_ID);
    } else {
      socket.emit('validated-roomId');
    }
  });

  socket.on('join-room', (ROOM_ID) => {
    const clientIds = Array.from(io.sockets.adapter.rooms.get(ROOM_ID) || []);

    if (clientIds.length >= 2) {
      socket.emit('room-full');
    } else {
      socket.join(ROOM_ID);
      socket.emit('all-socket-ids', clientIds);
    }
  });

  socket.on('send-signal', (peerId, callerId, signal) => {
    io.to(peerId).emit('user-connected', callerId, signal);
  });

  socket.on('answer-signal', (answerId, callerId, signal) => {
    io.to(callerId).emit('returning-signal', answerId, signal);
  });

  socket.on('user-disconnect', (socketId, ROOM_ID) => {
    socket.to(ROOM_ID).emit('destroy-peer', socketId);
    socket.leave(ROOM_ID);
  });

  socket.on('send-message', (username, message, ROOM_ID) => {
    socket.to(ROOM_ID).emit('receive-message', username, message);
  });
});

server.listen(3030, () => {
  console.log('Server starts');
});
