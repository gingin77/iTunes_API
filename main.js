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

  playNowOrSave(songURLsMain, songsMainArray)
}

function playNowOrSave () {
  audioPlayerEl = document.getElementById('song_player')
  let pickedSongInxPos = (songsMainArray.length - 1)

  if (songsMainArray.length === 1) {
    songURL = songURLsMain[0]
    playSequence(songURL)
    pushSongsToCurrent(songURLsMain[0], songsMainArray[0])

  } else if ((songsMainArray.length > 1) && (currentSongPlaying.length === 0)) {
    // this is for when a song has already played and is over, so the currentSongPlaying array is empty.
    songURL = songURLsMain[pickedSongInxPos]
    playSequence(songURL)
    pushSongsToCurrent(songURLsMain[pickedSongInxPos], songsMainArray[pickedSongInxPos])

  } else if ((songsMainArray.length > 1) && (currentSongPlaying.length !== 0) && (nextSongArray.length === 0)) {
    // this is for when a song is playing but a 'next song' has NOT yet been designated.
    pushSongsToNext(songURLsMain[pickedSongInxPos], songsMainArray[pickedSongInxPos])
  }
  displaySongList()
}

function onSongEnd () {
  if (songsMainArray.length === 1) {
    console.log('onSongEnd if option 1 was triggered')
    audioPlayerEl.pause()
    transferCurrentToPrev()
  } else if (songsMainArray.length > 1) {
    if (nextSongArray.length === 0){
      console.log('onSongEnd else if, if option 2 was triggered')
      audioPlayerEl.pause()
      transferCurrentToPrev ()
    } else {
      console.log('onSongEnd else if, else option 3 was triggered')
      transferCurrentToPrev()
      songURL = nextSongURLArray[0]
      playSequence(songURL)
      transferNextToCurrent()
      ifNextSong()
    }
  }
  // labelPreviousSongs(currentSongURLPlaying[0], currentSongPlaying[0])
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
  console.log(currentSongPlaying)
  console.log(currentSongURLPlaying)
  // currentSongURLPlaying.length = 0
  // currentSongPlaying.length = 0
}

function transferNextToCurrent () {
  console.log('transferNextToCurrent was triggered')
  currentSongURLPlaying.push(nextSongURLArray[0])
  currentSongPlaying.push(nextSongArray[0])
  nextSongURLArray.shift()
  nextSongArray.shift()
}

function ifNextSong() {
  let positionOfCurrentSong = songsMainArray.indexOf(currentSongPlaying[0])
  if (positionOfCurrentSong !== (songsMainArray.length - 1)){
    getNextSong()
  }
}

function getNextSong () {
  console.log('getNextSong was triggered')
  let neededString = currentSongPlaying[0]
  let positionOfCurrentSong = songsMainArray.indexOf(neededString)

  positionOfNextSong = positionOfCurrentSong + 1

  pushSongsToNext(songURLsMain[positionOfNextSong], songsMainArray[positionOfNextSong])
}

function displaySongList () {
  let queuPosition = (songsMainArray.length - 1)
  let songListEl = document.getElementById('songsToPlay')
  let queuSongListItemEl = document.createElement('li')
  let queuSongListItemContent = document.createTextNode(songsMainArray[queuPosition])
  songListEl.appendChild(queuSongListItemEl)
  queuSongListItemEl.setAttribute('id', queuPosition)
  queuSongListItemEl.appendChild(queuSongListItemContent)
  // annotateAndUpdateSongList()
}

function annotateAndUpdateSongList () {
  // console.log('annotateAndUpdateSongList was triggered');
  // let positionOfCurrentSong = songsMainArray.indexOf(currentSongPlaying[0])
  // let currentSongElement = document.getElementById(positionOfCurrentSong)
  // currentSongElement.classList.add('current_song')
  //
  // if (currentSongElement.classList.contains('next_song')) {
  //   currentSongElement.classList.remove('next_song')
  // }
  //
  // if (nextSongArray.length === 1) {
  //   let findNextSong = songsMainArray.indexOf(nextSongArray[0])
  //   let nextSonginList = document.getElementById(findNextSong)
  //   nextSonginList.classList.add('next_song')
  // } else if (positionOfCurrentSong === (songsMainArray.length - 1)) {
  //   currentSongElement.classList.add('last_song')
  //
  // }
}

// function labelPreviousSongs () {
//   let lastSongEl = document.querySelector('li.current_song')
//   lastSongEl.classList.remove('current_song')
//   lastSongEl.classList.add('already_played')
// }
