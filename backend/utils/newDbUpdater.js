const { Fragrance, FragranceListing, UserFragrance, User } = require("../models");
const {cleanData} = require('../utils/parsing');
const sequelize = require('../config/db');
const {Sequelize} = require('sequelize');

require('dotenv').config();

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

function emailUpdate(type, fid, price){ // 0: lowest price increase; 1: lowest price decrease; 2: new lowest price
    UserFragrance.findAll({
        where:{
            fragranceId: fid
        }
    }).then(rt => {
        //
    });
}

async function processData(data) {
    const newLowestPrices = {};

    console.log('Processing fragrances...');
    for (let newFragrance of data) {

        // Get existing Fragrance
        const [fragrance, fragranceCreated] = await Fragrance.findCreateFind({
            where: {
                brand: newFragrance.brand,
                title: newFragrance.title,
                concentration: newFragrance.concentration,
                gender: newFragrance.gender
            }
        });

        // Nothing more needs to be done if it's a new Fragrance
        if (fragranceCreated) {
            await FragranceListing.findCreateFind({
                where: {
                    fragranceId: fragrance.id,
                    ...newFragrance
                }
            });
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

        // Find/create FragranceListing
        const fragranceListingFields = Object.keys(FragranceListing.getAttributes())
        let [fragranceListing, created] = await FragranceListing.findOrCreate({
            where: {
                fragranceId: fragrance.id,
                sizeoz: newFragrance.sizeoz,
                site: newFragrance.site
            },
            defaults: Object.fromEntries(Object.entries(newFragrance).filter(
                ([key, val]) => fragranceListingFields.includes(key)
            ))
        });

        // If it's not new and there's no price change, continue
        if (fragranceListing.price != undefined && !created && fragranceListing.price == newFragrance.price) {
            continue;
        }

        // Store intiial price
        const initialPrice = fragranceListing.price || newFragrance.price;

        // Update with new price
        fragranceListing.price = newFragrance.price;
        await fragranceListing.save();

        // If it's a price increase, nothing more is needed
        if (initialPrice >= newFragrance.price) {
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

        // Email
    }
}
function scrapeWeb(){
    const pythonPath = process.env.PYTHON_PATH || 'python';

    console.log('Scraping fragrances...');
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

async function dbUpdate(maxItemsPerScraper) {
    // const data = require('../data/AllRecords.json');
    // await processData(cleanData(data));
    // return;
    // https://stackoverflow.com/questions/23450534/how-to-call-a-python-function-from-node-js
    const spawn = require("child_process").spawn;
    maxItemsPerScraper = maxItemsPerScraper || '';

    scrapeWeb();
}

module.exports = dbUpdate;
