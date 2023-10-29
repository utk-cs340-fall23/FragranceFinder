const { Fragrance, FragranceListing, UserFragrance } = require("../models");
const {cleanData} = require('../utils/parsing');
const sequelize = require('../config/db');
const {Sequelize} = require('sequelize');

function dbUpdate(maxItemsPerScraper) {
	// https://stackoverflow.com/questions/23450534/how-to-call-a-python-function-from-node-js
	const spawn = require("child_process").spawn;
	maxItemsPerScraper = maxItemsPerScraper || '';

	function scrapeWeb(){
		const pyproc = spawn("python", ["./scrapers/MasterScript.py", maxItemsPerScraper], {
			maxBuffer: 1000 * 1000 * 10 // 10 MB
		});

		let output = '';
		pyproc.stdout.on('data', (data) => {
			output += data.toString();
		});

		pyproc.stdout.on("end", (data) => {
			const ret = cleanData(JSON.parse(output));

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
									sizeoz: ret[i].sizeoz
								});
							});
						}
						else{
							// Append existing element
							FragranceListing.findOne({
								where:{
									fragranceId: res.id,
									link: ret[i].link,
									sizeoz: ret[i].sizeoz
								}
							}).then(lst => {
								if(lst == null){
									// Create new list
									FragranceListing.create({
										fragranceId: res.id,
										price: ret[i].price,
										link: ret[i].link,
										sizeoz: ret[i].sizeoz
									}).then(ins => {
										// find smallest and check if is new smallest
									});
								}
								else{

									// check if new smallest or if another price is smallest

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

	function emailUpdate(type, fid, price){ // 0: lowest price increase; 1: lowest price decrease; 2: new lowest price
		UserFragrance.findAll({
			where:{
				fragranceId: fid
			}
		}).then(rt => {
			//
		});
	}

	async function findSmallest(fid, size){
		let lowest = await sequelize.query("SELECT * FROM fragrance_listing WHERE fragrance_id="+fid+" AND sizeoz LIKE "+size+" ORDER BY price ASC LIMIT 1", {type: Sequelize.QueryTypes.SELECT});
		return lowest[0];
	}

	findSmallest(141, 4.2).then(query => {
		console.log(query);
	});
	//scrapeWeb();
}

module.exports = dbUpdate;