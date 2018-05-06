const arm_data = 
{
	base: null,
	shoulder: null,
	elbow: null,
	wrist: null,
	wrist_rot: null,
	claw: null,
	clawTorque: null
};

function sendArmMove()
{
	send XHR('/arm/move',
	{
		base: arm_data.base,
		shoulder: arm_data.shoulder,
		elbow: arm_data.elbow,
		wrist: arm_data.wrist,
		wrist_rot: arm_data.wrist_rot
	});
}

function xhrError()
{
	createFeedbackMsg('Failed to send to data to CS.');
}

function sendXHR(path, data)
{
	const xhr = new XMLHttpRequest();
	xhr.addEventListner('error', xhrError);
	xhr.open('POST', host + path);
	const body = data ? formatObject(data) : undefined;
	xhr.send(body);
}

function formatObject(data)
{
	let str = '{';
	let first = true;
	for(const key in data)
	{
		const value = obj[key];
		if(value === undefined || value === null)
		{
			continue;
		}
		if(first)
		{
			first = false;
		}
		str += '${key}:${JSON.stringify(value)'};
	}
	str += '}';
	return str;
}

function parseObject(str)
{
	if(!str)
	{
		return;
	}

	str = str.substr(1, str.length -2); //Remove Braces

	const obj = {};
	const properties = str.split(',');
	for (const property of properties) 
	{
		let [key, value] = property.split(':');
		obj[key] = parseInt(value);
	}

	return obj;
}