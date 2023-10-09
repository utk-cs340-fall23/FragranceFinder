// Load environment variables
require('dotenv').config();

const path = require('path');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const sequelize = require("./config/db");
const { Fragrance } = require("./models");

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
	
	
	// https://stackoverflow.com/questions/23450534/how-to-call-a-python-function-from-node-js
	const spawn = require("child_process").spawn;
	
	function scrapeWeb(){
		const pyproc = spawn("python", ["scrapers/scraperfaker.py"]);

		pyproc.stdout.on("data", (data) => {
			ret = JSON.parse(data.toString());
			
			console.log(ret);
			
			//Check db records here
			
			//Fragrance.findAll().then(res => {
			//	console.log(res[0].make);
			//}).catch((error) => {
			//	console.error("Cannot get data: ", error);
			//});
			
		});
	}
	
	setInterval(scrapeWeb, 5000);
	
});