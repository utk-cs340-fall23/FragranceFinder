const router = require('express').Router();
const { FragranceListing } = require('../models');


router.get('/', async (req, res) => {
    const fragranceListings = await FragranceListing.findAll({
        include: 'fragrance'
    });

    const rawData = fragranceListings.map(f => {
        return f.get({
            plain: true
        })
    })

    res.json({
        success: true,
        data: rawData
    });
});


module.exports = router;