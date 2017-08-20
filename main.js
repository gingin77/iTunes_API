let searchInputEl = document.getElementById("search_field");
let buttonEl = document.getElementById("search_now");

let url = "";
let currentSongURLPlaying = [];
let currentSongPlaying = [];
let songURLsToPlay = [];
let listOfPickedSongs = [];

let results_container = document.getElementById("results_container");
// let resultsArray = [];

buttonEl.addEventListener('click', function(e) {
  let search_termVal = searchInputEl.value;

  if (search_termVal) {
    // alert("Hang on a sec.....");
    searchInputEl.value = "";
  }
  console.log(search_termVal);
  url = ("https://itunes.apple.com/search?term="+search_termVal);
  console.log(url);
  fetchGET(url);
});

function fetchGET() {
  fetch(url)
    .then(function(response) {
      if (response.status !== 200) {
        console.log(response.status);
        return;
      }
      response.json().then(function(data){
        console.log("define query return variables", response.url);
        console.log(data.results);

        let markup = "";
        let abrv = data.results;

        for (let i=0; i<data.results.length; i++){
          let cover_art = abrv[i].artworkUrl100
          let artist = abrv[i].artistName
          let album = abrv[i].collectionName
          let audio = abrv[i].previewUrl
          let song_title = abrv[i].trackName
          let genre = abrv[i].primaryGenreName

          let song_result_hits = `
          <div class="item" url="${audio}" value='${artist}, "${song_title}"'>
            <img src="${cover_art}" url="${audio}" value='${artist}, "${song_title}"'/>
            <h4 url="${audio}" value='${artist}, "${song_title}"'>${song_title}</h4>
            <h3 url="${audio}" value='${artist}, "${song_title}"'>${artist}</h3>
          </div>`

          markup += song_result_hits
        }
        // console.log(markup);
        results_container.innerHTML = markup;

        let item_divs = document.getElementsByClassName("item");

        for (let j=0; j<item_divs.length; j++){
            item_divs[j].addEventListener('click', moveSelSongURLToPlayer, true);
          }
      })
  })
  .catch(function(err) {
    console.log("Fetch Error :-S", err);
  })
}

function moveSelSongURLToPlayer(){ /*hmm I'm thinking I need to split up the play functionality from the move to player function...*/
  console.log("A song has been selected");
  let eventTarget=event.target;
  console.log(eventTarget);

  let urlForSelectedSong=eventTarget.getAttribute("url");/* << url for the song we want to play*/
  songURLsToPlay.push(urlForSelectedSong);/*pass to subsequent functions*/
  console.log(songURLsToPlay.length);

  let songInfo=eventTarget.getAttribute("value");
  console.log(songInfo);
  listOfPickedSongs.push(songInfo);
  console.log((listOfPickedSongs.length), (listOfPickedSongs));

  holdAndPlayOrHold(songURLsToPlay, listOfPickedSongs);
}
// If first song selected, then play song and disply title.
// If 2nd song selected, dispaly song and wait for 1st song to end. Can I get this to work?
// still need to hit ply though...
// Also, it would be nice to show the song title, as well as a list of other selected songs

function holdAndPlayOrHold(){ /*this function triggers the first picked song to play AND coordinates storage of Songs*/
  audioPlayerEl = document.getElementById('song_player');

  if (songURLsToPlay.length === 1){

    audioPlayerEl.src = songURLsToPlay[0];
    audioPlayerEl.play(); /* <<< Song is played here */

    currentSongURLPlaying.push(songURLsToPlay);
    currentSongPlaying.push(listOfPickedSongs);/* <<< Push song URL and info to respective apt CurrentSong arrays is played here */

    console.log("The song currently playing is "+ currentSongPlaying[0]);
  }
  else if (songURLsToPlay.length > 1) {
    storeSongs(songURLsToPlay, listOfPickedSongs);
    console.log("another song was picked")
  }
}

function nextSongQ(){ /*this is where I need to figure out how to set up the sequence....*/
  console.log("a song has ended!");
  if (listOfPickedSongs.length === 1){
    console.log("There are no new song snippets to play");
  } else if (listOfPickedSongs.length >= 2) {
    audioPlayerEl.src = songURLsToPlay[1];
    setTimeout (function(){
    audioPlayerEl.play();
    }, 2000);
  } else if (listOfPickedSongs.length === 3) {
    audioPlayerEl.src = songURLsToPlay[3];
    setTimeout (function(){
    audioPlayerEl.play();
    }, 2000);
  }
}

let lastSongPlayed = currentSongURLPlaying.shift;

