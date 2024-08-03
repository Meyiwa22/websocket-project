// public/client.js
const socket = io();

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const input = document.querySelector('input');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const message = input.value;
        socket.emit('message', message);

        input.value = '';
    });

    socket.on('message', (msg) => {
        const messageElement = document.createElement('div');
        messageElement.textContent = msg;
        document.querySelector('#messages').appendChild(messageElement);
    });
});
