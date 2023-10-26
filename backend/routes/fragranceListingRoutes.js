const router = require('express').Router();
const { FragranceListing, Fragrance } = require('../models');
const {Op} = require('sequelize');
const sequelize = require('../config/db');
const {Sequelize} = require('sequelize');


router.get('/', async (req, res) => {
    const {
        price_start,
        price_end,
        size_start,
        size_end,
        brands,
        gender
    } = req.query;

    // Initialize model filters
    const fragranceWhere = {}
    const fragranceListingWhere = {
        price: {
            [Op.between]: [parseFloat(price_start), parseFloat(price_end)],
        },
        sizeoz: {
            [Op.between]: [parseFloat(size_start), parseFloat(size_end)],
        }
    }

    // Only filter on brands if some are provided
    const getAllBrands = brands == '';
    if (!getAllBrands) {
        fragranceWhere.brand = {
            [Op.in]: brands.split(',')
        }
    }

    // Only filter on gender if a specific one
    // is selected
    if (gender != 'All') {
        fragranceWhere.gender = gender;
    }

    // Get data and return
    const fragranceListings = await FragranceListing.findAll({
        where: fragranceListingWhere,
        include: {
            model: Fragrance,
            where: fragranceWhere
        },
    });

    res.json({
        success: true,
        data: fragranceListings.map(f => f.get({
            plain: true
        }))
    });
});

router.get('/search-defaults', async (req, res) => {

    // Aggregate max price and max size
    const aggregates = await sequelize.query(`
        SELECT
            MAX(price) as maxPrice,
            MAX(sizeoz) as maxSize
        FROM
            fragrance_listing
    `, { type: Sequelize.QueryTypes.SELECT });

    // Group listings by brand and count the occurrences for
    // each brand
    const brandGrouping = await FragranceListing.findAll({
        attributes: [
            [Sequelize.fn('COUNT', Sequelize.col('fragrance_listing.id')), 'listingCount'],
            [Sequelize.col('fragrance.brand'), 'brand']
        ],
        include: [{
            model: Fragrance,
            attributes: []
        }],
        group: ['fragrance.brand'],
    })

    // Return search defaults
    res.json({
        success: true,
        data: {
            ...aggregates[0],
            brands: brandGrouping.map(b => b.get())
        }
    });
});


module.exports = router;