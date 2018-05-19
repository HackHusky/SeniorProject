
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

var buffer;
var global_data;
var format; 
var base_position     = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
var shoulder_position = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
var elbow_position    = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
var wrist_position    = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
var claw_position     = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
var oReq = new XMLHttpRequest();
const URL = 'http://192.168.4.1';
var source_ap = new EventSource(URL);
var auto_flag = 1;

var execute_action;


var isClawOpen = false; //Check if we can just get feedback for this; then just use movement complete
var clawOpCount = 0; 
var clawOpenTime = 25; //Counted Hard Coded Loops
var clawCloseTime = 17; //Counted Hard Coded Loops
var opIntervalTime = 200; //Time in ms
var right_area = 30;
var left_area = -60;

class armData {
	constructor()
	{
		this.base  = -30;
		this.shoulder = 60;
		this.elbow = -80;
		this.wrist = 6;
		this.wrist_rot = 0;
		this.cam_id = 0;
		this.cam_shoulder = 0;
		this.gimbal = 0;
		this.claw_motion = 0;
		this.claw_torque = 0;
		this.timestamp = 0;
	}
}

var arm_cmd = new armData; //THE MAIN ONE SENT TO BE EXECUTED 
var arm_target = new armData; //THE DESIRED POSITION
var arm_data = new armData; //THE ACTUAL POSITION
var default_position = new armData; //THE RESET POSITION
var arm_manual = new armData; //UI POSITION
var arm_operations = null;

var min =
{
	base: -150,
	shoulder: 0,
	elbow: -150,
	wrist: -130,
	wrist_rot: 0
}

var max =
{
	base: 150,
	shoulder: 180,
	elbow: 150,
	wrist: 130,
	wrist_rot: 360
}

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

	// document.getElementById('StartArm').onclick = function() 
	// {
		// WaterBottle();

	// };

	//Arm Control Panel Functions
    $("#base").knob({
    	'change': function(value){
    		arm_manual.base = value;
    		console.log("arm_manual.base = " + value);
    	}, 
    	'width':100,
    	'height':100,
    	'min': min.base,
    	'max': max.base
    });
    $("#shoulder").knob({
    	'change': function(value){
    		arm_manual.shoulder = value;
    		console.log("arm_manual.shoulder = " + value);
    	}, 
    	'width':100,
    	'height':100,
	   	'min': min.shoulder,
    	'max': max.shoulder
    });
    $("#elbow").knob({
    	'change': function(value){
    		arm_manual.elbow = value;
    		console.log("arm_manual.elbow = " + value);
    	}, 
    	'width':100,
    	'height':100,
	   	'min': min.elbow,
    	'max': max.elbow
    });
    $("#wrist").knob({
    	'change': function(value){
    		arm_manual.wrist = value;
    		console.log("arm_manual.wrist = " + value);
    	}, 
    	'width':100,
    	'height':100,
	   	'min': min.wrist,
    	'max': max.wrist
    });
    $("#wrist-rotation").knob({
    	'change': function(value){
    		arm_manual.wrist_rot = value;
    		console.log("arm_manual.wrist_rot = " + value);
    	}, 
    	'width':100,
    	'height':100,
	   	'min': min.wrist_rot,
    	'max': max.wrist_rot
    });

    //Recieved
    $("#base-recieve").knob({
    	'readOnly':'true', 
    	'width':100,
    	'height':100,
    	'min': min.base,
    	'max': max.base,
    	'fgColor' : '#ED742F'
    });
    $("#shoulder-recieve").knob({
    	'readOnly':'true', 
    	'width':100,
    	'height':100,
	   	'min': min.shoulder,
    	'max': max.shoulder,
    	'fgColor' : '#ED742F'
    });
    $("#elbow-recieve").knob({
    	'readOnly':'true', 
    	'width':100,
    	'height':100,
	   	'min': min.elbow,
    	'max': max.elbow,
    	'fgColor' : '#ED742F'
    });
    $("#wrist-recieve").knob({
    	'readOnly':'true', 
    	'width':100,
    	'height':100,
	   	'min': min.wrist,
    	'max': max.wrist,
    	'fgColor' : '#ED742F'
    });
    $("#wrist-rotation-recieve").knob({
    	'readOnly':'true', 
    	'width':100,
    	'height':100,
	   	'min': min.wrist_rot,
    	'max': max.wrist_rot,
    	'fgColor' : '#ED742F'
    });
    renderData();
});

