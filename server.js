const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const filePath = './game_state.json'; // Replace with the actual path to your output file

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    const sendFileContent = () => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                return;
            }
            socket.emit('fileContent', data);
        });
    };

    sendFileContent();
    fs.watchFile(filePath, { interval: 1000 }, (curr, prev) => { // Check every second
        sendFileContent();
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
