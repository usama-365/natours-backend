const express = require('express');
const { getOverviewPage, getToursPage } = require('../controllers/views.controller');

const router = express.Router();

router.get("/", getOverviewPage);
router.get('/tour', getToursPage);

module.exports = router;