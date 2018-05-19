
var socket = io.connect('http://localhost:5000');

var arm_data = {
	read_cam_id : 0,
    read_cam_shoulder :0,
    read_cam_elbow : 0,
    read_gimbal : 0,
    read_base : 0,
    read_shoulder : 80,
    read_elbow : 101,
    read_wrist : 0,
    read_wrist_rot : 100,
    read_claw_motion : 0, //1 to close , 2 to open 
    read_claw_torque : 100,
    timestamp : 0
};
var global_data ; 
var format; 
var base_position     = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
var shoulder_position = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
var elbow_position    = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
var wrist_position    = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
var claw_position     = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
var oReq = new XMLHttpRequest();
const URL = 'http://192.168.4.1';
var auto_flag = 1;

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
		auto_flag = 1 ;
	};

	document.getElementById('StartArm').onclick = function() 
	{
		WaterBottle();

	};


});

socket.on('data', function(data) {
	//console.log("Data coming in ");
    //console.log(data);
    global_data = data;
});


function sendData(value)
{
	value = JSON.stringify(value);
	value = value.replace(/"/g,"");
	console.log(value);
	oReq.open('POST', `${URL}?data=${value}`);
	oReq.send();
}

setInterval(function(){
	//console.log(global_data.Object);
    format = JSON.parse(global_data);
    //console.log(format);
    //console.log("global voice " + global_voice);
    if(format.Object == "WaterBottle")
    {
    	//console.log("object found");
    	AutoArm();
    }
}, 1000);

function AutoArm()
{
	if(format.Object == "WaterBottle" && auto_flag == 1 && global_voice.search("water bottle") != -1 )
	{
		auto_flag = 0;
		console.log("RUN ONLY ONCE");
		//sendData(arm_data);
		WaterBottle_30();		
	}
}

function WaterBottle_30()
{
	setTimeout(function(){
		console.log("Initial");
		arm_data.read_shoulder = 61;
		arm_data.read_elbow = 150;
		arm_data.read_claw_motion = 0; 
		sendData(arm_data);
	}, 1);

		setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 200);

	setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 400);

	setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 600);

	setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 800);

	setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 1000);

	setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 1200);

	setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 1400);

	setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 1600);

	setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 1800);

	setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 2000);


	setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 2200);

	setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 2400);

	setTimeout(function(){

		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 2400);

	setTimeout(function(){

		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 2600);

	setTimeout(function(){

		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 2800);

	setTimeout(function(){

		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 3000);
	setTimeout(function(){

		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 3200);
	setTimeout(function(){

		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 3400);
	setTimeout(function(){

		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 3600);
	setTimeout(function(){

		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 3800);
	setTimeout(function(){

		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 4000);

	setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_claw_motion =  0;
		sendData(arm_data);
	}, 5000);


	setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_shoulder = 108;
		arm_data.read_elbow = 150;
		arm_data.read_claw_motion = 0; 
		sendData(arm_data);
	}, 6000);
			

	setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_shoulder = 108;
		arm_data.read_elbow = 150;
		arm_data.read_claw_motion = 0; 
		sendData(arm_data);
	}, 7500);

	setTimeout(function(){
		arm_data.read_claw_motion =  1;
		sendData(arm_data);
	}, 8000);

	setTimeout(function(){
		arm_data.read_claw_motion =  1;
		sendData(arm_data);
	}, 8200);

		setTimeout(function(){
		arm_data.read_claw_motion =  1;
		sendData(arm_data);
	}, 8400);

			setTimeout(function(){
		arm_data.read_claw_motion =  1;
		sendData(arm_data);
	}, 8600);

				setTimeout(function(){
		arm_data.read_claw_motion =  1;
		sendData(arm_data);
	}, 9000);

	setTimeout(function(){
		arm_data.read_claw_motion =  1;
		sendData(arm_data);
	}, 9200);

	setTimeout(function(){
		arm_data.read_claw_motion =  1;
		sendData(arm_data);
	}, 9400);

		setTimeout(function(){
		arm_data.read_claw_motion =  1;
		sendData(arm_data);
	}, 9200);

	setTimeout(function(){
		arm_data.read_claw_motion =  1;
		sendData(arm_data);
	}, 9400);
		setTimeout(function(){
		arm_data.read_claw_motion =  1;
		sendData(arm_data);
	}, 9200);

	setTimeout(function(){
		arm_data.read_claw_motion =  1;
		sendData(arm_data);
	}, 9600);
	
	setTimeout(function(){
		arm_data.read_claw_motion =  1;
		sendData(arm_data);
	}, 9800);

	setTimeout(function(){
		arm_data.read_claw_motion =  1;
		sendData(arm_data);
	}, 10000);
		setTimeout(function(){
		arm_data.read_claw_motion =  1;
		sendData(arm_data);
	}, 12000);

	setTimeout(function(){
		arm_data.read_claw_motion =  1;
		sendData(arm_data);
	}, 14000);
	
	setTimeout(function(){
		arm_data.read_claw_motion =  1;
		sendData(arm_data);
	}, 16000);

	setTimeout(function(){
		arm_data.read_claw_motion =  1;
		sendData(arm_data);
	}, 18000);


	setTimeout(function(){
		arm_data.read_claw_motion = 0;
		arm_data.read_shoulder=61;	
		sendData(arm_data);
	}, 20000);
}


function WaterBottle()
{
	var shoulder_value_1 = 80;
	var shoulder_value_2 = 50;
	var elbow_value_1 = 45;
	var elbow_value_2 = 45;
	console.log("Arm Start");
	setTimeout(function(){
		console.log("Initial");
		arm_data.read_shoulder = shoulder_value_1;
		arm_data.read_elbow = elbow_value_1;
		arm_data.read_claw_motion = 0; 
		sendData(arm_data);
	}, 1);

		setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 200);

	setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 400);

	setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 600);

	setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 800);

	setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 1000);

	setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 1200);

	setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 1400);

	setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 1600);

	setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 1800);

	setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 2000);


	setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 2200);

	setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 2400);

	setTimeout(function(){

		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 2400);

	setTimeout(function(){

		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 2600);

	setTimeout(function(){

		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 2800);

	setTimeout(function(){

		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 3000);
	setTimeout(function(){

		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 3200);
	setTimeout(function(){

		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 3400);
	setTimeout(function(){

		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 3600);
	setTimeout(function(){

		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 3800);
	setTimeout(function(){

		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 4000);

	setTimeout(function(){

		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 4200)

	setTimeout(function(){

		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 4400)

	setTimeout(function(){

		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 4600)

	setTimeout(function(){

		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 4800)


	setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 5200);

	setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 5400);

setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 5600);

setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 5800);

setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 6000);

setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 6200);

setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 6400);

setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 6600);

setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 6800);



	setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_shoulder = shoulder_value_2;
		arm_data.read_elbow = elbow_value_1;
		arm_data.read_claw_motion = 0; 
		sendData(arm_data);
	}, 7000);
			

	setTimeout(function(){
		console.log("Shoulder");
		arm_data.read_shoulder = shoulder_value_2;
		arm_data.read_elbow = elbow_value_1;
		arm_data.read_claw_motion = 0; 
		sendData(arm_data);
	}, 7500);

	setTimeout(function(){
		arm_data.read_claw_motion =  1;
		sendData(arm_data);
	}, 8000);

	setTimeout(function(){
		arm_data.read_claw_motion =  1;
		sendData(arm_data);
	}, 8200);

		setTimeout(function(){
		arm_data.read_claw_motion =  1;
		sendData(arm_data);
	}, 8400);

			setTimeout(function(){
		arm_data.read_claw_motion =  1;
		sendData(arm_data);
	}, 8600);

				setTimeout(function(){
		arm_data.read_claw_motion =  1;
		sendData(arm_data);
	}, 9000);

	setTimeout(function(){
		arm_data.read_claw_motion =  1;
		sendData(arm_data);
	}, 9200);

	setTimeout(function(){
		arm_data.read_claw_motion =  1;
		sendData(arm_data);
	}, 9400);

		setTimeout(function(){
		arm_data.read_claw_motion =  1;
		sendData(arm_data);
	}, 9200);

	setTimeout(function(){
		arm_data.read_claw_motion =  1;
		sendData(arm_data);
	}, 9400);
		setTimeout(function(){
		arm_data.read_claw_motion =  1;
		sendData(arm_data);
	}, 9200);

	setTimeout(function(){
		arm_data.read_claw_motion =  1;
		sendData(arm_data);
	}, 9600);
	
	setTimeout(function(){
		arm_data.read_claw_motion =  1;
		sendData(arm_data);
	}, 9800);

	setTimeout(function(){
		arm_data.read_claw_motion =  1;
		sendData(arm_data);
	}, 10000);
		setTimeout(function(){
		arm_data.read_claw_motion =  1;
		sendData(arm_data);
	}, 12000);

	setTimeout(function(){
		arm_data.read_claw_motion =  1;
		sendData(arm_data);
	}, 14000);
	
	setTimeout(function(){
		arm_data.read_claw_motion =  1;
		sendData(arm_data);
	}, 16000);

	setTimeout(function(){
		arm_data.read_claw_motion =  1;
		sendData(arm_data);
	}, 18000);


	setTimeout(function(){
		arm_data.read_claw_motion = 0;
		arm_data.read_shoulder=shoulder_value_2;	
		sendData(arm_data);
	}, 20000);
}
