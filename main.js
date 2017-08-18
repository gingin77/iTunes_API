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
          <div class="item" "${audio}">
            <img src="${cover_art}"/>
            <h4>${song_title}</h4>
            <h3>${artist}</h3>
            <audio controls="controls">
                <source src=${audio} type="audio/mp4">
            </audio>
          </div>`

          markup += song_result_hits

          // resultsArray.push({
          //   cover_art: abrv[i].artworkUrl100,
          //   artist: abrv[i].artistName,
          //   album: abrv[i].collectionName,
          //   audio: abrv[i].previewUrl,
          //   song: abrv[i].trackName
          // }); /* end of object*/
        } /* end of for loop*/
        // console.log(resultsArray);

        console.log(markup);
        results_container.innerHTML = markup;

        let item_divs = document.getElementsByClassName("item");
        // let audio_tags = document.getElementsByClassName("audio");


        for (let j=0; j<item_divs.length; j++){
            item_divs[j].addEventListener('click', playSongSnip, false);
            // audio_tags[j].addEventListener('click', playSongSnip, true);
          }
          console.log(item_divs);
          console.log(item_divs[0].children);/*  [img, h4, h3, audio.audio] */
          console.log(item_divs[0].children[3]); /* returns: <audio controls = ...*/

          let x = item_divs[0].children[3].currentSrc;
          console.log(typeof x);
          console.log(x);

          // var x = document.getElementById("myAudio").currentSrc;


        // let numberKeys = document.getElementsByClassName("number");

// for (let i=0; i<numberKeys.length; i++){
//     numberKeys[i].addEventListener('click', numberKeyEvListener);
//   }

      })
  })
  .catch(function(err) {
    console.log("Fetch Error :-S", err);
  })
}

// let audio = "";

function playSongSnip(){
  let eventTargetClasses=event.target.classList;
  console.log(eventTargetClasses);
  let audioSrc = eventTargetClasses[1];
  console.log("A song has been selected");
  // let thisAudio = this.target;
  // console.log((typeof thisAudio), thisAudio);
  // let song_src = thisAudio.div.value;
  console.log(audioSrc);
  // thisAudio.play();

  // let x = event.bubbles;
  // document.getElementsByClassName("audio") = x;
  // I need the scr value for the audio tag within that item div that was clicked... how??
  // audio.play();
}

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
// <button onclick="myFunction(event)">Try it</button>
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
