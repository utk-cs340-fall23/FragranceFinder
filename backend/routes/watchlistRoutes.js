const router = require('express').Router();
const { watchlistActions } = require('../actions');
const {authMiddleware} = require('../utils/auth');

router.post('/:fragranceId', authMiddleware, async (req, res) => {
    watchlistActions.addFragranceToWatchlist(req, res);
});

router.delete('/:fragranceId', authMiddleware, async (req, res) => {
    watchlistActions.removeFragranceFromWatchlist(req, res);
});

module.exports = router;