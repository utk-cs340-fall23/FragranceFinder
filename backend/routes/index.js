const userRoutes = require('./user-routes.js');
const mailRoutes = require('./mailRoutes');
const router = require('express').Router();


router.use('/users', userRoutes);
router.use('/email', mailRoutes);

// This middleware handles any request that starts with /api and is not handled above
router.use('*', (req, res) => {
    res.status(404).json({ error: 'API route not found' });
});
module.exports = router;