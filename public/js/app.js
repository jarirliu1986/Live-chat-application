var socket = io();

socket.on('connect', function () {
	console.log("connected!!");
});

socket.on('message', function (message) {
	console.log('new message: ');
	console.log(message.text);

	$('.messages').append('<p>' + message.text + '</p>');
	
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
