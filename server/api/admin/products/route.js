const express = require('express');
const { query } = require('../../../utils/dbQuery');
const { verifyToken } = require('../../../middlewares/verfiyToken');
const router = express.Router();

module.exports = router;
