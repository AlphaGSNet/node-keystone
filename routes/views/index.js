var keystone = require('keystone');

exports = module.exports = {

	'home': function (req, res) {

		var view = new keystone.View(req, res);
		var locals = res.locals;

		// locals.section is used to set the currently selected
		// item in the header navigation.
		locals.section = 'home';

		// Render the view
		view.render('home.ejs');
	},

	'any': function (req, res) {
		res.redirect('/');
	},

	'login': function(req, res) {
		var view = new keystone.View(req, res);
		var locals = res.locals;

		locals.section = 'signup';
		locals.message = req.flash('loginMessage');

		view.render('login.ejs');
    },

	'signup': function (req, res) {
		var view = new keystone.View(req, res);
		var locals = res.locals;

		locals.section = 'signup';

		view.render('signup.ejs');
	},

	'plans': function(req, res, next) {
		var view = new keystone.View(req, res);
		var locals = res.locals;

		locals.section = 'plans';

		// Load other posts
		view.on('init', function (next) {

			var q = keystone.list('Plan').model.find();

			q.exec(function (err, results) {
				locals.plans = results;
				next(err);
			});

		});

		view.render('plans.ejs');
	},

	'faqs': function(req, res, next) {
		var view = new keystone.View(req, res);
		var locals = res.locals;

		locals.section = 'faqs';

		// Load other posts
		view.on('init', function (next) {

			var q = keystone.list('Faq').model.find();

			q.exec(function (err, results) {
				locals.faqs = results;
				next(err);
			});

		});

		view.render('faqs.ejs');
	},

	'healers': function(req, res, next) {
		var view = new keystone.View(req, res);
		var locals = res.locals;

		locals.section = 'healers';

		// Load other posts
		view.on('init', function (next) {

			var q = keystone.list('Healer').model.find().sort('name');

			q.exec(function (err, results) {
				locals.healers = results;
				next(err);
			});

		});

		view.render('healers.ejs');
	}
};
