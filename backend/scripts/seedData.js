const jomashopData = require('../data/jomashop.json');
const {FragranceListing, Fragrance} = require('../models');

// Extract floating point from price string
// e.g. '$24.99' -> 24.99
function parsePrice(str) {
    return parseFloat(str.replace(/[^0-9.]/g, ''));
}


// Use JavaScript's URL builder to parse hostname
function extractDomain(url) {
    try {
        let parsedURL = new URL(url);
        return parsedURL.hostname;
    } catch (e) {
        console.error("Invalid URL");
        return null;
    }
}

const cleanData = (data) => {
    return data.filter(item => item.title != 'N/A').map(item => {
        const {size, ...data} = item;

        // Designate size
        if (size.includes('oz')) {
            data.sizeoz = size.replace('oz', '').trim();
        }
        else if (size.includes('ml')) {
            data.sizeml = size.replace('ml', '').trim();
        }

        // Parse price string
        data.price = parsePrice(data.price);

        // Get site
        data.site = extractDomain(data.link);

        return data;
    });
}

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
    const data = cleanData(jomashopData);
    const fragranceMap = new Map();
    const fragranceListings = []
    for (let item of data) {

        // Create map key used to determine unique fragrances
        const mapKey = getFragranceMapKey(item);
        let fragrance = fragranceMap.get(mapKey);

        // If fragrance doesn't exist, create it.
        if (!fragrance) {
            fragrance = await Fragrance.create({
                brand: item.brand,
                title: item.title,
                concentration: item.concentration,
                gender: item.gender,
                photoLink: item.photoLink
            });
            fragranceMap.set(mapKey, fragrance);
        }

        fragranceListings.push({
            fragranceId: fragrance.id,
            ...item
        });
    }

    await FragranceListing.bulkCreate(fragranceListings);
}


loadFragrances();