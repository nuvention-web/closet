var mongoose = require('mongoose')
		, Schema = mongoose.Schema;

var item = new Schema({

	name: { type: String, trim: true, required: true },

	hobbies: {type: [String], required: true },
	tags: [String],
	tilePhoto: { type: String, required: true },
	bannerPhoto: { type: String, required: true },

	rating: { type: Number, min: 0.0, max: 10.0 },
	description: { type: String, required: true },
	owner: Schema.Types.Mixed,
	condition: {type: String, enum: ['New', 'Like new', 'Lightly used', 'Used', 'Poor'] },
	conditionDetails: String,
	photos: [String],
	
	isForSale: Boolean,
	salePrice: Number,
	isForRent: Boolean,
	rentalPrice: Number,

	reviews: [{	username: String,
				realName: {firstName: String, lastName: String},
				profilePhoto: String,
				rating: { type: Number, min: 0.0, max: 10.0 },
				content: String
		}],
			  	
	location: String
});

var itemModel = mongoose.model('Item', item);

item.pre('save', function(next) {
	var item = this;
	itemModel.findOne({name: item.name}, function(err, obj) {
		if(err) return next(err);
		if(obj) return next(new Error('master ref exists'));
		return next();
	});
});

module.exports = itemModel;
