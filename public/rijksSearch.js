/*------------------------ SOUNDCLOUD API--------------------------*/
function searchSound(searchTerm){
	//clientID will be used later
  var myClientID = 'client_id=5f22b41ab6746f68eb906570aef0cfd9';

  $.ajax({
    url: '/soundcloud/' + searchTerm,
    type: 'GET',
    dataType: 'json',
    error: function(data){
      //console.log("We got problems with Soundcloud.");
      //console.log(data);
    },
    success: function(data){
      //console.log("Soundcloud is working just fine");
      //console.log(data);

      //randomize the track
      var randomizeTrack = Math.floor(Math.random()*10);
      //check if the song is streamable - some are not
      var streamability = data.collection[randomizeTrack].streamable;
      //the url is incomplete without the clientID
      var soundcloudstreamURL = data.collection[randomizeTrack].stream_url + '?' + myClientID;
      var streamAudio = '<audio src="' + soundcloudstreamURL + '" preload="auto" controls autoplay loop></audio>';
      //check if the random song is streamable
      if(streamability == true) {
        $('#audioDiv').html(streamAudio);
      }
      //if not, loop through the first 10 hits to see if any of the tracks is streamable
      else{
 		for (var i = 0; i < 10; i++) {
			var loopSoundStreamable = data.collection[i].streamable;
			if(loopSoundStreamable == true){
				var loopFullURL = data.collection[i].stream_url + '?' + myClientID;
				var streamLoopAudio = '<audio src="' + loopFullURL + '" preload="auto" controls autoplay loop></audio>';
				$('#audioDiv').html(streamAudio);
				break;
			}
			//if we cannot get any music
        	$('.search-results').html('<p> Are you looking for Skrillex? </p>');
        }
      };
    }
  });

};

/*------------------------ RIJKSMUSEUM API--------------------------*/
function searchRijks(searchTerm){
	$('.search-results').html("Cool, let's see what we can do for you");

	$.ajax({
		url: '/rijks/' + searchTerm,
		type: 'GET',
		dataType: 'json',
		error: function(data){
			//console.log("We got problems.");
			//console.log(data);
		},
		success: function(data){
			//console.log("YEESSSS");
      $('.search-results').html(' ');
			var image_data = JSON.parse(data);
      if(!image_data.image_url){
        console.log("error response");
      }else{
        var searchImgSrc = 'url(' + image_data.image_url + ')';
        $('html').css("background", " " + searchImgSrc + " " + "no-repeat center center fixed");
        $('html').css("background-size", "cover");
        searchSound(searchTerm);
      }

      //call soundcloud

      //console.log(data.artObject);

			//empty the .search-results div
			//$('.search-results').html(' ');
			//when data comes in, array.artObjects[0] is the object containing info about the artwork
			//console.log(data.artObjects);
			//var artObjectLength = data.artObjects.length;
			// check if there is any data in the object
			/*if(artObjectLength == 0){
				//have a list of painters prepared in case the search query doesn't yield any results
				var paintersList = ["Rembrandt","Vermeer","Steen","Van Gogh","Dürer","Cuyp"];
				var randomPainter = Math.floor(Math.random() * 5);
				var rijksNoData = "Hmm... we didn't find anything. Perhaps you meant... " + '<span style="color:rgb(5,241,255)">' + "'" + paintersList[randomPainter] + "'" + '</span>' + "? ";
				$('.search-results').html(rijksNoData);
				$('#audioDiv').html('');
			}
			else{
				//randomize the painting choice
				var randomizePaint = Math.floor(Math.random()*artObjectLength);
				console.log(randomizePaint);
				//check it the chosen object has an image
				var searchHasImage = data.artObjects[randomizePaint].hasImage;
        var searchHasImageUrl = data.artObjects[randomizePaint].showImage;

				if(!searchHasImage || !searchHasImageUrl){
					//console.log("The first shot was blind");
					//search through the array until you find an image
					for (var i = 0; i < artObjectLength; i++) {
						var searchLoopImage = data.artObjects[i].hasImage;
            var image_url_exists = data.artObjects[i].showImage;
						//console.log("I don't have the image " + i);
						if(searchLoopImage && image_url_exists){
							//console.log("I found it! It's the " + i + " iteration!");
							var LoopImgUrl = data.artObjects[i].webImage.url;
							var LoopImgSrc = 'url(' + LoopImgUrl + ')';
							$('html').css("background", " " + LoopImgSrc + " " + "no-repeat center center fixed");
							$('html').css("background-size", "cover");
							searchSound(searchTerm);
							break;
						}
						// what if you're unable to find an image?
						var rijksNoImage = "Sorry, no '" + searchTerm.toUpperCase() + "' in the house. Try... " + '<span style="color:rgb(5,241,255)">' + "'" + paintersList[randomPainter] + "'" + '</span>' + ". ";
						$('.search-results').html(rijksNoImage);
						$('#audioDiv').html('');
					}
				}
				else{
          console.log(data.artObjects[randomizePaint]);

					var searchImgSrc = 'url(' + searchImgUrl + ')';
					$('html').css("background", " " + searchImgSrc + " " + "no-repeat center center fixed");
					$('html').css("background-size", "cover");
					//call soundcloud
					searchSound(searchTerm);
				}
			}*/
		}
	});

};


$(document).ready(function(){

	$('.confirm-button').click( function(){
	//saves the value of the input
	var theInputValue = $('.search-input').val();
	//empty the input box
	$('.search-results').html(' ');
	$('.search-input').val('');
	$('.search-input').attr("placeholder","What other painters do you like?");
	$('.search-input').focus();
	$('#instructions').hide();

	//css styling after first click
	$('.title').addClass('title-after');
	$('.searchBar').addClass('searchBar-after').children().addClass('inline-block');
	$('button').css("margin", "0");
	$('.confirm-button').addClass('confirm-button-after');
	$('.search-input').addClass('search-input-after');
	$('.blog-button').addClass('blog-button-after');
	$('.search-results').addClass('search-results-after');
	$('.confirm-container').addClass('confirm-container-after');

	//first get music from rijksmix!
	searchRijks(theInputValue);
	});

});
