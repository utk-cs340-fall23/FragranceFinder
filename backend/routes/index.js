const basicCrudRoutes = require('./basicCrudRoutes');
const mailRoutes = require('./mailRoutes');
const router = require('express').Router();


router.use('/', basicCrudRoutes);
router.use('/', mailRoutes);

module.exports = router;