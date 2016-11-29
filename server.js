var express = require('express'),
app = express(),
mongoose = require('mongoose'),
twithelper = require('./helpers/twitter-routines.js'),
helperEx = require('./helpers/helper-ex.js');

var combetta_id = 135215574;
var params = {screen_name:'@AndrewBreitbart'};


try{
	//connect to db
	var connectionUrl = 'mongodb://localhost:27017/'+params.screen_name.replace('@','');
	var db = mongoose.connect(connectionUrl);
	//twithelper.getFriends();
	//twithelper.getFollowers();

	params.count = 200;
	twithelper.getStatuses(params);

}
catch(e) {
	console.log(e);
}


//get by id
	//old podesta the molesta tweet
	//twithelper.getStatusById("162560578487984128");

//twithelper.printStatuses();

//twithelper.postTweet("From NodeJS server: Hello world");

//ROUTES FOR PRIVATE API
/*
app.get('/api/followers', (req,res)=>{
	//console.log(myFollowers);
	res.json(myFollowers);
	});

app.listen('8080', function() {
	console.log("listening on port 8080");
});
*/