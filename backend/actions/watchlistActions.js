const {UserFragrance} = require('../models');

async function addFragranceToWatchlist(req, res) {
    const [item, _] = await UserFragrance.findCreateFind({
        where: {
            fragranceId: req.params.fragranceId,
            userId: req.user.id
        }
    });

    res.json({
        success: !!item
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