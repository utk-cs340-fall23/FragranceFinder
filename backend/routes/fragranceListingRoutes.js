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

    const brandNames = brands.split(',');
    const getAllBrands = brandNames.includes('all') || brandNames[0] == '';

    let fragranceWhere = {}
    if (!getAllBrands) {
        fragranceWhere.brand = {
            [Op.in]: brandNames
        }
    }

    if (gender != 'All') {
        fragranceWhere.gender = gender;
    }

    const fragranceListingWhere = {
        price: {
            [Op.between]: [parseFloat(price_start), parseFloat(price_end)],
        },
        sizeoz: {
            [Op.between]: [parseFloat(size_start), parseFloat(size_end)],
        }
    }

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
    const aggregates = await sequelize.query(`
        SELECT
            MAX(price) as maxPrice,
            MAX(sizeoz) as maxSize
        FROM
            fragrance_listing
    `, { type: Sequelize.QueryTypes.SELECT });

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

    res.json({
        success: true,
        data: {
            ...aggregates[0],
            brands: brandGrouping.map(b => b.get())
        }
    });
});


module.exports = router;