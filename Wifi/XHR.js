
//arm data object, increment timestamp everytime a new data object being send 
var arm_data = {
	Base:0,
    Shoulder:0,
    Elbow:0,
    Wrist_Pitch:0,
    Wrist_Rotation:0,
    Claw_Open:0,
    Claw_Close:0,
	timestamp:0
};
const URL = 192.168.4.1

//example function to control Base; 
function control_base
{
	arm_data.Base=180;
	arm_data.timestamp++;
	sendXHR(arm_data);
}

//this function to send data
function sendXHR(data) {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('error', xhrError);
    const body = data ? formatObject(data) : undefined;
    xhr.open('POST', URL+"/?data="+body);
    xhr.send();
}

//format data to be sent
function formatObject(obj) {
    let str = '{';
    let first = true;
    for (const key in obj) {
        const value = obj[key];
        if (value === undefined || value === null) {
            continue;
        }
        if (first) {
            first = false;
        } else {
            str += ',';
        }
        str += `${key}:${JSON.stringify(value)}`;
    }
    str += '}';
    return str;
}

//for parsing incoming data 
function parseObject(str) {
    if (!str) {
        return;
    }

    // Strip braces.
    str = str.substr(1, str.length - 2);

    // Parse a list of properties separated by commas where key and value
    // have a colon between them.

    const obj = {};

    const properties = str.split(',');
    for (const property of properties) {
        let [key, value] = property.split(':');
        obj[key] = parseInt(value);
    }

    return obj;
}

