var PORT = process.env.PORT || 3000;
var moment = require('moment');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

//key-value pair, key is unique socket-io id, value is the whatever the user join the room with
var clientInfo = {};

//Sends current users to provided socket
function sendCurrentUsers(socket) {
	var info = clientInfo[socket.id];
	var users = [];

	//check if the user is in the room
	if(typeof info === 'undefined'){
		return;
	}

	Object.keys(clientInfo).forEach(function (socketId) {
		var userInfo = clientInfo[socketId];

		if (info.room === userInfo.room) {
			users.push(userInfo.name);
		}
	});

	socket.emit('message', {
		name: 'System',
		text: 'Current users: ' + users.join(', '),
		timestamp: moment().valueOf()
	});
}

//listen for events
io.on('connection', function (socket) {
	console.log('User connected via socket.io!');

	socket.on('disconnect', function () {
		var userData = clientInfo[socket.id];

		if(typeof userData !== 'undefined'){
			socket.leave(userData.room);
			io.to(userData.room).emit('message', {
				name: 'System',
				text: userData.name + ' has left',
				timestamp: moment().valueOf()
			});
			delete clientInfo[socket.id];
		}
	});

	socket.on('joinRoom', function (req) {
		clientInfo[socket.id] = req;
		//build-in io
		socket.join(req.room);     
		socket.broadcast.to(req.room).emit('message', {
			name: 'System',
			text: req.name + ' has joined',
			timestamp: moment().valueOf()
		});        
	});

	socket.on('message', function (message) {
		console.log('message recieved!' + message.text);

		if (message.text === '@currentUsers') {
			sendCurrentUsers(socket);
		}else{
			message.timestamp = moment().valueOf();
			io.to(clientInfo[socket.id].room).emit('message', message);
			//socket.emit('message', message);			
		}
	});

	socket.emit('message', {
		name: 'System ',
		text: 'welcome to the chat application',
		timestamp: moment().valueOf()
	})
});

http.listen(PORT, function () {
	console.log('server started!');
});