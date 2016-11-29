var twit = require('twitter'),
	twitter = new twit({
		consumer_key: '',
		consumer_secret: '',
		access_token_key: '',
		access_token_secret: ''
	}),  // get a key b!
	bigInt = require('big-integer'),
	Follower = require('../models/follower'),
	Friend = require('../models/friend'),
	Status = require('../models/status');


var exports = module.exports = {};

exports.myFollowers = {}
exports.myFriends = {}
exports.myStatuses = {}
exports.newFollower;
exports.newFriend;
exports.followerCount = 0;
exports.friendCount = 0;
exports.statusCount = 0;
exports.statuses = {}

exports.printCount = (incount)=>{console.log("Count: " + incount);}
exports.printFollower = (followers)=>{
  	for (user in exports.followers.users) {
		console.log("@"+followers.users[user].screen_name + " id:" + followers.users[user].id);
		myFollowers[followers.users[user].id] = followers.users[user].screen_name;
		newFollower = new Follower({
			id: followers.users[user].id,
			screen_name: followers.users[user].screen_name
		});
		newFollower.save((err,user)=> {
			if(err) {
				console.log("There was an error saving the user. ");
			}
			else{
				console.log(user.screen_name + " saved");
			}
		});
		followerCount++;
		
	}
}
exports.printFriend = (friends)=>{
  	for (user in exports.friends.users) {
		console.log("@"+exports.friends.users[user].screen_name + " id:" + exports.friends.users[user].id);
		//exports.myFollowers[friends.users[user].id] = friends.users[user].screen_name;
		newFriend = new Friend({
			id: friends.users[user].id,
			screen_name: friends.users[user].screen_name
		});
		newFriend.save((err,user)=> {
			if(err) {
				console.log("There was an error saving the user. ");
			}
			else{
				console.log(user.screen_name + " saved");
			}
		});
		exports.friendCount++;
	}
}
exports.printStatus = (status)=>{
	console.log("Status ID: " + status.id_str + " " + status.user.screen_name + " tweeted \n" + status.text);
	console.log("Location : " + status.user.location + "  Time: " + status.created_at);
	console.log()
	mystatus = new Status({
	  			id_str : status.id_str,
	  			text : status.text,
	  			user : {
	  				id_str: status.user.id_str,
	  				screen_name: status.user.screen_name,
	  				location: status.user.location,
	  				created_at: status.user.created_at
	  			},
	  			created_at: status.created_at,
	  			last_updated : status.last_updated
	  		});
	mystatus.save((err,status)=> {
	  			if (!err) {
	  				console.log("status object saved");
	  			}
	  			else {
	  				console.log(err);
	  				console.log("error saving status obejct");
	  			}
	  		});  //for mongo
	exports.statusCount++;
};



exports.getFollowers = (params)=> {
	twitter.get('followers/list', params, function(error, followers, response) {
	  console.log(response.caseless);
	  if (!error) {
	  	printFollower(followers);
	  	if(followers.next_cursor !=0) {
	  		params.cursor = followers.next_cursor;
	  		setTimeout(getFollowers(), 250);  //dont spam the api!	
	  	}
	  	else {
	  		printCount(followerCount);
	  	}
	  }
	  else{
	  	console.log(error);
	  	console.log(response.caseless);
	  	printCount(followerCount);
	  }});
	
}

exports.getFriends = (params)=> {
	twitter.get('friends/list', params, function(error, friends, response) {
	  console.log(response.caseless);
	  if (!error) {
	  	printFriend(friends);
	  	if(friends.next_cursor !=0) {
	  		params.cursor = friends.next_cursor;
	  		setTimeout(getFriends(params), 250);  //dont spam the api!	
	  	}
	  	else {
	  		printCount(friendCount);
	  	}
	  }
	  else{
	  	console.log(error);
	  	console.log(response.caseless);
	  	printCount(friendCount);
	  }});
	
}


exports.getStatuses = (params)=> {
	params.count = 200;
	var loc_count = 0;

		//the first run
		twitter.get('statuses/user_timeline', params, function(error, statuses, response) {
		  console.log();
		  if (Object.keys(statuses).length  == 0) {
		  	console.log("No more statuses to scrape.");
		  	return
		  }
		  if (!error && Object.keys(statuses).length > 0) {
		  	//printStatus(statuses);

		  	for(status in statuses) {
		  		exports.printStatus(statuses[status]);
		  		loc_count++;
		  	}
		  	params.max_id = bigInt(statuses[loc_count-1].id_str).subtract(1).toString();

		  	exports.printCount(loc_count);
		  	console.log("Total:" + exports.statusCount);
		  	//GET MOAR STATUSES
		  	setTimeout(exports.getStatuses(params),5000);
		  }
		  else{
		  	//ERR
		  	//catch and handle errors
		  	try  {
		  		if(error.code == 130){
			  		console.log("Over capacity, waiting to continue...");
			  		setTimeout(exports.getStatuses(params),5000);
			  		}
		  	}
		  	catch (err) {
		  		//end of statuses err!
		  		console.log(err);
		  		//do nothing
		  	}
		  }

		});
		return 
	}
exports.getStatusById = (id) => {
	var params = {}
	params.id = id;
	twitter.get('statuses/show/', params, function(error, tweet, response) {
		console.log("@"+tweet.user.screen_name + "Status Id:" + tweet.id);
		console.log(tweet.text);
	});
}
exports.postTweet = (intweet) => {
	twitter.post('statuses/update', {status: intweet},  function(error, tweet, response) {
		if(error) throw error;
		console.log(tweet);  // Tweet body. 
	  	console.log(response);  // Raw response object. 
		});
}
