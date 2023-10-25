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
			
			for(i = 0; i < ret.length; i++){
				Fragrance.findOne({
					where:{
						brand: ret[i].brand,
						title: ret[i].title,
						concentration: ret[i].concentration,
						gender: ret[i].gender
					}
				}).then(res => {
					if(res == null){
						console.log("Data not found");
					}
					else{
						//
					}
				}).catch((error) => {
					console.log("Error: Cannot fetch data: ", error);
				});
			}
		});
	}

	scrapeWeb();
	setInterval(scrapeWeb, 3600000);
}

module.exports = dbUpdate;