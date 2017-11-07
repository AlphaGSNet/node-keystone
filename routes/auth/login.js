var keystone = require('keystone');
var session = require('keystone/lib/session');
var url = require('url');

exports = module.exports = function(req, res) {

	function renderView() {
		var view = new keystone.View(req, res);
		var locals = res.locals;

		locals.section = 'login';
		locals.message = req.flash('error');
		locals.submitted = req.body;

		view.render('login.ejs');
	}

	// If a form was submitted, process the login attempt
	if (req.method === 'POST') {

		// if (!keystone.security.csrf.validate(req)) {
		// 	req.flash('error', 'There was an error with your request, please try again.');
		// 	return renderView();
		// }

		if (!req.body.email || !req.body.password) {
			req.flash('error', 'Please enter your email address and password.');
			return renderView();
		}

		var onSuccess = function (user) {
			res.redirect('/');
		};

		var onFail = function (err) {
			var message = (err && err.message) ? err.message : 'Sorry, the email and password are not valid.';
			req.flash('error', message );
			renderView();
		};

		session.signin(req.body, req, res, onSuccess, onFail);

	} else {
		renderView();
	}

};
