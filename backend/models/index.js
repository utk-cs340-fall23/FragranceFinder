// import the models
const User = require('./User');
const Fragrance = require('./Fragrance');
const FragranceListing = require('./FragranceListing');
const UserFragrance = require('./UserFragrance');

// create associations
User.belongsToMany(Fragrance, {
    through: UserFragrance,
    as: 'watchlisted_fragrances',
    foreignKey: 'user_id',
    onDelete: 'SET NULL'
});

Fragrance.belongsToMany(User, {
    through: UserFragrance,
    as: 'watchlisted_fragrances',
    foreignKey: 'fragrance_id',
    onDelete: 'SET NULL'
});

FragranceListing.belongsTo(Fragrance, {
    foreignKey: 'fragranceId',
    onDelete: 'SET NULL'
});


module.exports = { User, Fragrance, FragranceListing, UserFragrance };