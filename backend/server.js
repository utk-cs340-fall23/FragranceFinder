// Load environment variables
require('dotenv').config();

const path = require('path');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const db = require('./config/db');
const mailer = require('./config/mail');


// https://stackoverflow.com/questions/23450534/how-to-call-a-python-function-from-node-js
const spawn = require("child_process").spawn;

function test(){
	const pyproc = spawn("python", ["test.py"]);

	pyproc.stdout.on("data", (data) => {
		console.log(data.toString());
	});
}

setInterval(test, 3600000); // 1 hour


app.use(express.json());

app.use(require('./routes'));

app.use(express.static(path.resolve(__dirname, '../client/build')));

// All other GET requests not handled before will return to our React app for frontend routing
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
