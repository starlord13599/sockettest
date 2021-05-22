const express = require('express');
const path = require('path');
const expressEjsLayout = require('express-ejs-layouts');
// const { sequelize, User } = require('./models');
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

//testroute
// app.get('/', async (req, res) => {
// 	const users = await User.findAll();

// 	res.json(users);
// });

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

	//to emit number of online users
	io.emit('updateStatus', getUserCount(io) - 1);

	//catch message
	socket.on('out-message', (data) => {
		io.emit('in-message', data);
	});

	socket.on('disconnect', () => {
		io.emit('updateStatus', getUserCount(io) - 1);
	});
});

//server start
server.listen(3000, async () => {
	await sequelize.authenticate();
	console.log('Databse done');
	console.log('running on http://localhost:3000');
});

//Io Helper Functions
function getUserCount({ engine }) {
	const { clientsCount } = engine;
	return clientsCount;
}
