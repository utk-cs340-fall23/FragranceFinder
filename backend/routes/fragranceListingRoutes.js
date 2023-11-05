const router = require('express').Router();
const { fragranceListingActions } = require('../actions');

router.get('/', async (req, res) => {
    try {
        await fragranceListingActions.getfragranceListings(req, res);
    }
    catch (err) {
        res.json({
            success: false
        });
    }
});

router.get('/search-defaults', async (req, res) => {
    try {
        await fragranceListingActions.getSearchDefaults(req, res);
    }
    catch (err) {
        res.json({
            success: false
        });
    }
});

module.exports = router;