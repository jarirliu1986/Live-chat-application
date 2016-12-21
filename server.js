var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var moment = require('moment');


app.use(express.static(__dirname + '/public'));

//listen for events
io.on('connection', function (socket) {
	console.log('User connected via socket.io!');

	socket.on('message', function (message) {
		var now = moment();
		var timeStemp = now.format(' h:mm:ss a, YYYY/MM/DD');

		console.log('message recieved!' + message.text);
		//socket.broadcast.emit('message', message);
		message.text = message.text + ' ' + timeStemp;
		io.emit('message', message);
	});

	socket.emit('message', {
		text: 'welcome to the chat application'
	})
});

http.listen(PORT, function () {
	console.log('server started!');
});