const userRoutes = require('./userRoutes.js');
const mailRoutes = require('./mailRoutes.js');
const fragranceListingRoutes = require('./fragranceListingRoutes.js');
const watchlistRoutes = require('./watchlistRoutes.js');
const router = require('express').Router();


router.use('/users', userRoutes);
router.use('/fragrance-listings', fragranceListingRoutes);
router.use('/watchlist', watchlistRoutes);
router.use('/email', mailRoutes);

// This middleware handles any request that starts with /api and is not handled above
router.use('*', (req, res) => {
    res.status(404).json({ error: 'API route not found' });
});

module.exports = router;