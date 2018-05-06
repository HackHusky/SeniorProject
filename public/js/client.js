
var socket = io.connect('http://localhost:5000');


$(document).ready(function() {

	document.getElementById('StartI').onclick = function() 
	{
	  console.log("I");
	  socket.emit('I');
	};


	document.getElementById('StartV').onclick = function() 
	{
		console.log("V");
		socket.emit('V');
	};

});

socket.on('data', function(data) {
	console.log("Data coming in ");
    console.log(data);
});




