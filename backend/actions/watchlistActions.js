const {UserFragrance} = require('../models');

async function addFragranceToWatchlist(req, res) {
    const existingItem = await UserFragrance.findOne({
        where: {
            fragranceId: req.params.fragranceId,
            userId: req.user.id
        }
    });

    if (!existingItem) {
        await UserFragrance.create({
            fragranceId: req.params.fragranceId,
            userId: req.user.id
        });
    }

    res.json({
        success: true
    });
}

async function removeFragranceFromWatchlist(req, res) {
    await UserFragrance.destroy({
        where: {
            fragranceId: req.params.fragranceId,
            userId: req.user.id
        }
    });

    res.json({
        success: true
    });
}


module.exports = {
    addFragranceToWatchlist,
    removeFragranceFromWatchlist
}