const basicCrudRoutes = require('./basicCrudRoutes');
const router = require('express').Router();


router.use('/', basicCrudRoutes);

module.exports = router;