function storeSongs(){/*when writing this function, imagine a 2nd song being picekd. listOfPickedSongs.length and songURLsToPlay.length will both now be 2; listOfPickedSongs holds the song info; songURLsToPlay holds the url. I don't need to know mostRecentSongPosition to store the song; I need to know the eventTarget */
console.log("song is in que")

  // if (songURLsToPlay.length === 2 && audioPlayerEl.currentTime === 0){
  //     audioPlayerEl.src=songURLsToPlay[1];
  //     audioPlayerEl.play();
  //   } else if ((songURLsToPlay.length === 2 && audioPlayerEl.currentTime !== 0)) {
  //     console.log("song is in que")
  //   }
  //
  // if (songURLsToPlay.length === 3 && audioPlayerEl.currentTime === 0){
  //     audioPlayerEl.src=songURLsToPlay[2];
  //     audioPlayerEl.play();
  //   } else if ((songURLsToPlay.length === 2 && audioPlayerEl.currentTime !== 0)) {
  //     console.log("song is in que")
  //   }
}
    // audioPlayerEl.src=songURLsToPlay[0];
    // audioPlayerEl.nextSongQ(songURLsToPlay, listOfPickedSongs);


  // else if (songURLsToPlay.length > 1) {
  //   storeSongs(songURLsToPlay, listOfPickedSongs);
  //   console.log("another song was picked")
  // }

//   let mostRecentSongPosition = (songURLsToPlay.length - 1);
//   console.log(mostRecentSongPosition);
//
  // let currentstring = listOfPickedSongs[mostRecentSongPosition];
  // console.log(currentstring)
  //
  // let songListEl = document.getElementById('songURLsToPlay');
  // // console.log(songListEl);
  // let newListItemEl = document.createElement( "li" );
  // let listItemContent = document.createTextNode(listOfPickedSongs[0]);
  // songListEl.appendChild( newListItemEl );
  // newListItemEl.appendChild( listItemContent );
  //
  // audioPlayerEl.src=songURLsToPlay[mostRecentSongPosition];
  // audioPlayerEl.play();



  //   // audioPlayerEl.play(songURLsToPlay[1]);
  //     // listOfPickedSongs.length = 2;
  // }
  // if (listOfPickedSongs.length > 1) {
  //   let nextSong = audioPlayerEl.src = songURLsToPlay[1];
  //   currentSongPlaying.push(nextSong);
  //   audioPlayerEl.play();
  //   songURLsToPlay.shift;
  // }
  // if (listOfPickedSongs.length === 3) {
  //   audioPlayerEl.src=songURLsToPlay[2];
  //   audioPlayerEl.play();
  //
  // }
  // if (listOfPickedSongs.length === 4) {
  //   audioPlayerEl.src=songURLsToPlay[3];
  //   audioPlayerEl.play();
  //   songURLsToPlay.shift;
  //   // songInfo.shift;
  // }


//
// document.getElementById('player').play()"
// document.getElementById('player').pause()"
// document.getElementById('player').volume += 0.1
// document.getElementById('player').volume -= 0.1


// <audio controls="controls">
//     <source src=${audio} type="audio/mp4">
// </audio>


// let aud = new Audio();
// aud.src = x;
// aud.play()
// http://www.binarytides.com/using-html5-audio-element-javascript/
//
// index.html:1 Uncaught (in promise) DOMException: Failed to load because no supported source was found.
// Promise (async)
// (anonymous) @ main.js:123

// var aud = new Audio();
// aud.src = 'sound.ogg';
//
// //You could also do
// var aud = new Audio('sound.ogg');
//
// //Now lets play the music
// aud.play();
// // http://www.binarytides.com/using-html5-audio-element-javascript/
//

// For how to style controls or make my own onclick buttons.... https://stackoverflow.com/questions/4126708/is-it-possible-to-style-html5-audio-tag

// <body>
//
// <p>Click the button to find out if the onclick event is a bubbling event.</p>
//
// myFunction(event)">Try it</button>
//
// <p id="demo"></p>
//
// <script>
// function myFunction(event) {
//     var x = event.bubbles;
//     document.getElementById("demo").innerHTML = x;
// }
// </script>



// <script src="https://.../search?parameterkeyvalue&callback="{name of JavaScript function in webpage}"/>
//
// artistName
// collectionName
// previewUrl - audio
// trackName
// artworkUrl100 "http://is5.mzstatic.com/image/thumb/Music69/v4/32/44/08/324408b9-c9ad-e8c1-17ec-132b15dada48/source/100x100bb.jpg"

// use to modify the input styles: https://www.w3schools.com/jsref/event_onfocusout.asp


//
// Original code with console.log notes....
// function moveSelSongToPlayer(){
//   console.log("A song has been selected");
//   let eventTarget=event.target;
//   console.log(eventTarget);
//   let urlForSelectedSong=eventTarget.getAttribute("url");/* << url for the song we want to play*/
//   console.log(urlForSelectedSong);
//   songURLsToPlay.push(urlForSelectedSong);
//   console.log(songURLsToPlay);
//
//   let audioPlayerEl = document.getElementById('song_player');
//   console.log(audioPlayerEl);
//
//   audioPlayerEl.src=songURLsToPlay[0];
//   console.log(audioPlayerEl);
// }
