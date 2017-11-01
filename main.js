let searchInputEl = document.getElementById('search_field')
let buttonEl = document.getElementById('search_now')
let url = ''

let resultsContainer = document.getElementById('results_container')

buttonEl.addEventListener('click', function (e) {
  let searchTermVal = searchInputEl.value
  if (searchTermVal) {
    searchInputEl.value = ''
  }
  url = ('https://itunes.apple.com/search?term=' + searchTermVal)
  fetchGET(url)
})

function fetchGET () {
  fetch(url)
    .then(function (response) {
      if (response.status !== 200) {
        console.log(response.status)
        return
      }
      response.json().then(function (data) {
        let markup = ''
        let abrv = data.results

        for (let i = 0; i < data.results.length; i++) {
          let coverArt = abrv[i].artworkUrl100
          let artist = abrv[i].artistName
          let audio = abrv[i].previewUrl
          let songTitle = abrv[i].trackName

          let songResultHits = `
          <div class="item" url="${audio}" value='${artist}, "${songTitle}"'>
            <img src="${coverArt}" url="${audio}" value='${artist}, "${songTitle}"'/>
            <h4 url="${audio}" value='${artist}, "${songTitle}"'>${songTitle}</h4>
            <h3 url="${audio}" value='${artist}, "${songTitle}"'>${artist}</h3>
          </div>`

          markup += songResultHits
        }
        resultsContainer.innerHTML = markup

        let itemDivs = document.getElementsByClassName('item')

        for (let j = 0; j < itemDivs.length; j++) {
          itemDivs[j].addEventListener('click', moveChosenSongToPlayer, true)
        }
      })
    })
    .catch(function (err) {
      console.log('Fetch Error :-S', err)
    })
}

// variables that allow for memory and control of song sequence
let songURLsMain = []
let songsMainArray = []
let currentSongURLPlaying = []
let currentSongPlaying = []
let nextSongURLArray = []
let nextSongArray = []

let positionOfNextSong = ''
let indexPostionPickedSong = ''
let songURL = ''

let prevURL = []
let prevSong = []

let audioPlayerEl = document.getElementById('song_player')
audioPlayerEl.addEventListener('ended', onSongEnd, true)

function moveChosenSongToPlayer () {
  let pickedSong = event.target

  let urlForSong = pickedSong.getAttribute('url')
  let songInfo = pickedSong.getAttribute('value')
  songURLsMain.push(urlForSong)
  songsMainArray.push(songInfo)

  holdAndPlayOrHold(songURLsMain, songsMainArray)
}

function holdAndPlayOrHold () {
  audioPlayerEl = document.getElementById('song_player')
  indexPostionPickedSong = (songsMainArray.length - 1)

  if (songsMainArray.length === 1) {
    // this is the first song picked - it plays immediately
    audioPlayerEl.src = songURLsMain[0]
    audioPlayerEl.play()

    pushSongsToCurrent(songURLsMain[0], songsMainArray[0])

  } else if ((songsMainArray.length > 1) && (currentSongPlaying.length === 0)) {
    // this is for when a song has already played and is over, so the currentSongPlaying array is empty.
    songURL = songURLsMain[indexPostionPickedSong]
    playSequence(songURL)

    pushSongsToCurrent(songURLsMain[indexPostionPickedSong], songsMainArray[indexPostionPickedSong])

  } else if ((songsMainArray.length > 1) && (currentSongPlaying.length !== 0) && (nextSongArray.length === 0)) {
    pushSongsToNext(songURLsMain[indexPostionPickedSong], songsMainArray[indexPostionPickedSong])
  }
  displaySongList()
}

function playSequence (songURL) {
  audioPlayerEl.src = songURL
  audioPlayerEl.load()
  audioPlayerEl.pause()
  audioPlayerEl.play()
}

function pushSongsToCurrent (url, info){
  console.log('pushSongsToCurrent was triggered')
  currentSongURLPlaying.push(url)
  currentSongPlaying.push(info)
}

