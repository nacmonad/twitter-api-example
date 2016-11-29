var helperEx = () => {
	 return {
	 	msg:"hello",
	 	printDb: (db)=> {console.log(db);},
	 	run: (callback) => {
	 		console.log("doingsomething, then running callback");
	 		callback((third)=> {
	 			console.log("second callback for your callback soup!");
	 			third((fifth)=> {
	 				console.log("holy fourth for ya");
	 				fifth();
	 			});
	 		});
	 	}
	 }
	}
	
module.exports = helperEx;