function updateClawTorque(val)
{
	document.getElementById('claw-torque').value=val;
	arm_manual.claw_torque = val;
}

var objectData;
// {
// 	"Object_Water":"WaterBottle",
// 	"Object_Confidence_Water":"86",
// 	"Distance_Water":"42.7",
// 	"Angle_Water":"64.6",
// 	"Height_Water:":"13.5",
// 	"Object_Tennis":"TennisBall",
// 	"Object_Confidence_Tennis":"60",
// 	"Distance_Tennis":"42.6",
// 	"Angle_Tennis":"87.2",
// 	"Height_Tennis:":"9.9"
// };

socket.on('data', function(data) {
    // global_data = data;
    objectData = JSON.parse(data);
    // console.log(objectData);
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
	}, 4200);

	setTimeout(function(){

		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 4400);

	setTimeout(function(){

		arm_data.read_claw_motion =  2;
		sendData(arm_data);
	}, 4600);
}

function opPickUp()
{
	if(arm_operations == null)
	{
		arm_operations = 'open_claw';
		if(objTarget == "WATERBOTTLE" || objTarget == "WATER BOTTLE")
		{
			if(objectData.Object_Confidence_Water)
			{
				arm_target.base = objectData.Angle_Water;
				arm_target.shoulder = getShoulder(objectData.Distance_Water, objectData.Height_Water, (arm_target.elbow * (Math.PI / 180)));
				arm_target.elbow = getElbow(objectData.Distance_Water, objectData.Height_Water);
				// arm_target.wrist = getWrist();
				console.log("Object Target of Op: " + objTarget);
			}
			else
			{
				console.log("ABORT OP: OBJECT NOT FOUND");
				createFeedbackMsg("ABORT OP: OBJECT NOT FOUND");
				arm_operations == 'exit';
			}
		}
		if(objTarget == "TENNISBALL" || objTarget == "TENNIS BALL" || objTarget == "BALL")
		{
			if(objectData.Object_Confidence_Tennis)
			{
				arm_target.base = objectData.Angle_Water;
				arm_target.shoulder = getShoulder(objectData.Distance_Tennis, objectData.Height_Tennis, (arm_target.elbow * (Math.PI / 180)));
				arm_target.elbow = getElbow(objectData.Distance_Tennis, objectData.Height_Tennis);
				// arm_target.wrist = getWrist();			
				console.log("Object Target of Op: " + objTarget);
			}
			else
			{
				console.log("ABORT OP: OBJECT NOT FOUND");
				createFeedbackMsg("ABORT OP: OBJECT NOT FOUND");
				arm_operations == 'exit';
			}
		}
	}

	switch(arm_operations)
	{
		case 'open_claw':
			if(!isClawOpen)
			{
				arm_cmd.claw_motion = 1;
				clawOpCount++;
				
				if(clawOpCount > clawOpenTime)
				{
					arm_operations = 'move_into_position';
					createFeedbackMsg('Operation Pick Up Stage: Move to Object...');
					clawOpCount = 0;
					isClawOpen = true;
					arm_cmd.claw_motion = 0;
				}
			}
			else
			{
				arm_operations = 'move_into_position';
				createFeedbackMsg('Operation Pick Up Stage: Move to Object...');
			}
			break;

		case 'move_into_position':
			arm_cmd.base = arm_target.base;
			arm_cmd.shoulder = arm_target.shoulder;
			arm_cmd.elbow = arm_target.elbow;
			arm_cmd.wrist = arm_target.wrist;
			arm_cmd.wrist_rot = arm_target.wrist_rot;

			if(movementComplete(arm_target))
			{
				arm_operations = 'close_claw';
				createFeedbackMsg('Operation Pick Up Stage: Closing Claw...');
			}
			break;

		case 'close_claw':
			if(isClawOpen)
			{
				arm_cmd.claw_motion = 2;
				clawOpCount++;
				if(clawOpCount <= clawCloseTime)
				{
					arm_operations = 'move_into_default';
					createFeedbackMsg('Operation Pick Up Stage: Moving into default position...');
					clawOpCount = 0;
					isClawOpen = false;
					arm_cmd.claw_motion = 0;
				}
			}
			else
			{
				arm_operations = 'move_into_default';
				createFeedbackMsg('Operation Pick Up Stage: Moving into default position...');
			}
			break;

		case 'move_into_default':
			arm_cmd.base = default_position.base;
			arm_cmd.shoulder = default_position.shoulder;
			arm_cmd.elbow = default_position.elbow;
			arm_cmd.wrist = default_position.wrist;
			arm_cmd.wrist_rot = default_position.wrist_rot;

			if(movementComplete(default_position))
			{
				arm_operations = 'exit';
				createFeedbackMsg('Operation Pick Up Complete!');
			}
			break;

		case 'exit':
		default:
			clearInterval(execute_action);
			createFeedbackMsg('Action Execution Complete & Cleared.');
			arm_operations = null;
			break;
	}
	sendData(arm_cmd);
}