function pushSongsToNext (url, info){
  console.log('pushSongsToNext was triggered')
  nextSongURLArray.push(url)
  nextSongArray.push(info)
}

function transferCurrentToPrev () {
  console.log('transferCurrentToPrev was triggered')
  prevURL.push(currentSongURLPlaying.shift())
  prevSong.push(currentSongPlaying.shift())
}



function onSongEnd () {
  if (songsMainArray.length === 1) {
    console.log('onSongEnd if option 1 was triggered');
    audioPlayerEl.pause()
  } else if (songsMainArray.length > 1) {
    if (nextSongArray.length === 0){
      console.log('onSongEnd else if, if option 2 was triggered');
      // currentSongPlaying[0] === songsMainArray[indexPostionPickedSong]
      audioPlayerEl.pause()
      transferCurrentToPrev ()
      // labelPreviousSongs(currentSongURLPlaying[0], currentSongPlaying[0])
    } else {
    // play next song
    console.log('onSongEnd else if, else option 3 was triggered');
      songURL = nextSongURLArray[0]
      playSequence(songURL)
      transferCurrentToPrev()
      adjustSongsInPlaceHolderArrays(currentSongPlaying)
    }
  }
  labelPreviousSongs(currentSongURLPlaying[0], currentSongPlaying[0])
}



function adjustSongsInPlaceHolderArrays () {
  console.log('adjustSongsInPlaceHolderArrays was triggered');
  // prevURL.push(currentSongURLPlaying.shift())
  // prevSong.push(currentSongPlaying.shift())

  currentSongURLPlaying.length = 0
  currentSongPlaying.length = 0

  currentSongURLPlaying.push(nextSongURLArray[0])
  currentSongPlaying.push(nextSongArray[0])

  // nextSongURLArray.shift()
  // nextSongArray.shift()

  // let neededString = currentSongPlaying[0]
  // let positionOfCurrentSong = songsMainArray.indexOf(neededString)
  //
  // positionOfNextSong = positionOfCurrentSong + 1
  //
  // nextSongArray.push(songsMainArray[positionOfNextSong])
  // nextSongURLArray.push(songURLsMain[positionOfNextSong])
}

function displaySongList () {
  let queuPosition = (songsMainArray.length - 1)
  let songListEl = document.getElementById('songsToPlay')
  let queuSongListItemEl = document.createElement('li')
  let queuSongListItemContent = document.createTextNode(songsMainArray[queuPosition])
  songListEl.appendChild(queuSongListItemEl)
  queuSongListItemEl.setAttribute('id', queuPosition)
  queuSongListItemEl.appendChild(queuSongListItemContent)
  annotateAndUpdateSongList()
}

function annotateAndUpdateSongList () {
  console.log('annotateAndUpdateSongList was triggered');
  // let positionOfCurrentSong = songsMainArray.indexOf(currentSongPlaying[0])
  // let currentSongElement = document.getElementById(positionOfCurrentSong)
  // currentSongElement.classList.add('current_song')
  //
  // if (currentSongElement.classList.contains('next_song')) {
  //   currentSongElement.classList.remove('next_song')
  // }

  // if (nextSongArray.length === 1) {
  //   let findNextSong = songsMainArray.indexOf(nextSongArray[0])
  //   let nextSonginList = document.getElementById(findNextSong)
  //   nextSonginList.classList.add('next_song')
  // // } else if (positionOfCurrentSong === (songsMainArray.length - 1)) {
  // //   currentSongElement.classList.add('last_song')
  // // ^^ this code doesn't work properly - the logic is faulty and allows for the first song to be designated the last_song
  // }
}

// function labelPreviousSongs () {
//   let lastSongEl = document.querySelector('li.current_song')
//   lastSongEl.classList.remove('current_song')
//   lastSongEl.classList.add('already_played')
// }
