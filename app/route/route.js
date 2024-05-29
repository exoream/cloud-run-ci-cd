const userRoute = require('./route_user');
const reportRoute = require('./route_report');
const express = require('express');


const router = express.Router();

router.use(userRoute);
router.use(reportRoute);

module.exports = router;