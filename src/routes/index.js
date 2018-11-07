const express = require('express');
const tableLogos = require('../client/TableLogos');

const router = express.Router();

router.get('/', tableLogos);


module.exports = router;
