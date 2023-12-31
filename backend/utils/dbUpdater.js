const { Fragrance, FragranceListing, UserFragrance, User } = require("../models");
const {cleanData} = require('../utils/parsing');
const sequelize = require('../config/db');
const {Sequelize, Op} = require('sequelize');
const mailer = require('../config/mail');

require('dotenv').config();

function extractFields(item, model, ignore) {
    ignore = ignore ? ignore : [];
    const modelFields = Object.keys(model.getAttributes());
    return Object.fromEntries(Object.entries(item).filter(
        ([key, val]) => modelFields.includes(key) && !ignore.includes(key)
    ));
}

async function findSmallest(fid, size){
    const aggregate = await sequelize.query(`
        SELECT
            MIN(price) as minPrice
        FROM
            fragrance_listing
        WHERE
            fragrance_listing.fragrance_id = ${fid}
            AND sizeoz LIKE ${size}
    `, { type: Sequelize.QueryTypes.SELECT });

    return aggregate ? aggregate[0].minPrice : null;
}

async function processData(data) {
    const newLowestPrices = {};
    console.log('Processing fragrances...');
    for (let newFragrance of data) {

        // Get existing Fragrance
        const [fragrance, fragranceCreated] = await Fragrance.findOrCreate({
            where: extractFields(newFragrance, Fragrance, ['photoLink']),
            defaults: extractFields(newFragrance, Fragrance)
        });

        let [fragranceListing, _] = await FragranceListing.findOrCreate({
            where: {
                sizeoz: {
                    [Op.like]: newFragrance.sizeoz
                },
                fragranceId: fragrance.id,
                site: newFragrance.site
            },
            defaults: extractFields(newFragrance, FragranceListing)
        });

        // Nothing more needs to be done if it's a new Fragrance
        if (fragranceCreated) {
            continue;
        }

        // Default lowest price to lowest existing price
        const key = `${fragrance.id}_${newFragrance.sizeoz}`;
        if (newLowestPrices[key] == undefined) {
            const minPrice = await findSmallest(fragrance.id, newFragrance.sizeoz);

            newLowestPrices[key] = {
                fragranceListing: null,
                price: minPrice
            };
        }

        // Update with new price
        const newVals = extractFields(newFragrance, FragranceListing, ['fragranceId']);
        for (let [name, val] of Object.entries(newVals)) {
            fragranceListing[name] = val;
        }

        await fragranceListing.save();

        // If it's a price increase, nothing more is needed
        if (newFragrance.price >= newLowestPrices[key]) {
            continue;
        }

        // Set new lowest price
        newLowestPrices[key] = {
            fragranceListing: fragranceListing,
            price: fragranceListing.price
        };
    }

    const userFragranceListingsMap = {};

    for (let [key, info] of Object.entries(newLowestPrices)) {
        if (info.fragranceListing == null) {
            continue;
        }
        let [fragranceId, _] = key.split('_');
        fragranceId = parseInt(fragranceId);
        const fragranceListing = info.fragranceListing;

        // Find users that have the fragrance watchlisted
        const users = await User.findAll({
            include: [{
                model: Fragrance,
                as: 'watchlist',
                where: {
                    id: fragranceId
                },
                required: true
            }]
        });

        for (let user of users) {

            // Create default object for user
            if (userFragranceListingsMap[user.id] == undefined) {
                userFragranceListingsMap[user.id] = {
                    user: user,
                    fragrances: []
                };
            }

            // Add fragrance that user will be emailed about
            userFragranceListingsMap[user.id].fragrances.push({
                fragrance: user.watchlist[0].get({raw: true}),
                fragranceListing: fragranceListing.get({raw: true})
            });
        }
    }

    // For each user added to userFragranceListingsMap, email
    // the user about the price drops in all of the fragrances
    for (let info of Object.values(userFragranceListingsMap)) {
        const user = info.user;
        const fragrances = info.fragrances;

		message = "<!DOCTYPE html><html>Hello "+user.firstName+",<br><br>The price for the following items on your watchlist have dropped:<br>";

		let list = {};

		for (let fragranceInfo of fragrances) {
			
			let prodName = fragranceInfo.fragrance.title+" "+fragranceInfo.fragrance.concentration+" by "+fragranceInfo.fragrance.brand;
			let prodDetail = [fragranceInfo.fragranceListing.price, fragranceInfo.fragranceListing.link, fragranceInfo.fragranceListing.site];
			
			if(list[prodName] != null){
				if(list[prodName][0] < fragranceInfo.fragranceListing.price){
					list[prodName] = prodDetail;
				}
			}
			else{
				list = Object.assign(list, {[prodName]:prodDetail});
			}
        }
		
		for(let i in list){
			message += "<a href=\""+list[i][1]+"\">"+i+"</a> is now $"+list[i][0]+" at "+list[i][2]+"<br>";
		}
		
		message += "<br>Thank you and have a nice day.</html>";

		const mail = {
			from: process.env.EMAIL_USER,
			to: user.email,
			subject: "Price alerts for one or more items on your watchlist",
			html: message
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
}

async function dbUpdate(maxItemsPerScraper) {
    const data = require('../data/jomashop.json');
    await processData(cleanData(data));
    return;

    const spawn = require("child_process").spawn;
    maxItemsPerScraper = maxItemsPerScraper || '';

	const pythonPath = process.env.PYTHON_PATH || 'python';

    const pyproc = spawn(pythonPath, ["./scrapers/MasterScript.py", maxItemsPerScraper], {
        maxBuffer: 1000 * 1000 * 10 // 10 MB
    });

    let output = '';
    pyproc.stdout.on('data', (data) => {
        output += data.toString();
    });

    pyproc.stdout.on("end", async (data) => {
        await processData(cleanData(JSON.parse(output)));
    });
}

module.exports = dbUpdate;
