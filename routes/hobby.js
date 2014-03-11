var Items = require('../models/Item.js')
	, Hobbies = require('../models/Hobby.js')
	, Account = require('../models/Account.js');

exports.index = function(req, res) {
	var hobbyQuery = req.params.hobby;
	var hobbyResult, itemsResult, marketItems;
	
	Hobbies.findOne({ name: hobbyQuery }).exec().addBack(function(err, result) {
		if(err) console.log(err);
		return result;
	})
	.then( function(hobby) {
		hobbyResult = hobby;
		return Items.find({ hobbies: hobbyQuery }).exec();
	})
	.then(function(hobbyItems) {
		itemsResult = hobbyItems;
		
		marketItems = itemsResult.filter(function(item) { return item.isForSale || item.isForRent; });
		
		if(! (hobbyResult && itemsResult)) return [];
		
		var activity = hobbyResult.activity.map(function(el){el.type='general'; return el}).concat(itemsResult.map(function(el){ el.type='newItem'; return el}));

		activity.sort(function(i1, i2) {
			return i1.timeStamp - i2.timeStamp;
		});
		
		return activity;
	})
	.then( function(activity) {
		activity && hobbyResult ? res.render('hobby', { user: req.user, recentActivity: activity, hobby: hobbyResult, marketplace: marketItems }) : res.status('404').send('That hobby doesn\'t exist!');
	});
}
