
/*
 * Handle user routings
 */

var Account = require('../models/Account.js');
var Subscriber = require('../models/Subscriber.js');
var passport = require('passport');

exports.list = function(req, res){
	Subscriber.find({}).exec(function (err, result) {
		if(!err) {
				console.log(result);
				res.render('userlist', { users: result });
		} else { console.log('error: ' + err); }
	});
};

exports.addSub = function(req, res){
	var newSub = new Subscriber({ email: req.body.email });
	var e = false;
	newSub.save(function(err){ e = err; });
	
	res.send({error: e, txt: 'Thanks! We\'ll be in touch.'});
};

exports.getRegister = function(req, res){
	//load a registration page
	console.log(req.query);
	res.render('register', { params: req.query||'none' });
};

exports.postRegister = function(req, res){
	//register a new Account here
	Account.register(new Account({ username: req.body.username, 
															   email: req.body.email }),
									 req.body.password,
									 function(err, account) {
										if (err) {
											console.log(err);
											return res.send({error: err});
										}
										 
										passport.authenticate('local')(req, res, function() {
											res.redirect('/');
										 });
									 });
								};

exports.getLogin = function(req, res){
	//load up a login page
	res.render('login', { });
}

exports.postLogin = function(req, res) {
	//user specific logic is specified in routing
	res.send('/');
}

exports.profile = function(req, res) {
	if(req.params.userid) {
		Account.findOne({_id: req.params.userid}, function(err, result) {
			console.log(result);
			result ? res.render('profile', { user: req.user, profile: result }) : res.status('404').send('No such user.');
		});
	} else {
		req.isAuthenticated() ? res.render('profile', { user: req.user, profile: req.user }) : res.redirect('/login');
	}
}

exports.getName = function (req, res) {
	if(req.params.userid) {
		Account.findOne({_id: req.params.userid}, 'name', function(err, result) {
			if(err) console.log(err);
			console.log('getname: '+result.name);
			res.send(result.name);
		});
	}
}

exports.getPhoto = function (req, res) {
	if(req.params.userid) {
		console.log(req.params.userid);
		Account.findOne({_id: req.params.userid}, function(err, result) {
			if(err) console.log(err);
			console.log('getphoto: '+result.profilePicture);
			res.send(result.profilePicture);
		});
	}
}
