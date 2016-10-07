var express = require('express');
var PostController = require('../../controllers/PostController');

var router = express.Router();

/**
 * @swagger
 * /api/post:
 *   get:
 *     description: "Returns every post"
 * 	   produces:
 * 	   - application/json
 * 	   responses:
 * 	     200:
 * 	       description: "OK"
 */
router.get('/', [PostController.findAll]);

router.get('/:id', [PostController.findById]);

router.post('/', [PostController.insert]);

router.put('/', [PostController.update]);

router.delete('/:id', [PostController.remove]);

module.exports = router;