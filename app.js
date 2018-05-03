var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , url= require('url')
  , fs = require('fs')

app.listen(5000); // Use local port 5000


// Http handler function
function handler (req, res) {

    // Using URL to parse the requested URL
    var path = url.parse(req.url).pathname;

    // Managing the root route
    if (path == '/') {
        index = fs.readFile(__dirname+'/public/index.html', 
            function(error,data) {

                if (error) {
                    res.writeHead(500);
                    return res.end("Error: unable to load index.html");
                }

                res.writeHead(200,{'Content-Type': 'text/html'});
                res.end(data);
            });
    // Managing the route for the javascript files
    } else if( /\.(js)$/.test(path) ) {
        index = fs.readFile(__dirname+'/public'+path, 
            function(error,data) {

                if (error) {
                    res.writeHead(500);
                    return res.end("Error: unable to load " + path);
                }

                res.writeHead(200,{'Content-Type': 'text/plain'});
                res.end(data);
            });
    } else {
        res.writeHead(404);
        res.end("Error: 404 - File not found.");
    }
}

/* setInterval(function(){
    //console.log("sending compass info");
    compass();
    socket.emit('compass', bearing);   
  },500); */

io.sockets.on('connection', function (socket) {
    socket.on('I', function(data) {
        console.log("Start");
        AutoImage();

    });

    socket.on('V', function(data) {
        console.log("Start");
        AutoVideo();

    });
});

function AutoImage()
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

};


function AutoVideo()
{
    var exec = require('child_process').exec;
    var cmd3 = './video_test.sh';

    var parse; 
    fs = require('fs')
    setTimeout(function(){ 
        exec(cmd3, function(error, stdout, stderr) {
          // command output is in stdout
        });
    }, 1000);


    setTimeout(function(){  
        fs.readFile('data.txt', 'utf8', function (err,data) {
          if (err) {
            return console.log(err);
          }
          console.log(data);
          parse = data;
        });
    }, 2000);

    setTimeout(function(){  

        var format = JSON.parse(parse);
        console.log(format.Object);
        setInterval(function(){ 
            fs.readFile('data.txt', 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            }
            parse = data;
            });
            console.log(parse);
            

        }, 3000);
    }, 3000);


};


