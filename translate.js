var b = function b() {
    var Twit = require('twit');

    const translate = require('google-translate-api');

    var base64Img = require('base64-img');

    var twtTxt;

    var T = new Twit(require('./config.js'));

    var ttFilters = [" rt", "retweet", "ao3", "giveaway", "give away", "yoonmin", "au"];

    var photoSearch = {
        q: "jimin AND filter:twimg AND",
        count: 2,
        result_type: "recent",
        lang: "en",
        include_entities: true
    };

    var photos = "";


    var count;

    var textToTranslate;

    var sucess = false;

    T.get('search/tweets', photoSearch, function(error, data) {
        let tweet = data.statuses[0];
        //console.log('http://www.twitter.com/username/statuses/' + tweet.id_str);
        if(filterTT(tweet)){
            //console.log(error,data);
            //console.log(tweet);
            if (("retweeted_status" in tweet)) { //tweet is an rt
                if(tweet.retweeted_status.truncated){
                    //console.log('rt is truncated');
                    if("extended_tweet" in tweet.retweeted_status){
                        tweet = data.statuses[0].retweeted_status.extended_tweet;
                        textToTranslate = tweet.full_text;
                    } else console.log('rt ET field not found :(');
                    //console.log(tweet);
                } else{
                    tweet = data.statuses[0].retweeted_status;
                    textToTranslate = tweet.text;
                }
                if("extended_entities" in tweet){ //rt has EE
                    for(let i = 0; i < Object.keys(tweet.extended_entities.media).length; i++){
                        //console.log('rt ee:', tweet.extended_entities.media);
                        let twtImg = tweet.extended_entities.media[i].media_url;
                        //console.log(twtImg);
                        photos = photos + twtImg + ',';
                    }
                    success = true;
                }
                else { //twt is a rt but for some reason does not have an EE
                    console.log('tweet is a retweet but does not have EE');
                    success = false;
                }

            } else { //tweet is not a retweet
                if(tweet.truncated){
                    tweet = data.statuses[0].extended_tweet;
                    textToTranslate = tweet.full_text;
                    //console.log('found extended tweet');
                } else{
                    textToTranslate = tweet.text;
                }
                if("extended_entities" in tweet){ //normal tweet has EE
                    for(let i = 0; i < Object.keys(tweet.extended_entities.media).length; i++){
                        let twtImg = tweet.extended_entities.media[i].media_url;
                        //console.log(twtImg);
                        photos = photos + twtImg + ',';
                    }
                    success = true;
                } else { //normal tweet has no ee
                    console.log('twt is normal but does not have EE');
                    success = false;
                }


            }
            if(success){
                photos = photos.substring(0, photos.length - 1);
                //console.log(Object.keys(tweet.extended_entities.media).length);
                //console.log(photos);

                //translate the tweet
                translate(textToTranslate, {from: 'en', to: 'ko'}).then(res => {
                    twtTxt = res.text;
                    //console.log(twtTxt);
                    // console.log(res.from.language.iso);
                    // only do this if we succesfully translated! asynchronous calls are wild
                    var translatedTwt = {
                        status: twtTxt + ' @bts_twt',
                    };
                    T.post('statuses/update',translatedTwt, function(error, response){
                    if(response){
                        console.log('hooray you tweeted:',twtTxt);
                    }
                    if(error) {
                        console.log('twitter says:',error);
                    }
                });
                }).catch(err => {
                    console.error(err);
                });

            }
        }
    });

    function filterTT(twt){
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
            for(let i = 0; i < ttFilters.length; i++){
                if(content.toLowerCase().includes(ttFilters[i])){
                    console.log('tweet was filtered out for:', ttFilters[i]);
                    return false;
                }
            }
        return true;
    }
};
module.exports.b = b;