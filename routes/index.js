/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);
var greeter = require('keystone-greeter');

// Handle 404 errors
keystone.set('404', function(req, res, next) {
    res.notfound();
});
 
// Handle other errors
keystone.set('500', function(err, req, res, next) {
    var title, message;
    if (err instanceof Error) {
        message = err.message;
        err = err.stack;
    }
    res.err(err, title, message);
});
 
// Common Middleware
keystone.pre('routes', middleware.initErrorHandlers);
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
	auth: importRoutes('./auth')
};

// greeter.set('debug', true);
greeter.set('user model','User')

// Setup Route Bindings
exports = module.exports = function (app) {
	//greeter
	greeter.init({ keystone: keystone }, true);
    greeter.add('/greeter');

    keystone.set('signin redirect', '/');
    keystone.set('signin url', '/greeter');
    greeter.set('redirect timer',0);

    greeter.set('greeter style',true); // include default css
	greeter.set('keystone style',true); // include /styles/site.min.css

	greeter.set('allow register', true);
	greeter.set('new user can admin', false),

	greeter.setField('register', 'text','D-name', {
	    label: 'First Last',
	    'field': 'name',
	    modify: ['first','last'],
	    modifyParameter: ' '
	});

	function modify(value, modify ) {

	    if(!value) return false;
	    if(!modify.modify) return false;

	    var save = {};                                  
	    var modifiers = modify.modify;
	    var modifyParameter = modify.modifyParameter || ' ';

	    if(modifiers instanceof Array && modifiers.length > 1) {

	        var splitName = value.split(' ');

	        save[modifiers[0]] = splitName[0];
	        var cname;
	        if(splitName.length > 2) {

	            for(var i=1;i<=splitName.length;i++) {
	                cname+=' ' + (splitName[i] || '');
	            }

	        } else {
	            cname = splitName[1] || '';
	        }
	        save[modifiers[1]] = cname;

	    } else if(modifiers instanceof Array){

	        save[modifiers[0]] = req.body.name;

	    } else if(typeof modifiers === 'string'){

	        save[modifiers] = req.body.name;

	    } else {

	        save = req.body.name;

	    }
	    return save;
	}

	// Auth
	// app.use('/login', routes.auth.login);
	// app.use('/signup', routes.auth.signup);
	
	// Views
	app.get('/', routes.views.index.home);
	app.get('/undefined', routes.views.index.any);
	app.get('/faqs', routes.views.index.faqs);
	app.get('/healers', routes.views.index.healers);
	app.get('/plans', middleware.requireUser, routes.views.index.plans);
	
	app.get('/lessons', middleware.requireUser, routes.views.lessons.all);
	app.get('/lessons/:categoryId/:categoryName', middleware.requireUser, routes.views.lessons.list);
	app.get('/lesson/:postId/:postTitle', middleware.requireUser, routes.views.lessons.lesson);
	app.get('/recommend/:planId', middleware.requireUser, routes.views.lessons.recommend);

	// app.get('/blog/:category?', routes.views.blog);
	// app.get('/blog/post/:post', routes.views.post);
	// app.get('/gallery', routes.views.gallery);
	// app.get('/contact', routes.views.contact);
	app.all('/', routes.views.index.home);

	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

};
