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
//rijksmuseum query
app.get("/rijks/:word", function(request, response) {
	//get the search word, turn it into a Rijksmuseum API query
	var rijksTerm = request.params.word;
	var rijksAPI = 'https://www.rijksmuseum.nl/api/en/collection?key=TTSdoH9j&format=json&q=';
	var rijksSearchURL = rijksAPI + rijksTerm;
	//send an HTTP request
	Request(rijksSearchURL, function (err, res, body) {
		if (!err && res.statusCode == 200) {
			//get body
			var theData = JSON.parse(body);
			//send all the data
			response.json(theData);
		}
	});
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