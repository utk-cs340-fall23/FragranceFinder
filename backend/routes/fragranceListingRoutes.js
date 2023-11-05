const router = require('express').Router();
const { fragranceListingActions } = require('../actions');
const {attachUserMiddleware} = require('../utils/auth');

router.get('/', attachUserMiddleware, async (req, res) => {
    fragranceListingActions.getfragranceListings(req, res);
});

router.get('/search-defaults', async (req, res) => {
    fragranceListingActions.getSearchDefaults(req, res);
});

module.exports = router;