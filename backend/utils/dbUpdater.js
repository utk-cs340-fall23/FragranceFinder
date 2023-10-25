const { Fragrance, FragranceListing } = require("../models");
const sequelize = require("../config/db");
const PORT = process.env.PORT || 3001;
const express = require('express');
const app = express();

require('dotenv').config();

function dbUpdate() {
	// https://stackoverflow.com/questions/23450534/how-to-call-a-python-function-from-node-js
	const spawn = require("child_process").spawn;

	function scrapeWeb(){
		const pyproc = spawn("python", ["./scrapers/MasterScript.py"]);

		pyproc.stdout.on("data", (data) => {
			
			ret = JSON.parse(data.toString());
			
			
			
			console.log(ret);

		});
	}

	scrapeWeb();
	setInterval(scrapeWeb, 3600000);
}

module.exports = dbUpdate;