var a = function a() {
  var Twitter = require('twit');
  var config = require('./config.js');
  var T = new Twitter(config);

  var params = {
    q: '(bts follow back) OR (bts gain mutual) -pakistan',
    count: 10,
    result_type: 'recent',
    lang: 'en OR ko OR es -ar'
  }

  T.get('search/tweets', params, function(err, data, response) {
    if(!err){
      for(let i = 0; i < data.statuses.length; i++){
        let screen_name = data.statuses[i].user.screen_name;
        T.post('friendships/create', {screen_name}, function(err, response){
          if(err){
            console.log(err);
          } else {
            console.log(screen_name, ': FOLLOWED');
          }
        });
      }
    } else {
      console.log(err);
    }
  })
};

module.exports.a = a;