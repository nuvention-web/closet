var Item = require('../models/Item.js')
	, Account = require('../models/Account.js')
	, Hobby = require('../models/Hobby.js')
	, ObjectId = require('mongoose').Types.ObjectId;

module.exports = function() {
	
	//TODO: upload form, activity feed
	
	var Ouser2 = {
		username: "user2",
		email: "test2@test.com",
		name: { first: "John", last: "Smith" },
		hobbies: ["outdoor", "Wine", "Videogames", "Fashion"],
		profilePicture: "/images/user2.jpg",
		myCollection: [],
		favorites: [],
		friends: [],
		bannerPhoto: "banner.jpg"
	};

	var Ouser3 = {
		username: "user3",
		email: "test3@test.com",
		name: { first: "Andy", last: "Trudeau" },
		hobbies: ["outdoor", "Wine", "Videogames", "Fashion"],
		profilePicture: "/images/user3.jpg",
		myCollection: [],
		favorites: [],
		friends: [],
		bannerPhoto: "banner.jpg"
	};
	
	var OtestUser = {
		username: "testUser",
		email: "test@test.com",
		name: {first: "Abigail", last: "Berwyn" },
		hobbies: ["Outdoor", "Fashion", "Wine", "Photography", "Videogames"],
		profilePicture: "/images/abigail.png",
		location: 'San Francisco, CA',
		myCollection: [],
		favorites: [],
		friends: [],
		bannerPhoto: "banner.jpg"
	};
	
	var OjasonTroop = {
		username: "jtr33po",
		email: "jasetr00@test.com",
		name: {first: "Jason", last: "Troop" },
		hobbies: ["outdoor", "Wine", "Videogames", "Fashion"],
		profilePicture: '/images/JasonTroop.png',
		myCollection: [],
		favorites: [],
		friends: [],
		bannerPhoto: "banner.jpg"
	};
	
	var OchrisGriffin = {
		username: 'chrischris',
		email: 'mrgriffinjr@omg.pop.org',
		name: {first: 'Chris', last: 'Griffin'},
		hobbies: ['outdoor'],
		profilePicture: '/images/ChrisGriffin.png',
		myCollection: [],
		favorites: [],
		friends: [],
		bannerPhoto: "banner.jpg"
	};
	
	var OamyTsu = {
		username: 'amytsuzoo',
		email: 'amy.tsu@gmail.com',
		name: {first: 'Amy', last: 'Tsu'},
		hobbies: ['outdoor'],
		profilePicture: '/images/hobbyist03.png',
		myCollection: [],
		favorites: [],
		friends: [],
		bannerPhoto: 'banner.jpg'
	};
	
	var OseanDeiter = {
		username: 'deiterisbeeter',
		email: 'deiterbeeter@gmail.com',
		name: {first: 'Sean', last: 'Deiter'},
		hobbies: ['outdoor'],
		profilePicture: '/images/hobbyist04.png',
		myCollection: [],
		favorites: [],
		bannerPhoto: "banner.jpg"
		
	};
	
	var OjeanMackie = {
		username: 'mackiemack',
		email: 'missmackie04@yahoo.com',
		name: {first: 'Jean', last: 'Mackie'},
		hobbies: ['outdoor'],
		profilePicture: '/images/hobbyist05.png',
		myCollection: [],
		favorites: [],
		bannerPhoto: 'banner.jpg'
	};
	
	var user2 = new Account(Ouser2)
		, user3 = new Account(Ouser3)
		, testUser = new Account(OtestUser)
		, jasonTroop = new Account(OjasonTroop)
		, chrisGriffin = new Account(OchrisGriffin)
		, amyTsu = new Account(OamyTsu)
		, seanDeiter = new Account(OseanDeiter)
		, jeanMackie = new Account(OjeanMackie);
	
	testUser.friends.push(user2._id, user3._id, jasonTroop._id);
	user2.friends.push(user3._id, testUser._id, seanDeiter._id);
	user3.friends.push(user2._id, testUser._id);
	jasonTroop.friends.push(testUser._id, chrisGriffin._id, jeanMackie._id);
	chrisGriffin.friends.push(jasonTroop._id, seanDeiter._id);
	jeanMackie.friends.push(jasonTroop._id, amyTsu._id);
	amyTsu.friends.push(jeanMackie._id, seanDeiter._id);
	seanDeiter.friends.push(amyTsu._id, user2._id, chrisGriffin._id);
	
	var Owatch_dogs = {
		name: 'Watch_Dogs',
		hobbies: ['videogames'],
		description: "All it takes is the swipe of a finger. We connect with friends. We buy the latest gadgets and gear. We find out what's happening in the world. But with that same simple swipe, we cast an increasingly expansive shadow. With each connection, we leave a digital trail that tracks our every move and milestone, our every like and dislike. And it's not just people. Today, all major cities are networked. Urban infrastructures are monitored and controlled by complex operating systems. In Watch_Dogs, this system is called the Central Operating System (CTOS) – and it controls almost every piece of the city's technology and holds key information on all of the city's residents. You play as Aiden Pearce, a brilliant hacker and former thug, whose criminal past led to a violent family tragedy. Now on the hunt for those who hurt your family, you'll be able to monitor and hack all who surround you by manipulating everything connected to the city's network. Access omnipresent security cameras, download personal information to locate a target, control traffic lights and public transportation to stop the enemy…and more. Use the city of Chicago as your ultimate weapon and exact your own style of revenge.",
		bannerPhoto: 'WatchDogs_Banner.jpg',
		tilePhoto: 'Watch_DogsTile.jpg',
		rating: 8.4,
		timestamp: new Date(),
		owner: testUser._id,
		isForSale: true,
		salePrice: 70
	};
	
	var OtombRaider = {
		name: 'Tomb Raider: Definitive Edition',
		hobbies: ['videogames'],
		description: "The cinematic action-adventure that forced Lara Croft to grow from an inexperienced young woman into a hardened survivor has been re-built for Xbox One and PS4, featuring an obsessively detailed Lara and a stunningly lifelike world. To survive her first adventure and uncover the island's deadly secret, Lara must endure high-octane combat, customize her weapons and gear, and overcome grueling environments. The Definitive Edition of the critically-acclaimed action-adventure includes digital versions of the Dark Horse comic, Brady games mini-art book and combines all of the DLC.",
		bannerPhoto: 'TombRaiderBanner.jpg',
		tilePhoto: 'TombRaiderTile.jpg',
		rating: 8.0,
		timestamp: new Date(),
		owner: user3._id
	};
	
	var OinfamousSecondSon = {
		name: 'inFAMOUS: Second Son',
		hobbies: ['videogames'],
		description: 'inFAMOUS Second Son, a PlayStation 4 exclusive, brings you an action adventure game where surrounded by a society that fears them, superhumans are ruthlessly hunted down and caged by the Department of Unified Protection. Step into a locked-down Seattle as Delsin Rowe, who has recently discovered his superhuman power and is now capable of fighting back against the oppressive DUP. Enjoy your power as you choose how you will push your awesome abilities to the limit and witness the consequences of your actions as they affect the city and people around you.',
		bannerPhoto: 'inFAMOUSSecondSonBanner.jpg',
		tilePhoto: 'inFAMOUSSecondSonTile.jpg',
		rating: 7.7,
		timestamp: new Date(),
		owner: user2._id
	};
	
	var OyellowTent = {
		name: 'Northface Backcountry Tent',
		hobbies: ['outdoor'],
		description: "Trusty tent. It's rated below freezing, and let me tell you, it works. It was amazing on our trip through Northern Washington last month.",
		bannerPhoto: 'yellowtent.png',
		tilePhoto: 'yellowtent.png',
		rating: 8.7,
		timestamp: new Date(),
		owner: chrisGriffin._id,
		isForSale: true,
		salePrice: 250,
		location: 'San Francisco, CA',
		condition: 'Like New',
		conditionDetails: 'This tent\'s only about 2 months old, and I wouldn\'t be selling it, but I had to get one rated for colder weather to prepare for my trip to Iceland.',
		tags: 'tent,northface backcountry tent,backcountry,camping gear,camping, below freezing,cold weather,durable'
		//reviews: {user: id, rating (0-10):, content: }
	};
	
	var OsleepingBag = {
		name: 'Columbia Sleeping Bag',
		hobbies: ['outdoor'],
		description: 'Excellent sleeping bag. It fits the wearer pretty tightly, and it\'s very warm. Rated to endure -8 degrees Farenheit.',
		bannerPhoto: 'sleepingbag.png',
		tilePhoto: 'sleepingbag.png',
		rating: 9.0,
		timestamp: new Date(),
		owner: jasonTroop._id,
		isForRent: true,
		rentalPrice: 35,
		location: 'San Francisco, CA',
		condition: 'New',
		conditionDetails: 'Just purchased last week. Never opened - bought originally as a gift. It\'s still in its box.',
		tags: 'columbia sleeping bag,sleeping bag,bag,camping gear,camping,below freezing,cold weather,durable'
	};
	
	var OclimbingSet = {
		name: 'Misty Rock Climbing Set',
		hobbies: ['outdoor'],
		description: 'The set is good for beginners in rock climbing. Used twice for training sessions, then replaced with a newer model. Rated with the highest safety rating.',
		bannerPhoto: 'harness.png',
		tilePhoto: 'harness.png',
		rating: 7.3,
		timestamp: new Date(),
		owner: amyTsu._id,
		isForSale: true,
		salePrice: 35,
		location: 'San Francisco, CA',
		condition: 'Lightly Used',
		conditionDetails: 'Great set. Used for training over around Nevada. Still in good shape after about 8 months of usage. Rated to last 3 years.',
		tags: 'mountain climbing,climbing,misty rock,rock,misty rock climbing set,rock climbing, climbing set, rock climbing set'
	};
	
	var Osnowboard = {
		name: 'Burton Parkstar Snowboard',
		hobbies: ['outdoor'],
		description: 'It\'s a board for amateurs, but not for beginners. It has a bit of a narrow midsection, which makes it great for speed and jumps, and the Parkstar feels snug and safe even after hours of use.',
		bannerPhoto: 'snowboard.png',
		tilePhoto: 'snowboard.png',
		rating: 8.3,
		timestamp: new Date(),
		owner: seanDeiter._id,
		isForRent: true,
		rentalPrice: 15,
		location: 'San Francisco, CA',
		condition: 'Used',
		conditionDetails: 'Strong board, still in pretty good condition, but it\'s not very pretty any more. Goes out about once a week with someone, and I\'ve not hear any complaints yet. Will refund for anyone whose experience is unsatisfactory.',
		tags: 'snowboard,burton parkstar snowboard,parkstar snowboard,snowboarding,board,boarding'
	};
	
	var OcameraCase = {
		name: 'Waterproof Camera Case',
		hobbies: ['outdoor', 'photography'],
		description: 'It does what the name says. I don\'t think it has a brand name, but it\'s never failed me, and I\'ve gone as deep as 20 meters in the Pacific to take photos. Made for very small cameras. If you\'re in the area, you may want to test before buying.',
		bannerPhoto: 'camera.png',
		tilePhoto: 'camera.png',
		rating: 3.3,
		timestamp: new Date(),
		owner: jeanMackie._id,
		isForSale: true,
		salePrice: 60,
		location: 'San Francisco, CA',
		condition: 'Like New',
		conditionDetails: 'A few scratches on the casement, and it\'s out of the box, but it\'s only been used about 3 times and never suffered any damage.',
		tags: 'camera case,case,waterproof camera case,photography,pictures,underwater photography'
	};
	
	var OinfinitySurfboard = {
		name: 'Infinity Surfboard',
		hobbies: ['outdoor'],
		description: 'The Infinity Surfboard is a pretty good board. Good for beginners - wide and stable, good for paddling and catching small waves. More advanced surfers will be frustrated by its wideness - hard to accommodate rougher waves.',
		bannerPhoto: 'surfboard.png',
		tilePhoto: 'surfboard.png',
		rating: 7.6,
		timestamp: new Date(),
		owner: seanDeiter._id,
		isForSale: true,
		salePrice: 150,
		location: 'San Francisco, CA',
		condition: 'Lightly Used',
		conditionDetails: 'Used intermittently for about two years. Still in great condition, recently waxed, well kept and clean.',
		tags: 'surfboard,surfing,infinity surfboard,beachsports,beach sports,sports'
	};

	var watch_dogs = new Item(Owatch_dogs)
		, tombRaider = new Item(OtombRaider)
		, infamousSecondSon = new Item(OinfamousSecondSon)
		, yellowTent = new Item(OyellowTent)
		, sleepingBag = new Item(OsleepingBag)
		, climbingSet = new Item(OclimbingSet)
		, snowboard = new Item(Osnowboard)
		, cameraCase = new Item(OcameraCase)
		, infinitySurfboard = new Item(OinfinitySurfboard);
	
	//FIXME: this should reference by ids
	user2.myCollection.push(infamousSecondSon);
	user3.myCollection.push(tombRaider);
	testUser.myCollection.push(watch_dogs);
	testUser.favorites.push(tombRaider);
	chrisGriffin.myCollection.push(yellowTent);
	jasonTroop.myCollection.push(sleepingBag);
	amyTsu.myCollection.push(climbingSet);
	seanDeiter.myCollection.push(snowboard);
	jeanMackie.myCollection.push(cameraCase);
	seanDeiter.myCollection.push(infinitySurfboard);

	var videogameActivity = { 
		owner: user2._id,
		timestamp: new Date(),
		tilePhoto: 'titanfallTile.jpg',
		description: 'Just pre-ordered a copy of Titanfall!'
	};
	
	var Ovideogames = {
		name: 'videogames',
		members: [user2._id, user3._id, testUser._id],
		bannerPhoto: 'videogamesBanner.jpg',
		activity: [videogameActivity]
	};
	
	var outdoorActivity = [
	{
		owner: 	jasonTroop._id,
		timestamp: new Date(),
		tilePhoto: 'lightTent.png',
		description: "Yosemite has amazing weather right now. Highly recommend climbing the hald dome to watch the sunrise! Make sure to layer up - it's still chilly at night."
	},
	{
		owner: seanDeiter._id,
		timestamp: new Date(),
		tilePhoto: 'shanghai tower.png',
		description: 'Climbers!! See this guy who climbed this 2100 feet building in Shanghai. Crazy stuff.'
	},
	{
		owner: jeanMackie._id,
		timestamp: new Date(),
		tilePhoto: 'zipline.jpg',
		description: 'Mike and I went ziplining today near walnut creek. Too much fun! Would totally do it again.' 
	}];
	
	var Ooutdoor = {
		name: 'outdoor',
		members: [user2._id, user3._id, testUser._id, jasonTroop._id, chrisGriffin._id, amyTsu._id, seanDeiter._id, jeanMackie._id],
		bannerPhoto: 'hobbypic.png',
		activity: outdoorActivity
	};
	
	Item.create([watch_dogs, tombRaider, infamousSecondSon, yellowTent, sleepingBag, climbingSet, snowboard, cameraCase, infinitySurfboard], function(err, w, t, i) {
		if(err) console.log(err);
		
		Item.find({ name: 'Watch_Dogs' }).exec().addBack(function(e, r){
			if(e) console.log(e);
			return Item.find({ name: 'Tomb Raider: Definitive Edition' }).exec();
		})
		.addBack(function(e,r) {
			if(e) console.log(e);
		})
		.then(function() {	
			Account.register(user2, 'test123', function(err) {
				if(err) console.log(err);
			});
		})
		.then(function() {
			Account.register(user3, 'test123', function(err) {	
				if(err) console.log(err);
			});
		})
		.then(function() {
			Account.register(testUser, "test123", function(err) {
				if (err) console.log(err);
			});
		})
		.then(function() {
			Account.register(jasonTroop, "test123", function(err) {
				if(err) console.log(err);
			});
		})
		.then(function() {
			Account.register(chrisGriffin, "test123", function(err) {
				if(err) console.log(err);
			});
		})
		.then(function() {
			Account.register(amyTsu, "test123", function(err) {
				if(err) console.log(err);
			});
		})
		.then(function() {
			Account.register(seanDeiter, "test123", function(err) {
				if(err) console.log(err);
			});
		})
		.then(function() {
			Account.register(jeanMackie, "test123", function(err) {
				if(err) console.log(err);
			});
		})
		.then(function(r) {
			var videogames = new Hobby(Ovideogames);
			var outdoor = new Hobby(Ooutdoor);

			videogames.save(function(err, v) {
				if(err) console.log(err);
			});
			outdoor.save(function(err,o){
				if(err) console.log(err);
			});
		});
	});
}
