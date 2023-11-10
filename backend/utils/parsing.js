const ML_TO_OZ_FACTOR = 0.0338;
const genderMapper = {
    'All': "All",
    'Male': "Men's",
    'Female': "Women's",
    'Unisex': "Unisex",
}

// Extract floating point from price string
// e.g. '$24.99' -> 24.99
function extractPrice(str) {
    return parseFloat(str.replace(/[^0-9.]/g, ''));
}

function isEmptyFragrance(newFragrance) {
    return newFragrance.brand == null || newFragrance.title == null || newFragrance.concentration == null || newFragrance.gender == null;
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

function extractFloat(str) {
    const matches = str.match(/[-+]?[0-9]*\.?[0-9]+/);
    return matches ? parseFloat(matches[0]) : 0;
}

function cleanData(data) {
    return data.filter(item => !isEmptyFragrance(item)).map(item => {
        let { size, ...data } = item;

        if (size != null) {
            size = size.toString();
            // Designate size
            if (size.includes('oz')) {
                data.sizeoz = extractFloat(size);
            }
            else if (size.includes('ml')) {
                data.sizeoz = extractFloat(size) * ML_TO_OZ_FACTOR;
            }

            data.sizeoz = parseFloat(data.sizeoz?.toFixed(2) || 0);
        }

        // Parse price string
        data.price = data.price.toString();
        data.price = extractFloat(data.price);

        // Get site
        data.site = extractDomain(data.link);
        data.gender = genderMapper[data.gender] || data.gender;
        return data;
    });
}


module.exports = {
    extractPrice,
    extractDomain,
    extractFloat,
    cleanData
}
