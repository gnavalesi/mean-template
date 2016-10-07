'use strict';

const mongoose = require('mongoose');

/**
 *  @swagger
 *  definition:
 *    Post:
 *      properties:
 *        title:
 *          type: "string"
 *          description: "Post title"
 *        content:
 *          type: "string"
 *          description: "Post content"
 *      required:
 *      - "title"
 *      - "content"
 */
const PostSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	}
}, {
	versionKey: false
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;