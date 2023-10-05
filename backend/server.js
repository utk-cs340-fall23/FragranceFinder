// Load environment variables
require('dotenv').config();

const path = require('path');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const sequelize = require("./config/db");

// https://stackoverflow.com/questions/23450534/how-to-call-a-python-function-from-node-js
const spawn = require("child_process").spawn;

function test(){
	try {
		const pyproc = spawn("python", ["test.py"]);

		pyproc.stdout.on("data", (data) => {
			console.log(data.toString());
		});
	}
	catch (err) {
		return;
	}
}

test();

setInterval(test, 3600000); // 1 hour

app.use(express.json());

// Direct all routes starting with api to the API's routes
app.use('/api', require('./routes'));

// All other GET requests not handled before will return to our React app for frontend routing
app.use(express.static(path.resolve(__dirname, '../frontend/build')));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});

sequelize.sync({ force: false }).then(() => {
	app.listen(PORT, () => console.log('Now listening'));
});