function executeCommand()
{
	if(targetSuccess && actionSuccess)
	{
		switch(cmdAction)
		{
			case 'DROP':
			case 'DROP LEFT':
			case 'DROP RIGHT':
				execute_action = setInterval(opDrop, opIntervalTime);
				createFeedbackMsg('Action Execution Started: Operation Pick Up.');
				break;
			case 'GRAB':
			case 'PICKUP':
			case 'PICK UP':
				execute_action = setInterval(opPickUp, opIntervalTime);
				createFeedbackMsg('Action Execution Started: Operation Pick Up.');
				break;
			default:
				createFeedbackMsg('Error: Could not execute: ' + cmdAction);
				break;
		}
	}
	actionSuccess = false;
	targetSuccess = false;
}

function movementComplete(desired_position)
{
	if(
		((arm_data.base 		<= (desired_position.base + 5)) 		|| (arm_data.base 		>= (desired_position.base - 5)) ) 		&&
		((arm_data.shoulder 	<= (desired_position.shoulder + 5)) 	|| (arm_data.shoulder 	>= (desired_position.shoulder - 5)) ) 	&&
		((arm_data.elbow 		<= (desired_position.elbow + 5)) 		|| (arm_data.elbow 		>= (desired_position.elbow - 5)) ) 	&&
		((arm_data.wrist 		<= (desired_position.wrist + 5)) 		|| (arm_data.wrist 		>= (desired_position.wrist - 5)) ) 	&&
		((arm_data.wrist_rot 	<= (desired_position.wrist_rot + 5)) 	|| (arm_data.wrist_rot 	>= (desired_position.wrist_rot - 5)) )
	)
	{
		return true;
	}
	else
	{
		return false;
	}
}

function moveClaw(op)
{
	arm_cmd.claw_motion = op;
	sendData(arm_cmd);
	console.log("Claw Motion: " + op);
}

setInterval(recieveArmDataSSE(),100);

function recieveArmDataSSE()
{
	source_ap.onmessage = function(event)
	{
		buffer = event.data.toString();
		console.log("EVENT DATA: " + event.data);
		parseArmData(buffer);
		source_ap.onerror = function(event)
		{
			source_ap.close();
			source_ap = null;
		};
	}
}

function parseArmData(data)
{
	if(!data)
	{
		return;
	}

	//Strip Braces
	data = data.substr(1, data.length - 2);

	const obj = {};
	const properties = str.split(',');
	for(const property of properties)
	{
		let [key, value] = property.split(':');
		obj[key] = parseInt(value);
	}

	arm_data.base = obj.base;
	arm_data.shoulder = obj.shoulder;
	arm_data.elbow = obj.elbow;
	arm_data.wrist = obj.wrist;
	arm_data.wrist_rot = obj.wrist_rot;
	renderData();

}

