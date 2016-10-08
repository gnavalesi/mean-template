const Post = require('../models/Post');

function findAll(req, res) {
	return Post.find({}).then(posts => {
		res.status(200).send(posts);
	}).catch(e => {
		res.status(503).send(e);
	});
}

function findById(req, res) {
	return Post.findById(req.params.id)
		.then(post => {
			res.status(200).send(post);
		}).catch(e => {
			res.status(503).send(e);
		});
}

function insert(req, res) {
	const post = new Post(req.body);

	return post.save(req.body)
		.then(post => {
			res.status(200).send(post);
		}).catch(e => {
			res.status(503).send(e);
		});
}

function update(req, res) {
	return Post.findByIdAndUpdate(req.params.id, req.body, {
		'new': true
	}).then(post => {
		res.status(200).send(post);
	}).catch(e => {
		res.status(503).send(e);
	});
}

function remove(req, res) {
	return Post.findByIdAndRemove(req.params.id)
		.then(() => {
			res.status(200).send();
		}).catch(e => {
			res.status(503).send(e);
		});
}

module.exports = {
	findAll: findAll,
	findById: findById,
	insert: insert,
	update: update,
	remove: remove
};