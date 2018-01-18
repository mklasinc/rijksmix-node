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
			var response_to_client = {};
			//console.log(data.artObject.webImage.url);
			//response_to_client.success = data.artObject.webImage.url || false;
			var found_image = false;
			var num_of_tries = 0;
			var theData = JSON.parse(body);
			var paintings = theData.artObjects.length > 0 ? theData.artObjects : undefined;
			if(paintings){
				//successful search
				//find a painting that has an image
				//console.log(paintings);
				while(!found_image && num_of_tries < 10){
					if(num_of_tries > 7 || num_of_tries === paintings.length){
						console.log("we don't have this painting in our collection!");
						response_to_client.status = 400;
						query_response.json(JSON.stringify(response_to_client));
						break;
					}
					var randomize = Math.floor(Math.random()*paintings.length);
					var random_painting = paintings[randomize];
					var	painting_num = random_painting.objectNumber;
					if(random_painting.hasImage){
						console.log('we are going to make another request!');
						found_image = true;
						second_rijks_request(painting_num,query_response,searchURL);
					}else{
						console.log("there is no image!");
						num_of_tries++;
						response_to_client.status = 400;
					}
				};
			}else{
				//unsuccessful search
				console.log("we don't have this painting in our collection!");
				response_to_client.status = 400;
				query_response.json(JSON.stringify(response_to_client));
			}



			//console.log(random_painting);
			//console.log(artObjectLength);
			//send all the data

		}
	});

}

function second_rijks_request(obj_num, query_response,searchURL){

	var rijksURL = 'https://www.rijksmuseum.nl/api/en/collection/' + obj_num + '?format=json&key=fpGQTuED';
	console.log(rijksURL);
	//?key=66NWd8CY&format=json&q=';
	//collection/SK-A-4691?format=jsonp&key=fpGQTuED

	Request(rijksURL, function (err, res, body) {
		if (!err && res.statusCode == 200) {
			//get body
			var data = JSON.parse(body);
			//console.log(data);

			var response_to_client = {};
			if(data.artObject.webImage === null){
				first_rijks_request(searchURL,query_response);
			}else{
				response_to_client.label = {};
				response_to_client.status = 200;
				response_to_client.image_url = data.artObject.webImage.url;

				if(data.artObject.label.title === null){
					response_to_client.label.title = data.artObject.titles[0];
					response_to_client.label.author = data.artObject.scLabelLine;
				}else{
					response_to_client.label.title = data.artObject.label.title;
					response_to_client.label.author = data.artObject.label.makerLine;
					// response_to_client.label.description = data.artObject.label.description;
				}

				console.log(response_to_client);
				query_response.json(JSON.stringify(response_to_client));

				//solicit art piece data
				console.log(data);

			}

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
	console.log("we got a request at soundcloud!");
	var soundcloudTerm = request.params.word;
	var soundcloudAPI = 'https://api.soundcloud.com/search/sounds?q=';
  	var myClientID = 'client_id=5f22b41ab6746f68eb906570aef0cfd9';
  	var soundcloudSearchURL = soundcloudAPI + soundcloudTerm + '&' + myClientID;
		console.log(soundcloudSearchURL);
  	Request(soundcloudSearchURL, function (err, res, body) {
			if(err){
				console.log(err);
			}
		if (!err && res.statusCode == 200) {
			///console.log(body);
			console.log("yuppi!");
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
console.log('Express started on port ' + port);
