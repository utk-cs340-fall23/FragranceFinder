const fragranceData = require('../data/jomashop.json');
const {FragranceListing, Fragrance} = require('../models');
const {cleanData} = require('../utils/parsing');
const sequelize = require('../config/db');



const destroyExistingData = async () => {
    await FragranceListing.destroy({
        where: {}
    });
    await Fragrance.destroy({
        where: {}
    });

}
const getFragranceMapKey = (item) => {
    return `${item.gender}__${item.brand}__${item.title}__${item.concentration}`.toLowerCase();
}

const loadFragrances = async () => {
    await destroyExistingData();
    const data = cleanData(fragranceData);

    const fragranceMap = new Map();
    const fragranceListings = [];

    for (let item of data) {

        // Create map key used to determine unique fragrances
        const mapKey = getFragranceMapKey(item);
        let fragrance = fragranceMap.get(mapKey);

        // If fragrance doesn't exist, create it.
        if (!fragrance) {
            fragrance = await Fragrance.create(item);
            fragranceMap.set(mapKey, fragrance);
        }

        fragranceListings.push({
            fragranceId: fragrance.id,
            ...item
        });
    }

    console.log('Bulk creating FragranceListing records...');
    await FragranceListing.bulkCreate(fragranceListings);

    console.log('Done.');
}

sequelize.sync({ force: false, alter: true }).then(() => {
    loadFragrances();
});
