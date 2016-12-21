var socket = io();

socket.on('connect', function () {
	console.log("connected!!");
});

socket.on('message', function (message) {
	var momentTimestamp = moment.utc(message.timestamp);
	console.log('new message: ');
	console.log(message.text);

	$('.messages').append('<p><strong>'+momentTimestamp.local().format('h:mm a') +': </strong>' + message.text + '</p>');
	
});

//handle the message submitted

var $form = $('#message-form');
console.log($form);

$form.on('submit', function (event) {
	event.preventDefault();

	var $message = $form.find('input[name=message]');

	socket.emit('message', {
		text: $message.val()
	});

	$message.val('');
});

function send() {
	socket.emit('message', {
		text: document.getElementById('sendmessage').value
	});
	document.getElementById('sendmessage').value = '';
}
