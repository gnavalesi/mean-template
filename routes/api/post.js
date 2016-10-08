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
 * 	       schema:
 *           type: "array"
 *           items:
 *             $ref: "#/definitions/Post"
 */
router.get('/', [PostController.findAll]);

/**
 * @swagger
 * /api/post/{id}:
 *   get:
 *     description: "Returns the post with id {id}"
 *     parameters:
 *     - in: "path"
 *       name: "id"
 *       required: true
 *       schema:
 *         type: "string"
 * 	   produces:
 * 	   - application/json
 * 	   responses:
 * 	     200:
 * 	       description: "OK"
 * 	       schema:
 *           $ref: "#/definitions/Post"
 */
router.get('/:id', [PostController.findById]);

/**
 * @swagger
 * /api/post:
 *   post:
 *     description: "Creates a new post"
 *     consumes:
 *     - application/json
 *     parameters:
 *     - in: "body"
 *       name: "post"
 *       required: true
 *       schema:
 *         $ref: "#/definitions/Post"
 * 	   produces:
 * 	   - application/json
 * 	   responses:
 * 	     200:
 * 	       description: "OK"
 * 	       schema:
 *           $ref: "#/definitions/Post"
 */
router.post('/', [PostController.insert]);

/**
 * @swagger
 * /api/post/{id}:
 *   put:
 *     description: "Updates a post"
 *     consumes:
 *     - application/json
 *     parameters:
 *     - in: "path"
 *       name: "id"
 *       required: true
 *       schema:
 *         type: "string"
 *     - in: "body"
 *       name: "post"
 *       required: true
 *       schema:
 *         $ref: "#/definitions/Post"
 * 	   produces:
 * 	   - application/json
 * 	   responses:
 * 	     200:
 * 	       description: "OK"
 * 	       schema:
 *           $ref: "#/definitions/Post"
 */
router.put('/:id', [PostController.update]);

/**
 * @swagger
 * /api/post/{id}:
 *   delete:
 *     description: "Deletes a post"
 *     parameters:
 *     - in: "path"
 *       name: "id"
 *       required: true
 *       schema:
 *         type: "string"
 * 	   produces:
 * 	   - application/json
 * 	   responses:
 * 	     200:
 * 	       description: "OK"
 */
router.delete('/:id', [PostController.remove]);

module.exports = router;