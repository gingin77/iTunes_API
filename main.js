let searchInputEl = document.getElementById("search_field");
let buttonEl = document.getElementById("search_now");

let url = "";


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


// variables that allow for memory and control of song sequence
let songURLsToPlay = [];/* there is no in Q array because these 2 serve that purpose */
let listOfPickedSongs = [];
let currentSongURLPlaying = [];
let currentSongPlaying = [];
let nextSongURLPlaying = [];
let nextSongPlaying = [];
let previousSongURLPlaying = [];
let previousSongPlaying = [];

//Add event listener for onSongEnd to the audioPlayerEl
let audioPlayerEl = document.getElementById('song_player');
  // console.log(audioPlayerEl);
audioPlayerEl.addEventListener('ended',onSongEnd, true);

// function onSongEnd(){
//     audioPlayerEl.currentTime = 0;
//     console.log("song has ended");
//   };

function moveSelSongURLToPlayer(){
  console.log("A song has been selected");
    let eventTarget=event.target;
      console.log(eventTarget);

  let urlForSelectedSong=eventTarget.getAttribute("url");/* << url for the song we want to play*/
    songURLsToPlay.push(urlForSelectedSong);/*pass to subsequent functions*/
      console.log(songURLsToPlay.length);

  let songInfo=eventTarget.getAttribute("value");/* <<<Song title and artist to match the url...*/
    console.log(songInfo);
      listOfPickedSongs.push(songInfo);
        console.log((listOfPickedSongs.length), (listOfPickedSongs));

  holdAndPlayOrHold(songURLsToPlay, listOfPickedSongs);
}
// If first song selected, then play song and disply title.
// If 2nd song selected, dispaly song and wait for 1st song to end. Can I get this to work?
// still need to hit ply though...
// Also, it would be nice to show the song title, as well as a list of other selected songs

// I want to have a frame that lists: Current song playing
// I want to show - last song and next song, plus 2 more.

function holdAndPlayOrHold(){ /*this function triggers the first picked song to play AND introduces the currentSongArrasy, which will allow control over when clicked songs will play*/
  audioPlayerEl = document.getElementById('song_player');

  if (songURLsToPlay.length === 1){

    audioPlayerEl.src = songURLsToPlay[0];
    audioPlayerEl.play(); /* <<< Song is played here */

    currentSongURLPlaying.push(songURLsToPlay[0]);
    currentSongPlaying.push(listOfPickedSongs[0]);/* <<< Push song URL and info to respective apt CurrentSong arrays is played here */

    console.log("The song currently playing is "+ currentSongPlaying[0]);
    displaySongList(currentSongURLPlaying, currentSongPlaying);
  }
  else if (songURLsToPlay.length === 2) {
    console.log("another song was picked")

    nextSongURLPlaying.push(songURLsToPlay[1]);
    nextSongPlaying.push(listOfPickedSongs[1]);/* <<< Push song URL and info to respective apt CurrentSong arrays is played here */

    console.log("The next song to play will be "+ nextSongPlaying[0]);
    displaySongList(nextSongURLPlaying, nextSongPlaying);
  }
  else if (songURLsToPlay.length >= 3) {
    console.log("another song was picked and is in the que")
    displaySongList(songURLsToPlay, listOfPickedSongs);
  }
  // onSongEnd(currentSongURLPlaying);/* this did not help...*/
}



function onSongEnd(){ /*this is connected to the 'onended="onSongEnd()' attribute in the HTML ....*/
  // audioPlayerEl = document.getElementById('song_player');
console.log("a song has ended!");
audioPlayerEl.src = nextSongURLPlaying[0];
audioPlayerEl.play();

  if (audioPlayerEl.currentTime === 0 && listOfPickedSongs.length === 1){
        console.log("inside first onSongEnd if statemnt");
        // let isPaused = audioPlayerEl.paused;
        console.log("There are no new song snippets to play");
            currentSongURLPlaying.shift();
            currentSongPlaying.shift();
            // audioPlayerEl.pause();
    }

    if (audioPlayerEl.currentTime === 0 && listOfPickedSongs.length >= 2) { /* && listOfPickedSongs.length < 11*/
      console.log("A new song is about to start");
      audioPlayerEl.src = nextSongURLPlaying[0];

      currentSongURLPlaying.shift();
      currentSongPlaying.shift();
          currentSongURLPlaying.push(nextSongURLPlaying[0]);
          currentSongPlaying.push(nextSongPlaying[0]);
              // audioPlayerEl.src = currentSongURLPlaying[0];
              console.log(audioPlayerEl.src);
                  audioPlayerEl.play();
                  //
                  // setTimeout (function(){
                  //   audioPlayerEl.play();
                  //   }, 2000);

    }
    if (audioPlayerEl.currentTime === 0 && listOfPickedSongs.length === 11) {
      console.log("Your storage que is full and songs will be removed from the beginning of the que")
      listOfPickedSongs.shift;
      songURLsToPlay.shift;
    }
}


function displaySongList(){
  let queuPosition = (listOfPickedSongs.length - 1) /* how to set this up?*/
  let songListEl = document.getElementById('songsToPlay');
    console.log(songListEl);/* this should return the ul element*/

    if (listOfPickedSongs.length === 1){
      let currentSongListItemEl = document.createElement( "li" );
      let currentSongListItemContent = document.createTextNode("Currently playing: " + currentSongPlaying[0]);
        songListEl.appendChild( currentSongListItemEl );
        currentSongListItemEl.appendChild( currentSongListItemContent );
    }
    if (listOfPickedSongs.length === 2){
      let nextSongListItemEl = document.createElement( "li" );
      let nextSongListItemContent = document.createTextNode("The next song will be: " + nextSongPlaying[0]);
        songListEl.appendChild( nextSongListItemEl );
        nextSongListItemEl.appendChild( nextSongListItemContent );
    }
    if (listOfPickedSongs.length >= 3 && listOfPickedSongs.length <= 10){
      let queuSongListItemEl = document.createElement( "li" );
      let queuSongListItemContent = document.createTextNode(listOfPickedSongs[queuPosition]);
        songListEl.appendChild( queuSongListItemEl );
        queuSongListItemEl.appendChild( queuSongListItemContent );
    }
    if (listOfPickedSongs.length === 11){
        let lastQueuSongListItemEl = document.createElement( "li" );
        let lastQueuSongListItemContent = document.createTextNode("Your storage que is full and songs will be removed from the beginning of the que");
          songListEl.appendChild( queuSongListItemEl );
          queuSongListItemEl.appendChild( queuSongListItemContent );
        }
}
