const express = require('express');
const path = require('path');
const expressEjsLayout = require('express-ejs-layouts');

const morgan = require('morgan');
const app = express();

const http = require('http');
const socketio = require('socket.io');

const server = http.createServer(app);
const io = socketio(server);

app.use(morgan('dev'));

app.set('view engine', 'ejs');
app.use(expressEjsLayout);
app.set('layout', path.join(__dirname, 'views', 'layouts', 'oneColumn.ejs'));
app.use(express.static('public'));

//routes to pages
app.get('/home', (req, res) => {
	res.render('home');
});

app.get('/chat', (req, res) => {
	res.render('chatRoom');
});

//io createServer
io.on('connection', (socket) => {
	console.debug('User connected');
	console.debug(getUserCount(io));

	//catch message
	socket.on('out-message', (data) => {
		io.emit('in-message', data);
	});

	socket.on('disconnect', () => {
		console.debug('A user left');
		console.debug(getUserCount(io));
	});
});

//server start
server.listen(3000, () => {
	console.log('running on http://localhost:3000');
});

//Io Helper Functions
function getUserCount({ engine }) {
	const { clientsCount } = engine;
	return clientsCount;
}
