// server.js
const express = require('express');
const mysql = require('mysql');
const http = require('http');
const socketIo = require('socket.io');

// Create an Express application
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // replace with your MySQL password
    database: 'mydatabase'
});

db.connect(err => {
    if (err) {
        console.error('Could not connect to MySQL:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL');
});

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Socket.io connection
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle 'message' event
    socket.on('message', (msg) => {
        console.log('Message received:', msg);

        // Insert the message into the database
        const query = 'INSERT INTO messages (content) VALUES (?)';
        db.query(query, [msg], (err, result) => {
            if (err) {
                console.error('Error inserting message:', err);
                return;
            }
            console.log('Message inserted with ID:', result.insertId);
        });

        // Broadcast the message to all connected clients
        io.emit('message', msg);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
