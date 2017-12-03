//Set up requirements
var express = require("express");
var logger = require('morgan');
var Request = require('request');
//Create an 'express' object
var app = express();
//log requests to the terminal console
app.use(logger('dev'));
//Set up the views directory
app.set("views", __dirname + '/views');
//Set EJS as templating language WITH html as an extension
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
//Add connection to the public folder for css & js files
app.use(express.static(__dirname + '/public'));

/*-------------ROUTES---------------------*/
//index
app.get("/", function(request, response){
	response.render('index');
});
//blog
app.get("/blogPost", function(request, response) {
	response.render('blog-post');
});

function first_rijks_request(searchURL,query_response){
	//send an HTTP request
	Request(searchURL, function (err, res, body) {
		if (!err && res.statusCode == 200) {
			//get body
			var theData = JSON.parse(body);
			var paintings = theData.artObjects;
			var randomize = Math.floor(Math.random()*paintings.length);
			var random_painting = paintings[randomize];
			var	painting_num = random_painting.objectNumber;
			//console.log(painting_num);
			if(random_painting.hasImage){
				console.log('we are going to make another request!');
				second_rijks_request(painting_num,query_response);
			}
			//console.log(random_painting);
			//console.log(artObjectLength);
			//send all the data

		}
	});

}

function second_rijks_request(obj_num, query_response){

	var rijksURL = 'https://www.rijksmuseum.nl/api/en/collection/' + obj_num + '?format=json&key=fpGQTuED';
	console.log(rijksURL);
	//?key=66NWd8CY&format=json&q=';
	//collection/SK-A-4691?format=jsonp&key=fpGQTuED

	Request(rijksURL, function (err, res, body) {
		if (!err && res.statusCode == 200) {
			//get body
			var data = JSON.parse(body);
			var response_to_client = {};
			//console.log(data.artObject.webImage.url);
			//response_to_client.success = data.artObject.webImage.url || false;
			response_to_client.image_url = data.artObject.webImage.url;
			console.log(response_to_client);

			query_response.json(JSON.stringify(response_to_client));
			// var paintings = theData.artObjects;
			// var randomize = Math.floor(Math.random()*paintings.length);
			// var random_painting = paintings[randomize];
			// var	painting_num = random_painting.objectNumber;
			// console.log(painting_num);
			// if(random_painting.hasImage){
			// 	console.log('we are going to make another request!');
			// 	second_rijks_request(painting_num,query_response);
			// }
			//console.log(random_painting);
			//console.log(artObjectLength);
			//send all the data

		}
	});


}
//rijksmuseum object
app.get("/rijks/:word", function(request, response) {
	//get the search word, turn it into a Rijksmuseum API query
	var rijksTerm = request.params.word;
	var rijksAPI = 'https://www.rijksmuseum.nl/api/en/collection?key=66NWd8CY&format=json&q=';
	var rijksSearchURL = rijksAPI + rijksTerm;

	first_rijks_request(rijksSearchURL,response);
	//response.json(theData);

});
//soundcloud query
app.get("/soundcloud/:word", function(request, response) {
	//console.log("we got a request at soundcloud!");
	var soundcloudTerm = request.params.word;
	var soundcloudAPI = 'https://api.soundcloud.com/search/sounds?q=';
  	var myClientID = 'client_id=5f22b41ab6746f68eb906570aef0cfd9';
  	var soundcloudSearchURL = soundcloudAPI + soundcloudTerm + '&' + myClientID;

  	Request(soundcloudSearchURL, function (err, res, body) {
		if (!err && res.statusCode == 200) {
			///console.log(body);
			var theData = JSON.parse(body);
			response.json(theData);
		}
	});

});
//catch all
app.get("*", function(req, res){
	res.send('Sorry, nothing doing here.');
});


// Start the server
var port = process.env.PORT || 3000;
app.listen(port);
//console.log('Express started on port ' + port);
