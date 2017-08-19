let searchInputEl = document.getElementById("search_field");
let buttonEl = document.getElementById("search_now");

let url = "";
let songsToPlay = [];



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
          <div class="item" url="${audio}" value="Artist: ${artist} Song Title: ${song_title}">
            <img src="${cover_art}" url="${audio}"/>
            <h4 url="${audio}">${song_title}</h4>
            <h3 url="${audio}">${artist}</h3>
          </div>`

          markup += song_result_hits
        }

        console.log(markup);
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

  let urlForSelectedSong=eventTarget.getAttribute("url");/* << url for the song we want to play*/
  songsToPlay.push(urlForSelectedSong);
  console.log(songsToPlay);



  // let songInfo=eventTarget.getAttribute("value");
  // console.log(songInfo);

  decideToPlayOrStoreSong(songsToPlay)

  // still need to hit ply though...
  // Also, it would be nice to show the song title, as well as a list of other selected songs
}

function decideToPlayOrStoreSong(){
  let mostRecentSongPosition = (songsToPlay.length - 1);
  console.log(mostRecentSongPosition);
  audioPlayerEl = document.getElementById('song_player');

  if (songsToPlay.length === 1){
    audioPlayerEl.src=songsToPlay[0];
    audioPlayerEl.play();
  }
  else {
    audioPlayerEl.src=songsToPlay[mostRecentSongPosition];
    audioPlayerEl.play();
  }
}



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
//   songsToPlay.push(urlForSelectedSong);
//   console.log(songsToPlay);
//
//   let audioPlayerEl = document.getElementById('song_player');
//   console.log(audioPlayerEl);
//
//   audioPlayerEl.src=songsToPlay[0];
//   console.log(audioPlayerEl);
// }
