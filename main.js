let searchInputEl = document.getElementById("search_field");
let buttonEl = document.getElementById("search_now");

let url = "";

let results_container = document.getElementById("results_container");
// let resultsArray = [];



buttonEl.addEventListener('click', function(e) {
  let search_termVal = searchInputEl.value;

  if (search_termVal) {
    alert("Hang on a sec.....");
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

          let song_result_hits = `
          <div class="item">
            <img src="${cover_art}"/>
            <h4>${song_title}</h4>
            <h3>${artist}</h3>
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
      })
  })
  .catch(function(err) {
    console.log("Fetch Error :-S", err);
  })
}








// <script src="https://.../search?parameterkeyvalue&callback="{name of JavaScript function in webpage}"/>
//
// artistName
// collectionName
// previewUrl - audio
// trackName
// artworkUrl100 "http://is5.mzstatic.com/image/thumb/Music69/v4/32/44/08/324408b9-c9ad-e8c1-17ec-132b15dada48/source/100x100bb.jpg"
