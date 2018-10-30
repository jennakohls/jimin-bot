// Our Twitter library
var Twit = require('twit');

// We need to include our configuration file
var T = new Twit(require('./config.js'));


var jimin = {
	q: "jimin",
	count: 10,
	result_type: "recent"
	// lang: 'en OR ko OR und'};

var follow = require("./follow.js");

function retweetLatest() {
	T.get('search/tweets', jimin, function (error, data) {
	  // log out any errors and responses
	  //console.log(error, data);
	  // If our search request to the server had no errors and the tweet we've pulled has at least one retweet...
	  if (!error && (data.statuses[0].retweet_count > 9)) {
	  	// ...then we grab the ID of the tweet we want to retweet...
		var retweetId = data.statuses[0].id_str;
		// ...and then we tell Twitter we want to retweet it!
		T.post('statuses/retweet/' + retweetId, { }, function (error, response) {
			if (response) {
				console.log('Success! Check your bot, it should have retweeted something.')
			}
			// If there was an error with our Twitter call, we print it out here.
			if (error) {
				console.log('There was an error with Twitter:', error);
			}
		})
	  }
	  // However, if our original search request had an error, we want to print it out here.
	  else {
	  	console.log('There was an error with your hashtag search:', error);
	  }
	});
}

//follow.a();
// Try to retweet something as soon as we run the program...
retweetLatest();
console.log('\n');
// ...and then every hour after that. Time here is in milliseconds, so
// 1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 60 = 1 hour --> 1000 * 60 * 60
setInterval(retweetLatest, 1000 * 60);
setInterval(follow.a, 1000 * 60 * 20);
