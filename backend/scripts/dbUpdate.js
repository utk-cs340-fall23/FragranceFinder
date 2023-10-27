const dbUpdate = require('../utils/dbUpdater');
let maxItemsPerScraper = null;

const printUsage = () => {
    console.log('USAGE: node scripts/dbUpdate.js <max items per scraper (optional): int>')
}

if (process.argv.length > 2) {
    maxItemsPerScraper = parseInt(process.argv[2])
    if (isNaN(maxItemsPerScraper)) {
        console.log('ERROR: Improper usage');
        printUsage();
        process.exit();
    }
}

dbUpdate(maxItemsPerScraper);