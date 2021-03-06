/*
* jimin bot
* build 67
*
*/
var Twit = require('twit');

var T = new Twit(require('./config.js'));

var translate = require("./translate.js");

var num = 1;

var jimin = {
	q: "jimin",
	count: num,
	result_type: "recent",
	lang: "en OR ko OR und"
	};

var filters = [" rt", "retweet", "ao3", "giveaway", "give away", "yoonmin"];

var follow = require("./follow.js");

function retweetLatest() {
	T.get('search/tweets', jimin, function (error, data) {
	 let success = false;
//	while(!success){
		for(let i = 0; i < num; i++){
			//while(!success){
			  if (!error) {
			  	if(filter(data.statuses[i])) {
			  	// ...then we grab the ID of the tweet we want to retweet...
					let retweetId = data.statuses[i].id_str;
					// ...and then we tell Twitter we want to retweet it!
					T.post('statuses/retweet/' + retweetId, { }, function (error, response) {
						if (response) {
							console.log('Success! Check your bot, it should have retweeted something.')
							return false;
						}
						// If there was an error with our Twitter call, we print it out here.
						if (error) {
							console.log('There was an error with Twitter:', error);
						}
					})
				}
			  }
			  // However, if our original search request had an error, we want to print it out here.
			  else {
			  	console.log('There was an error with your hashtag search:', error);
			  }
			}
		}
	);
}

function filter(twt){
	if(typeof twt == 'undefined'){
		console.log('twt is undefined.');
		return false;
	}
	else if(twt.retweet_count < 10){
			console.log('tweet was filtered out for having',twt.retweet_count,'rts');
			return false;
	}

	var content;
		if(twt.truncated){
			content = twt.extended_tweet.full_text;
		} else{
			content = twt.text;
		}
		for(let i = 0; i < filters.length; i++){
			if(content.toLowerCase().includes(filters[i])){
				console.log('tweet was filtered out for:', filters[i]);
				return false;
			}
		}
	return true;
}
follow.a();
translate.b();
// Try to retweet something as soon as we run the program...
retweetLatest();
console.log('\n');
// ...and then every hour after that. Time here is in milliseconds, so
// 1000 ms = 1 second, 1 sec * 60 = 1 min, 1 min * 60 = 1 hour --> 1000 * 60 * 60
setInterval(retweetLatest, 1000 * 60 * 2);
setInterval(follow.a, 1000 * 60 * 10);
setInterval(translate.b, 1000 * 60);
