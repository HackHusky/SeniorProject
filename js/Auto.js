var source_sta, source_ap;
const URL = 'http://192.168.4.1';
// const URL = 'http://192.168.0.104';
var response = document.querySelector('#response');
var busy_counter = 0;

function recieveData(obj)
    {
    	if(source_ap)
    	{
    		obj.style.background = "red";
    		response.innerHTML = 'Resetting Event Source';
    		source_ap.close();
    		source_ap = null;
    	}
    	else
    	{
    		obj.style.background = "limegreen";
	    	response.innerHTML = 'Connecting...';
			source_ap = new EventSource(URL);
			source_ap.onopen = function()
			{
				response.innerHTML = 'Connected';
			};
			source_ap.onmessage = function(event)
			{
			    //console.log(event);
                console.log(event.data);
			};
			source_ap.onerror = function(event)
			{
				response.innerHTML = `failed to connect to ${URL}`;
				source_ap.close();
				source_ap = null;
			};
    	}
}
function sendData()
{
    	var oReq = new XMLHttpRequest();
    	var value = document.querySelector('#client-data').value.replace(/ /g, '_');
		var test = "testing";
		console.log(value);
		oReq.open('POST', `${URL}?data=${value}`);
		oReq.send();
}

var counter = 0;
var interval;
var text_area = document.querySelector('#server-data');
text_area.innerHTML = `id = ${event.lastEventId} :: data = ${event.data}\n` + text_area.innerHTML;


function AutoStart()
{

    var exec = require('child_process').exec;
    var cmd1 = 'mplayer tv:// -tv driver=v4l2:device=/dev/video0:width=820:height=820:outfmt=rgb24 -frames 2 -vo jpeg';
    var cmd2 = 'mv 00000002.jpg test.jpg';
    var cmd3 = './image_test.sh';
    var delete1 = 'rm 00000001.jpg';
    var delete2 = 'rm 00000002.jpg';
    var parse; 

    fs = require('fs')

    exec(cmd1, function(error, stdout, stderr) {
      // command output is in stdout
    });

    setTimeout(function(){ 
        exec(cmd2, function(error, stdout, stderr) {
          // command output is in stdout
        });
    }, 5000);

    setTimeout(function(){ 
        exec(cmd3, function(error, stdout, stderr) {
          // command output is in stdout
        });
    }, 10000);


    setTimeout(function(){  
        fs.readFile('data.txt', 'utf8', function (err,data) {
          if (err) {
            return console.log(err);
          }
          console.log(data);
          parse = data;
        });
    }, 15000);

    setTimeout(function(){  

        var format = JSON.parse(parse);
        console.log(format.Object);
    }, 20000);

}