function renderData() 
{
	$("#base-recieve").val(arm_data.base).trigger('change');
    $("#shoulder-recieve").val(arm_data.shoulder).trigger('change');
    $("#elbow-recieve").val(arm_data.elbow).trigger('change');
    $("#wrist-recieve").val(arm_data.wrist).trigger('change');
    $("#wrist-rotation-recieve").val(arm_data.wrist_rot).trigger('change');
    document.getElementById('claw-torque-recieved').value=arm_data.claw_torque;
}

function getElbow(distance, height)
{
    arm_target.elbow = -((Math.acos((Math.pow(distance,2) + Math.pow(height,2) - Math.pow(35.56,2) - Math.pow(41.148,2)) / (2 * 35.56 * 41.148)))/ (Math.PI / 180));
    return arm_target.elbow;
}

function getShoulder(distance, height, e_angle)
{
    arm_target.shoulder = Math.atan(height/distance) + Math.atan((41.148 * Math.sin(e_angle)) / (35.56 + 41.148 * Math.cos(e_angle)));
    return arm_target.shoulder;
}

function opDrop()
{
	if(arm_operations == null)
	{
		arm_operations = 'move_into_position';
		if(cmdAction == "DROP")
		{
			arm_target.base = default_position.base;
			arm_target.shoulder = default_position.shoulder;
			arm_target.elbow = default_position.elbow;
			arm_target.wrist = default_position.wrist;
			arm_target.wrist_rot = default_position.wrist_rot;
		}
		else if(cmdAction == "DROP LEFT")
		{
			arm_target.base = left_area;
			arm_target.shoulder = default_position.shoulder;
			arm_target.elbow = default_position.elbow;
			arm_target.wrist = default_position.wrist;
			arm_target.wrist_rot = default_position.wrist_rot;
		}
		else if(cmdAction == "DROP RIGHT")
		{
			arm_target.base = right_area;
			arm_target.shoulder = default_position.shoulder;
			arm_target.elbow = default_position.elbow;
			arm_target.wrist = default_position.wrist;
			arm_target.wrist_rot = default_position.wrist_rot;
		}
		else 
		{
			arm_operations = 'exit';
			console.log("ERROR: INCORRECT COMMAND");
		}
		
	}

	switch(arm_operations)
	{
		case 'open_claw':
			if(!isClawOpen)
			{
				arm_cmd.claw_motion = 1;
				clawOpCount++;
				
				if(clawOpCount > clawOpenTime)
				{
					arm_operations = 'close_claw';
					clawOpCount = 0;
					isClawOpen = true;
					arm_cmd.claw_motion = 0;
				}
			}
			else
			{
				arm_operations = 'close_claw';
			}
			break;

		case 'move_into_position':
			arm_cmd.base = arm_target.base;
			arm_cmd.shoulder = arm_target.shoulder;
			arm_cmd.elbow = arm_target.elbow;
			arm_cmd.wrist = arm_target.wrist;
			arm_cmd.wrist_rot = arm_target.wrist_rot;

			if(movementComplete(arm_target))
			{
				arm_operations = 'open_claw';
			}
			break;

		case 'close_claw':
			if(isClawOpen)
			{
				arm_cmd.claw_motion = 2;
				clawOpCount++;
				if(clawOpCount <= clawCloseTime)
				{
					arm_operations = 'move_into_default';
					clawOpCount = 0;
					isClawOpen = false;
					arm_cmd.claw_motion = 0;
				}
			}
			else
			{
				arm_operations = 'move_into_default';
			}
			break;

		case 'move_into_default':
			arm_cmd.base = default_position.base;
			arm_cmd.shoulder = default_position.shoulder;
			arm_cmd.elbow = default_position.elbow;
			arm_cmd.wrist = default_position.wrist;
			arm_cmd.wrist_rot = default_position.wrist_rot;

			if(movementComplete(default_position))
			{
				arm_operations = 'exit';
				createFeedbackMsg('Operation Drop Complete!');
			}
			break;

		case 'exit':
		default:
			clearInterval(execute_action);
			createFeedbackMsg('Action Execution Complete & Cleared.');
			arm_operations = null;
			break;
	}
	sendData(arm_cmd);
}