var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');
var socket = io();

console.log(name + ' wanna to join ' + room);

$('.room-title').text('Room name: ' + room);

socket.on('connect', function () {
	console.log("connected!!");
	socket.emit('joinRoom', {
		name: name,
		room: room
	});
});

socket.on('message', function (message) {
	var momentTimestamp = moment.utc(message.timestamp);
	var $messages = $('.messages');
	var $message = $('<li class="list-group-item"></li>');

	console.log('new message: ');
	console.log(message.text);

	$message.append('<p><strong>' + message.name + ' ' + momentTimestamp.local().format('h:mm a') +'</strong></p>');
	//$message.append('<p><strong>'+momentTimestamp.local().format('h:mm a') +': </strong>' + message.text + '</p>');
	$message.append('<p>' + message.text + '</p>');
	$messages.append($message);
});

//handle the message submitted

var $form = $('#message-form');
console.log($form);

$form.on('submit', function (event) {
	event.preventDefault();

	var $message = $form.find('input[name=message]');

	socket.emit('message', {
		name: name,
		text: $message.val()
	});

	$message.val('');
});

function showUsers() {
	socket.emit('message', {
			name: name,
			text: '@currentUsers'
		});
}

function send() {
	socket.emit('message', {
		name: name,
		text: document.getElementById('sendmessage').value
	});
	document.getElementById('sendmessage').value = '';
}

