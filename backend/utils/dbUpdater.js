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
				if(ret[i].brand != "N/A" && ret[i].title != "N/A" && ret[i].concentration != "N/A" && ret[i].gender != "N/A"){
					Fragrance.findOne({
						where:{
							brand: ret[i].brand,
							title: ret[i].title,
							concentration: ret[i].concentration,
							gender: ret[i].gender
						}
					}).then(res => {
						if(res == null){
							// Creates new record of item
							Fragrance.create({
								brand: ret[i].brand,
								title: ret[i].title,
								concentration: ret[i].concentration,
								photoLink: ret[i].photoLink,
								gender: ret[i].gender
							}).then(ins => {
								FragranceListing.create({
									fragranceId: ins.id,
									price: ret[i].price,
									link: ret[i].link,
									sizeoz: ret[i].size
								});
							});
						}
						else{
							// Append existing element
							FragranceListing.findOne({
								where:{
									fragranceId: res.id,
									link: ret[i].link,
									sizeoz: ret[i].size
								}
							}).then(lst => {
								if(lst == null){
									// Create new list
									FragranceListing.create({
										fragranceId: res.id,
										price: ret[i].price,
										link: ret[i].link,
										sizeoz: ret[i].size
									}).then(ins => {
										FragranceListing.findAll({
											where:{
												fragranceId: res.id,
												sizeoz: ret[i].size
											}
										}).then(lst1 => {
											if(lst1 != null){
												// find a way to deal with converting price to float
												console.log("Record(s) exist and smallest price needs to be found to email out");
											}
											
											FragranceListing.create({
												fragranceId: ins.id,
												price: ret[i].price,
												link: ret[i].link,
												sizeoz: ret[i].size
											});
										});
									});
								}
								else{
									
									// check price change
									
									FragranceListing.update({
										price: ret[i].price,
									},{
										where:{
											id: lst.id
										}
									});
								}
							});
						}
					}).catch((error) => {
						console.log("Error: Cannot fetch data: ", error);
					});
				}
			}
		});
	}

	scrapeWeb();
}

module.exports = dbUpdate;