var express = require('express');
var ApiController = require('../controllers/ApiController');

var router = express.Router();

/**
 * @swagger
 * /api/version:
 *   get:
 *     description: "Returns the application version"
 * 	   produces:
 * 	   - application/json
 * 	   responses:
 * 	     200:
 * 	       description: "OK"
 */
router.get('/version', [ApiController.version]);

module.exports = router;