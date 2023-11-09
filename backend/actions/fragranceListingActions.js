const { FragranceListing, Fragrance, User, UserFragrance} = require('../models');
const {Op} = require('sequelize');
const sequelize = require('../config/db');
const {Sequelize} = require('sequelize');

const FRAGRANCE_QUERY_LIMIT = 20;

async function getfragranceListings(req, res) {
    const {
        priceStart,
        priceEnd,
        sizeStart,
        sizeEnd,
        brands,
        gender,
        searchInput,
        page
    } = req.query;

    const watchlisted = req.query.watchlisted;

    // Parse the sortBy field. This involves determining which model (Fragrance or FragranceListing)
    // that the field belongs to
    let sortBy = req.query.sortBy ? req.query.sortBy.split(',') : undefined;
    if (sortBy) {
        const fragranceFields = Object.keys(Fragrance.getAttributes());
        if (fragranceFields.includes(sortBy[0])) {
            sortBy.unshift({model: Fragrance})
        }
        sortBy = [sortBy]
    }

    // Initialize model filters
    const fragranceWhere = {}
    const fragranceListingWhere = {
        price: {
            [Op.between]: [parseFloat(priceStart), parseFloat(priceEnd)],
        },
        sizeoz: {
            [Op.between]: [parseFloat(sizeStart), parseFloat(sizeEnd)],
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

    // Filter based on searchInput if provided
    if (searchInput && searchInput.trim() !== '') {
        const searchTerms = searchInput.trim().split(' ');
        const searchConditions = searchTerms.map(term => ({
            [Op.or]: [
                { brand: { [Op.like]: `%${term}%` } },
                { title: { [Op.like]: `%${term}%` } },
                { gender: { [Op.like]: `%${term}%` } }
            ]
        }));

        fragranceWhere[Op.and] = searchConditions;
    }

    const fragranceSubquery = {
        model: Fragrance,
        where: fragranceWhere
    }

    // If there's a valid user, filter on whether or
    // not the fragrance is watchlisted
    if (req.user) {
        fragranceSubquery.include = [{
            model: User,
            as: 'watchlist',
            through: {
                attributes: []
            },
            attributes: ['id'],
            where: {
                id: req.user.id
            },
            required: watchlisted == 'true'
        }]
    }

    // Define a subquery for non-watchlisted items if needed
    if (watchlisted == 'false' && req.user) {
         const entries = await UserFragrance.findAll({
            attributes: ['fragranceId'],
            where: {
                userId: req.user.id
            },
            raw: true
        });

        fragranceWhere.id = {
            [Op.notIn]: entries.map(entry => entry.fragranceId)
        };
    }

    // Call find and count since we need to know the total rows
    // even though we're limiting results
    const fragranceListings = await FragranceListing.findAndCountAll({
        where: fragranceListingWhere,
        include: [fragranceSubquery],
        offset: page * FRAGRANCE_QUERY_LIMIT,
        limit: FRAGRANCE_QUERY_LIMIT,
        order: sortBy,
        subQuery: false
    });

    const listingsWithWatchlisted = fragranceListings.rows.map(f => {
        const plainFragrance = f.get({ plain: true });
        plainFragrance.fragrance.watchlisted = !!f.fragrance.watchlist?.length;
        return plainFragrance;
    });

    res.json({
        success: true,
        data: listingsWithWatchlisted,
        totalCount: fragranceListings.count
    });
};

async function getSearchDefaults(req, res) {

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
        order: [['listingCount', 'DESC']]
    })

    // Return search defaults
    res.json({
        success: true,
        data: {
            ...aggregates[0],
            brands: brandGrouping.map(b => b.get())
        }
    });
};


module.exports = {
    getfragranceListings,
    getSearchDefaults
};