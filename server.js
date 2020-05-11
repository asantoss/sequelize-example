const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./models');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
var passport = require('passport');
const bcrypt = require('bcryptjs');
var LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');

const myStore = new SequelizeStore({
	db: db.sequelize,
});
// We are using the local strategy. Below we define how we query our user in the database.
passport.use(
	new LocalStrategy(
		{
			usernameField: 'email',
		},
		function (email, password, done) {
			db.user
				.findOne({ where: { email } })
				.then((user) => {
					if (user) {
						//If the user if found with that email, we run the password provided through bcrypt.
						bcrypt.compare(password, user.password).then((res) => {
							if (res) {
								return done(null, user);
							} else {
								return done(null, false, { message: 'Incorrect password.' });
							}
						});
					}
					if (!user) {
						return done(null, false, { message: 'Incorrect details.' });
					}
				})
				.catch((err) => done(err));
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	db.user
		.findByPk(id)
		.then((user) => {
			done(null, user);
		})
		.catch((error) => {
			console.log(`Error: ${error}`);
		});
});
app.use(flash());
app.use(
	session({
		store: myStore,
		secret: 'keyboard cat',
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: false,
			maxAge: 60 * 1000 * 15,
		},
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	if (req.path !== '/login') {
		return res.redirect('/login');
	}
	next();
});

app.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/dashboard',
		failureRedirect: '/login',
		failureFlash: 'Incorrect details',
		successFlash: 'Logged In!',
	})
);

app.get('/login', function (req, res) {
	//This route will render our login view.
	res.render('login', { message: req.flash('error') });
});

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
app.get('/dashboard', (req, res) => {
	db.user.findByPk(req.session.passport.user).then((user) => {
		if (user) {
			user.getTweets().then((tweets) => {
				if (tweets.length) {
					user.tweets = tweets;
				} else {
					user.tweets = [];
				}
				res.render('dashboard', { user });
			});
		}
	});
});

app.get('/api/tweetsByUser/:id', (req, res) => {
	db.user.find({ where: { email: req.body.email } }).then((user) => {
		if (user) {
			const userPassword = user.password;
			bcrypt.compare(req.body.passowrd, userPassword, function (err, results) {
				if (err) res.json('Wrong password');

				res.json('Sucess');
			});
			// Since we added the association sequlize will give us a method
			// To retrieve the tweets by the user's id
			user.getTweets().then((tweets) => {
				res.json(tweets);
			});
		} else {
			res.json('No user found!');
		}
	});
});

app.post('/api/newUser', (req, res) => {
	const user = req.body;
	const password = req.body.password;
	bcrypt.hash(password, 10).then((hash) => {
		user.password = hash;
		db.user.create(user).then((results) => {
			res.json(results);
		});
	});
});

// We can are expecting a body that looks like this
/**
 * 	{
 * "message": "Hello world",
 * 	"userId": "1"
 * 	}
 */
// cURL -d '{"message": "Hello World", "userId": "1"}' -H "Content-Type: application/json" -X POST http://localhost:3000

app.post('/api/newTweet', (req, res) => {
	const sessionUser = req.session.passport.user;
	const message = req.body.message;
	db.tweets.create({ userId: sessionUser, message }).then((results) => {
		// If we succesfully create the tweet we are redirecting them back to the dashboard
		res.redirect('/dashboard');
	});
});

app.listen(3000, () => {
	console.log('Listening on \n  http://localhost:3000');
});
