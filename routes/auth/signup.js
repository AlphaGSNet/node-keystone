var keystone = require('keystone');
var session = require('keystone/lib/session');
var crypto = require('crypto');
var url = require('url');

exports = module.exports = function(req, res) {

	function renderView() {
		var view = new keystone.View(req, res);
		var locals = res.locals;

		locals.section = 'signup';
		locals.message = req.flash('error');
		locals.submitted = req.body;

		view.render('signup.ejs');
	}

	function hash(str) {
		// force type
		str = '' + str;
		// get the first half
		str = str.substr(0, Math.round(str.length / 2));
		// hash using sha256
		return crypto
			.createHmac('sha256', keystone.get('cookie secret'))
			.update(str)
			.digest('base64')
			.replace(/\=+$/, '');
	}


	// If a form was submitted, process the login attempt
	if (req.method === 'POST') {

		if (!req.body.firstName || !req.body.lastName) {
			req.flash('error', 'Please enter your first and last name.');
			return renderView();
		}

		if (!req.body.email || !req.body.password) {
			req.flash('error', 'Please enter your email address and password.');
			return renderView();
		}

		if (req.body.password != req.body.password_confirm) {
			req.flash('error', 'Please confirm your password.');
			return renderView();
		}

		// check validation email
		keystone.list('User').model.findOne({
			email: req.body.email
		}).exec(function (err, result) {
			if(result) {
				console.log(result);
				req.flash('error', 'Your email has already been registered.');
				return renderView();
			}
			else {
				var newUser = keystone.list('User').model({
					email: req.body.email,
					password: hash(req.body.password),
					name: {
						first: req.body.firstName,
						last: req.body.lastName
					}
				})
				newUser.save(function(err) {
					if(err) {
						var message = (err && err.message) ? err.message : 'Sorry, user signup failed';
						req.flash('error', message );
						renderView();
					}
					else {
						req.user = newUser;
						res.redirect('/');
						// session.signin(req.body, req, res, onSuccess, onFail);
					}
				});
			}
		});

		
		var onSuccess = function (user) {
			res.redirect('/');
		};

		var onFail = function (err) {
			var message = (err && err.message) ? err.message : 'Sorry, user signup failed';
			req.flash('error', message );
			renderView();
		};

	} else {
		renderView();
	}

};
