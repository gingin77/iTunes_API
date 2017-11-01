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
          // let album = abrv[i].collectionName
          let audio = abrv[i].previewUrl
          let songTitle = abrv[i].trackName
          // let genre = abrv[i].primaryGenreName

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
let songURLsToPlay = []
let listOfPickedSongs = []
let currentSongURLPlaying = []
let currentSongPlaying = []
let nextSongURLPlaying = []
let nextSongPlaying = []

let positionOfNextSong = ''
let postionOfLastSongPicked = ''
let songURL = ''

let previousSongURLPlaying = []
let previousSongPlaying = []

let audioPlayerEl = document.getElementById('song_player')
audioPlayerEl.addEventListener('ended', onSongEnd, true)

function moveChosenSongToPlayer () {
  let eventTarget = event.target

  let urlForSelectedSong = eventTarget.getAttribute('url')
  let songInfo = eventTarget.getAttribute('value')
  songURLsToPlay.push(urlForSelectedSong)
  listOfPickedSongs.push(songInfo)

  holdAndPlayOrHold(songURLsToPlay, listOfPickedSongs)
}

function holdAndPlayOrHold () {
  audioPlayerEl = document.getElementById('song_player')
  postionOfLastSongPicked = (listOfPickedSongs.length - 1)

  if (songURLsToPlay.length === 1) {
    audioPlayerEl.src = songURLsToPlay[0]
    audioPlayerEl.play()
    currentSongURLPlaying.push(songURLsToPlay[0])
    currentSongPlaying.push(listOfPickedSongs[0])
    displaySongList(currentSongURLPlaying, currentSongPlaying)
  } else if ((songURLsToPlay.length > 1) && (currentSongPlaying.length === 0)) {
    currentSongURLPlaying.push(songURLsToPlay[postionOfLastSongPicked])
    songURL = currentSongURLPlaying[0]
    currentSongPlaying.push(listOfPickedSongs[postionOfLastSongPicked])
    playSequence(songURL)
    displaySongList()
  } else if ((songURLsToPlay.length > 1) && (currentSongPlaying.length !== 0) && (nextSongURLPlaying.length === 0)) {
    nextSongURLPlaying.push(songURLsToPlay[postionOfLastSongPicked])
    nextSongPlaying.push(listOfPickedSongs[postionOfLastSongPicked])
    displaySongList()
  } else if ((songURLsToPlay.length > 1) && (currentSongPlaying.length !== 0) && (nextSongURLPlaying.length !== 0)) {
    displaySongList(songURLsToPlay, listOfPickedSongs)
  } else if (listOfPickedSongs.length > 11) {
    listOfPickedSongs.shift
    songURLsToPlay.shift
  }
}

function onSongEnd () {
  if (listOfPickedSongs.length === 1) {
    audioPlayerEl.pause()
    previousSongURLPlaying.push(currentSongURLPlaying.shift())
    previousSongPlaying.push(currentSongPlaying.shift())
  } else if (listOfPickedSongs.length > 1 && nextSongURLPlaying.length !== 0) {
    songURL = nextSongURLPlaying[0]
    playSequence(songURL)
    adjustSongsInPlaceHolderArrays(currentSongPlaying)
    annotateAndUpdateSongList()
    labelPreviousSongs()
  }
}

function playSequence () {
  audioPlayerEl.src = songURL
  audioPlayerEl.load()
  audioPlayerEl.pause()
  audioPlayerEl.play()
}

function adjustSongsInPlaceHolderArrays () {
  previousSongURLPlaying.push(currentSongURLPlaying.shift())
  previousSongPlaying.push(currentSongPlaying.shift())

  currentSongURLPlaying.length = 0
  currentSongPlaying.length = 0

  currentSongURLPlaying.push(nextSongURLPlaying[0])
  currentSongPlaying.push(nextSongPlaying[0])

  nextSongURLPlaying.shift()
  nextSongPlaying.shift()

  let neededString = currentSongPlaying[0]
  let positionOfCurrentSong = listOfPickedSongs.indexOf(neededString)

  positionOfNextSong = positionOfCurrentSong + 1

  nextSongPlaying.push(listOfPickedSongs[positionOfNextSong])
  nextSongURLPlaying.push(songURLsToPlay[positionOfNextSong])
}

function displaySongList () {
  let queuPosition = (listOfPickedSongs.length - 1)
  let songListEl = document.getElementById('songsToPlay')
  let queuSongListItemEl = document.createElement('li')
  let queuSongListItemContent = document.createTextNode(listOfPickedSongs[queuPosition])
  songListEl.appendChild(queuSongListItemEl)
  queuSongListItemEl.setAttribute('id', queuPosition)
  queuSongListItemEl.appendChild(queuSongListItemContent)
  annotateAndUpdateSongList()
}

function annotateAndUpdateSongList () {
  let findCurrentSong = listOfPickedSongs.indexOf(currentSongPlaying[0])
  let currentSongElement = document.getElementById(findCurrentSong)
  currentSongElement.classList.add('current_song')

  if (currentSongElement.classList.contains('next_song')) {
    currentSongElement.classList.remove('next_song')
  }

  // if (currentSongElement.length = 1) {
    // console.log('currentSongElement.length = 1')
    // currentSongElement.classList.remove('next_song')
    // currentSongElement.classList.add('current_song')
  // } else {
  //   currentSongElement.classList.add('current_song')
  // }

  if (nextSongPlaying.length >= 1) {
    let findNextSong = listOfPickedSongs.indexOf(nextSongPlaying[0])
    let nextSonginList = document.getElementById(findNextSong)

    nextSonginList.classList.add('next_song')
  }
}

function labelPreviousSongs () {
  let prevSong = document.querySelector('li.current_song')
  console.log(prevSong)
  prevSong.classList.remove('current_song')
  prevSong.classList.add('already_played')
}
