var can_search = true;

/*------------------------ SOUNDCLOUD API--------------------------*/
function searchSound(searchTerm){
	//clientID will be used later
  var myClientID = 'client_id=5f22b41ab6746f68eb906570aef0cfd9';

  $.ajax({
    url: '/soundcloud/' + searchTerm,
    type: 'GET',
    dataType: 'json',
    error: function(data){
      console.log("We got problems with Soundcloud.");
      console.log(data);
    },
    success: function(data){
      console.log("Soundcloud is working just fine");
      console.log(data);

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

function randomize(length){
  var index = Math.floor(Math.random()*length);
  return index;
}

var dot_animation;

function animate_dots(){
  var $dots = $(".dots");
  var dot_counter = 0;
  dot_animation = setInterval(function(){
    if(dot_counter < 4){
      $dots.append('.');

    }else{
      $dots.html('');
      dot_counter = 0;
      //animation.clearInterval();
    }
    dot_counter++;
  },500);
}

/*------------------------ RIJKSMUSEUM API--------------------------*/
function searchRijks(searchTerm){
	$('.search-results').html("Cool, let's see what we can do for you <span class=\"dots\"></span>");
  animate_dots();

	$.ajax({
		url: '/rijks/' + searchTerm,
		type: 'GET',
		dataType: 'json',
		error: function(data){
			console.log("We got problems.");
			console.log(data);
		},
		success: function(data){
      can_search = true;
      window.clearTimeout( dot_animation );
      $('.search-results').html(' ');
			var image_data = JSON.parse(data);
      console.log(image_data.status);
      if(image_data.status !== 400){
        console.log("success!");
        $('#loading_anim').hide();
        var searchImgSrc = 'url(' + image_data.image_url + ')';
        $('html').css("background", " " + searchImgSrc + " " + "no-repeat center center fixed");
        $('html').css("background-size", "cover");
        //searchSound(searchTerm);
      }else{
        console.log("no images");
        $('#loading_anim').hide();
        var paintersList = ["Rembrandt","Vermeer","Steen","Van Gogh","Dürer","Cuyp","Durer","Goya","Munch"];
        var random_index = randomize(paintersList.length);
  			var rijksNoImage = "Sorry, no '" + searchTerm.toUpperCase() + "' in the house. Have you tried... " + '<span style="color:rgb(5,241,255)">' + "'" + paintersList[random_index] + "'" + '?</span>' + ". ";
  			$('.search-results').html(rijksNoImage);
      }
		}
	});

};

function query(){
  //saves the value of the input

  var theInputValue = $('.search-input').val();
  console.log("the value",theInputValue,"length",theInputValue.length);
  if(theInputValue.length === 0){
    alert("you cannot search an empty value");
    return false;
  }else{
    can_search = false;
  }
  //show the loading animation
  // $('#loading_anim').show();

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
}



$(document).ready(function(){

  $(document).keypress(function(e) {
    if(e.which == 13) {
        if(can_search){
          query();
        }

    };
  });

	$('.confirm-button').click( function(){
    if(can_search){
      query();
    }

	});

});
