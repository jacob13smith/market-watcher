var express = require('express');
var router = express.Router();

// This is a test endpoint for framework purposes.
router.get('/', async( req, res ) => {
	res.json({ pass: true, data: 'This is a test response.'})
});

module.exports = router;