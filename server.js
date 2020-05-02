const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./models');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/api/users', (req, res) => {
	db.user.findAll({ raw: true }).then((results) => {
		if (results) {
			res.json(results);
		}
	});
});

app.get('/api/tweets', (req, res) => {
	db.tweets.findAll().then((results) => {
		res.json(results);
	});
});

app.get('/api/tweetsByUser/:id', (req, res) => {
	db.user.findByPk(req.params.id).then((user) => {
		if (user) {
			// Since we added the association sequlize will give us a method
			// To retrieve the tweets by the user's id
			user.getTweets().then((tweets) => {
				res.json(tweets);
			});
		}
	});
});

app.post('/api/newUser', (req, res) => {
	const user = req.body;
	db.user.create(user).then((results) => {
		res.json(results);
	});
});

app.post('/api/newTweet', (req, res) => {
	const tweet = req.body;
	db.tweets.create(tweet).then((results) => {
		res.json(results);
	});
});

app.listen(3000, () => {
	console.log('Listening on \n  http://localhost:3000');
});
