
/**
 * Module dependencies.
 */
var express = require('express')
		, routes = require('./routes')
		, user = require('./routes/user')
		, dash = require('./routes/dash')
		, item = require('./routes/item')
		, http = require('http')
		, passport = require('passport')
		, mongoose = require('mongoose');

var app = express();

//HTTP authentication scheme
var auth = express.basicAuth(function(user, pass) {
 		return user === 'admin' && pass === 'granular crafty gidget';
	});

//set up the basic environment
require('./setupEnv')(app);
app.use(passport.initialize());
app.use(passport.session());
//router MUST come after passport. IDK.
app.use(app.router);

var mongoose = require('mongoose');

// connect to db
// for local to work, mongod (mongodaemon) must be running on port 27017
var uristring =
	process.env.MONGOLAB_URI ||
	process.env.MONGOHQ_URL  ||
	'mongodb://localhost/HelloMongoose';
	
mongoose.connect(uristring, function (err, res) {
	if (err) {
		console.log ('ERROR connecting to: ' + uristring + '. ' + err);
	} else {
		console.log ('Succeeded connecting to: ' + uristring);
		//Add seed data for videogames
		(require('./routes/populate.js'))();
	}
});

//set up passport (better auth) using passport-local-mongoose plugin
var Account = require('./models/Account.js');
passport.use(Account.createStrategy());
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

//declare routing
app.get('/', routes.index);
app.get('/items/masters', item.getItemsQuery);
app.get('/users', auth, user.list);
app.get('/users/:user/dash', dash.index);
app.get('/users/:user/item-page', item-page.index;)
app.post('/users/subscribers', user.addSub);
app.get('/register', user.getRegister);
app.post('/register', user.postRegister);
app.get('/login', user.getLogin);
app.post('/login', passport.authenticate('local'), user.postLogin);
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/login');
});

//start listening
http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
