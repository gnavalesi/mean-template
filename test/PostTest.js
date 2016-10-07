'use strict';

// Use this line before any other require in every test file
process.env.NODE_ENV = 'test';

const request = require('supertest');
const _ = require('underscore');

const app = require('../app.js');

const post = {
	title: 'Post title',
	content: 'Post content'
};

const invalidPost = {
	title: 'Invalid post title'
};

describe('Post', () => {
	describe('#post api/post', () => {
		it('Should insert a valid post', done => {
			request(app)
				.post('/api/post')
				.send(post)
				.expect(function(res) {
					post._id = res.body._id;
				})
				.expect(200)
				.expect(post, done);
		});

		it('Shouldn\'t insert an invalid post', done => {
			request(app)
				.post('/api/post')
				.send(invalidPost)
				.expect(503, done);
		});
	});

	describe('#get api/post/:id', () => {
		it('Should return a post for a valid id', done => {
			request(app)
				.get('/api/post/' + post._id)
				.expect(200)
				.expect(post, done);
		});

		it('Should return an empty object for an inexisting id', done => {
			request(app)
				.get('/api/post/57f80f3c8850386168a27e1e')
				.expect(200)
				.expect({}, done);
		});

		it('Should return an error for an invalid id', done => {
			request(app)
				.get('/api/post/0')
				.expect(503, done);
		});
	});

	describe('#get api/post', () => {
		it('Should return a list of posts', done => {
			request(app)
				.get('/api/post')
				.expect(200)
				.expect(function(res) {
					if(!_.find(res.body, p => { return p._id === post._id; })) throw new Error('Missing post');
				})
				.end(done);
		});
	});

	describe('#put api/post', () => {
		it('Should update a post with a valid id', done => {
			const update = _.clone(post);
			update.title = 'Title updated';

			request(app)
				.put('/api/post')
				.send(update)
				.expect(200)
				.expect(update, done);
		});

		it('Shouldn\'t update a post with an inexisting id', done => {
			const update = _.clone(post);
			update.title = 'Title updated';
			update._id = '57f80f3c8850386168a27e1e';

			request(app)
				.put('/api/post')
				.send(update)
				.expect(200)
				.expect({}, done);
		});

		it('Should return an error for an invalid id', done => {
			const update = _.clone(post);
			update.title = 'Title updated';
			update._id = '0';

			request(app)
				.put('/api/post')
				.send(update)
				.expect(503, done);
		});
	});

	describe('#delete api/post/:id', () => {
		it('Should delete a post with a valid id', done => {
			request(app)
				.delete('/api/post/' + post._id)
				.expect(200, done);
		});

		it('Shouldn\'t delete a post with an invalid id', done => {
			request(app)
				.delete('/api/post/57f80f3c8850386168a27e1e')
				.expect(200, done);
		});

		it('Should return an error for an invalid id', done => {
			request(app)
				.delete('/api/post/0')
				.expect(503, done);
		});
	});
});