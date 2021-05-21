const socket = io('http://localhost:3000/');

const send = document.querySelector('.send');
const chatMessages = document.querySelector('.chat-messages');
const message = document.querySelector('.message-input');

function parseQuery(query) {
	return Qs.parse(query, {
		ignoreQueryPrefix: true,
	});
}
const { username, room } = parseQuery(location.search);

send.addEventListener('click', (e) => {
	socket.emit('out-message', { username, message: message.value });
});

message.addEventListener('keypress', (e) => {
	if (e.keyCode === 13) {
		socket.emit('out-message', { username, message: message.value });
	}
});

socket.on('in-message', (data) => {
	const p = document.createElement('p');
	p.classList.add('messages');

	if (username === data.username) {
		p.classList.add('right');
	}

	if (username !== data.username) {
		p.classList.add('left');
	}

	p.innerText = data.message;
	chatMessages.appendChild(p);
	message.value = '';
});
