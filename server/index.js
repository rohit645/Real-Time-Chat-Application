const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const cors = require('cors');

const PORT = process.env.PORT || 5000;
const router = require('./router');
const { config } = require('process');
const {addUser, removeUser, getUser, getUsersInRoom} = require('./users');


const app = express();
const server = http.createServer(app);
const io = socketIO(server);

io.on('connect', (socket) => {
    socket.on('join', ({name, room}, callback) => {
        const {error, user} = addUser({id: socket.id, name: name, room: room});
        if(error) return callback({error});

        socket.emit('message', { user: 'admin', text: `${user.name}, Welcome to room ${user.room}` });
        socket.broadcast.to(user.room).emit('message', {user: 'admin', text: `${user.name} has joined the room!`});
        
        socket.join(user.room);
        
        io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom({room: user.room})});

        callback();
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser({id: socket.id});
        io.to(user.room).emit('message', { user: user.name, text: message });
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom({room: user.room})});
        callback();
    })

    socket.on('disconnect', () => {
        const user = removeUser({id: socket.id});
        
        if(user) {
            io.to(user.room).emit('message', {user: 'admin', text: `${user.name} has left the room.`})
        }      
    })
});

app.use(router);
app.use(cors());

server.listen(PORT, () => console.log(`server is listening at port ${PORT}`));
