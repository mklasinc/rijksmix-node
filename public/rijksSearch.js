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

/*------------------------ CUSTOM AUDIO PLAYLIST--------------------------*/
function play_custom_audio(){
  var sound_index = randomize(10);
  console.log("playing sound",sound_index);
  var streamAudio= '<audio src="' + "audio/sound" + sound_index + ".mp3" + '" preload="auto" controls autoplay loop></audio>';
  $('#audioDiv').html(streamAudio);
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
      console.log(image_data);


      if(image_data.status !== 400){
        console.log("success!");
        $('#loading_anim').hide();
        var searchImgSrc = 'url(' + image_data.image_url + ')';
        $('html').css("background", " " + searchImgSrc + " " + "no-repeat center center fixed");
        $('html').css("background-size", "cover");

        // if Soundcloud worked, you would call the soundcloud API here
        //searchSound(searchTerm);

        // fill the #work_info_container with incoming info
        $("#painting_info").html("");
        for(var prop in image_data.label){
          console.log(image_data.label[prop]);
          console.log(prop);
          console.log(prop === "title");
          console.log(image_data.label[prop].length);
          var p = '<p class="'+ prop +'">' + image_data.label[prop] + '</p>';
          $(p).appendTo('#painting_info');
          if(prop === "title" && image_data.label[prop].length > 40){
            console.log("yes!!");
            $("#painting_info > .title").css("font-size","1.5em");
          }
        }
        //show info icon
        setTimeout(function(){
          $("#work_info_container").css("display","block");
          show_container("#work_info_container",true);
        },1000);
        play_custom_audio();
      }else{
        console.log("no images");
        $('#loading_anim').hide();
        var painter_suggestion;
        if(paintersList.length > 0){
          painter_suggestion = paintersList[randomize(paintersList.length)];
        }else{
          // painter_suggestion = "Vermeer";
          painter_suggestion = "yo";
        }
  			var rijksNoImage = "Sorry, no '" + searchTerm.toUpperCase() + "' in the house. Have you tried... " + '<span style="color:rgb(5,241,255)">' + "'" + painter_suggestion + "'" + '?</span>' + ". ";
  			$('.search-results').html(rijksNoImage);
      }
		}
	});

};

function show_container($container,bool){
  console.log($container, " container is updated!");
  if(bool){
    //show
    $($container).css("opacity","1");
  }else{
    //hide
    $($container).css("opacity","0");
  }
}

//array remove element
function remove(array, element) {
    return array.filter(e => e !== element);
}

function query(){
  //saves the value of the input

  var theInputValue = $('.search-input').val();
  console.log("the value",theInputValue,"length",theInputValue.length);
  console.log(theInputValue.toLowerCase());
  if(theInputValue.length === 0){
    alert("you cannot search an empty value");
    return false;
  }else{
    can_search = false;
  }

  // check the search terms against the list of suggestion search_terms
  for(var i = 0; i < paintersList.length; i ++){
    if(!theInputValue){
      break;
      console.log("no input value!");
    }
    console.log("1",theInputValue.toLowerCase().includes(paintersList[i].toLowerCase()));
    console.log("2",paintersList[i].toLowerCase().includes(theInputValue.toLowerCase()));
    console.log(paintersList[i]);
    if(theInputValue.toLowerCase().includes(paintersList[i].toLowerCase()) || paintersList[i].toLowerCase().includes(theInputValue.toLowerCase())){
      paintersList = remove(paintersList,paintersList[i]);
      break;
    }
  };

  //show the loading animation
  // $('#loading_anim').show();
  hide_info_container();
  show_container("#work_info_container",false);
  //empty the input box
  $('.search-results').html(' ');
  $('.search-input').val('');
  $('.search-input').attr("placeholder","What other painters do you like?");
  $('.search-input').css("font-size","1.2em");
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

function hide_info_container(){
  $("#info_icon").attr("src","info.png");
  $("#info_icon").css("max-height","30px");
  $("#work_info_container").css("background-color","transparent");
  $("#painting_info").css("display","none");
  $("#painting_info").attr("data-visible","false");
}

function show_info_container(){
  $("#info_icon").attr("src","cancel_black.png");
  $("#info_icon").css("max-height","20px");
  $("#work_info_container").css("background-color","white");
  $("#painting_info").css("display","block");
  $("#painting_info").attr("data-visible","true");
}

var search_terms;
var paintersList = ["Vermeer","Van Gogh","Rembrandt","Steen","Dürer","Cuyp","Goya","Munch"];

$(document).ready(function(){
  search_terms = [ ];

  $("#painting_info").attr("data-visible","false");

  $("#info_icon").click(function(e){
    var info_bool = $("#painting_info").attr("data-visible") === "false" ? false : true;
    if(!info_bool){
      show_info_container();
    }else{
      hide_info_container();
    }
  });

  $(document).keypress(function(e) {
    console.log("we are ready!");
    if(e.which == 13) {
        if(can_search){
          query();
        }

    };
  });

	$('.confirm-button').click( function(){
    console.log("yuppi!");
    if(can_search){
      query();
    }

	});

});
