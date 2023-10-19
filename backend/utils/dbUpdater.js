const { Fragrance, FragranceListing } = require("../models");
const sequelize = require("../config/db");
require('dotenv').config();

//app.listen(PORT, () => console.log('Now listening'));

sequelize.sync({ force: false, alter: true }).then(() => {
	
	// https://stackoverflow.com/questions/23450534/how-to-call-a-python-function-from-node-js
	const spawn = require("child_process").spawn;

	function scrapeWeb(){
		const pyproc = spawn("python", ["scrapers/scraperfaker.py"]);

		pyproc.stdout.on("data", (data) => {
			ret = JSON.parse(data.toString());
			// IMPORTANT: The record in scrapers/scraperfaker.py must already exist in the database for the demo to work.

			Fragrance.findOne({
				where:{
					make: ret.Make,
					model: ret.Model,
					series: ret.Series
				}
			}).then(res => {

				if(res == null){
					console.log("No data entry found");
					//insert data where not found
				}
				else{
					FragranceListing.findOne({
						where:{
							id: res.id,
							site: ret.Site
						}
					}).then(res1 => {
						changes = 0;
						subject = "";
						body = "";

						if(res1.price != ret.Price) changes |= 1;
						if(res1.discount == 0 && ret.Discount > 0) changes |= 2;
						if(res1.quantity == 0 && (ret.Quantity > 0 || ret.Quantity == -1)) changes |= 4;

						if(changes == 7){
							//all conditions present
							console.log("\nAll change\n");
							subject = "Stock, discount, and price notification for an item on your watch list";
							body = "Hello, the item '"+res.series+" "+res.model+"' from the website '"+res1.site+"' has had a price, discount, and stock change";
						}
						else if(changes == 3 || changes == 5 || changes == 6){
							//two conditions present
							if(changes == 3){
								console.log("\nDiscount and price change\n");
								subject = "Discount and price notification for an item on your watch list";
								body = "Hello, the item '"+res.series+" "+res.model+"' from the website '"+res1.site+"' has had a price and discount change";
							}
							else if(changes == 5){
								console.log("\nStock and price change\n");
								subject = "Stock and price notification for an item on your watch list";
								body = "Hello, the item '"+res.series+" "+res.model+"' from the website '"+res1.site+"' has had a price and stock change";
							}
							else if(changes == 6){
								console.log("\nStock and discount change\n");
								subject = "Stock and discount notification for an item on your watch list";
								body = "Hello, the item '"+res.series+" "+res.model+"' from the website '"+res1.site+"' has had a discount and stock change";
							}
						}
						else if(changes == 1 || changes == 2 || changes == 4){
							//one condition present
							if(changes == 1){
								console.log("\nPrice change\n");
								subject = "Price notification for an item on your watch list";
								body = "Hello, the item '"+res.series+" "+res.model+"' from the website '"+res1.site+"' has had a price change";
							}
							else if(changes == 2){
								console.log("\nDiscount change\n");
								subject = "Discount notification for an item on your watch list";
								body = "Hello, the item '"+res.series+" "+res.model+"' from the website '"+res1.site+"' has had a discount change";
							}
							else if(changes == 4){
								console.log("\nStock change\n");
								subject = "Stock notification for an item on your watch list";
								body = "Hello, the item '"+res.series+" "+res.model+"' from the website '"+res1.site+"' has had a stock change";
							}
						}

						if(changes != 0){
							console.log("\n\n"+subject+"\n"+body+"\n\n");

							const mail = {
								from: process.env.EMAIL_USER,
								to: process.env.EMAIL_USER,
								subject: subject,
								text: body
							}

							mailer.sendMail(mail, function(error, info){
								if(error){
									console.log("An error has occurred while sending the email.\n" + error);
								}
								else{
									console.log("Email sent: " + info.response);
								}
							});
						}

					}).catch((error) => {
						console.error("Cannot get data: ", error);
					});
				}

			}).catch((error) => {
				console.error("Cannot get data: ", error);
			});

		});
	}

	scrapeWeb();
	setInterval(scrapeWeb, 3600000);
});