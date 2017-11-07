var keystone = require('keystone');

exports = module.exports = {

	'all': function (req, res) {

		var view = new keystone.View(req, res);
		var locals = res.locals;

		// Set locals
		locals.section = 'lessons';
		locals.selectedCategory = null;
		locals.posts = [];

		view.on('init', function (next) {

			var q = keystone.list('Post').model.find().sort({"lessonNumber": 1}).populate('healer');

			q.exec(function (err, results) {
				locals.posts = results;
				next(err);
			});

		});

		// Render the view
		view.render('lessons.ejs');
	},

	'list': function (req, res) {

		var view = new keystone.View(req, res);
		var locals = res.locals;

		// Set locals
		locals.section = 'lessons';

		var categoryId = req.params.categoryId;
		
		view.on('init', function (next) {

			var q = keystone.list('PostCategory').model.findOne({
				_id: categoryId
			}).exec(function (err, result) {
				locals.selectedCategory = result;
				next(err);
			});

		});

		view.on('init', function (next) {

			var q = keystone.list('Post').model.find().where('categories').in([categoryId]).sort({"lessonNumber": 1}).populate('healer');

			q.exec(function (err, results) {
				locals.posts = results;
				next(err);
			});

		});
		
		// Render the view
		view.render('lessons.ejs');
	},

	'lesson': function (req, res) {

		var view = new keystone.View(req, res);
		var locals = res.locals;

		// Set locals
		locals.section = 'lesson';

		// Load the current post
		view.on('init', function (next) {

			var q = keystone.list('Post').model.findOne({
				_id: req.params.postId
			}).populate('healer').exec(function (err, result) {
				locals.post = result;
				next(err);
			});

		});

		// Render the view
		view.render('lesson.ejs');
	},

	'recommend': function (req, res) {

		var view = new keystone.View(req, res);
		var locals = res.locals;

		// Set locals
		locals.section = 'recommend';
		
		// Load other posts
		view.on('init', function (next) {

			var q = keystone.list('Post').model.find().where('plans').in([req.params.planId]).sort({"lessonNumber": 1}).populate('healer');

			q.exec(function (err, results) {
				locals.posts = results;
				next(err);
			});

		});

		// Render the view
		view.render('recommend.ejs');
	},

};
