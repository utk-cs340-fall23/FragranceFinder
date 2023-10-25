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
		const pyproc = spawn("python", ["./scrapers/MasterScript.py"], {
			maxBuffer: 1000 * 1000 * 10 // 10 MB
		});

		let output = '';
		pyproc.stdout.on('data', (data) => {
			output += data.toString();
		});

		pyproc.stdout.on("end", (data) => {
			const ret = JSON.parse(output);

			for(let i = 0; i < ret.length; i++){
				Fragrance.findOne({
					where:{
						brand: ret[i].brand,
						title: ret[i].title,
						concentration: ret[i].concentration,
						gender: ret[i].gender
					}
				}).then(res => {
					if(res == null){
						//console.log("Data not found");

						//insert new data

						Fragrance.create({
							brand: ret[i].brand,
							title: ret[i].title,
							concentration: ret[i].concentration,
							gender: ret[i].gender,
							photo_link: ret[i].photoLink
						}).then(ins => {
							FragranceListing.create({
								fragrance_id: ins.id,
								price: ret[i].price,
								link: ret[i].link,
								sizeoz: ret[i].size
							});
						});
					}
					else{
						console.log("data found");
					}
				}).catch((error) => {
					console.log("Error: Cannot fetch data: ", error);
				});
			}
		});
	}

	scrapeWeb();
}

module.exports = dbUpdate;