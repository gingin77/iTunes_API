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
            <div class="song_info_holder">
              <h4 url="${audio}" value='${artist}, "${songTitle}"'>${songTitle}</h4>
              <br>
              <h3 url="${audio}" value='${artist}, "${songTitle}"'>${artist}</h3>
            </div>
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
  let pickedSongIndxPosn = (songsMainArray.length - 1)
  if (currentSongPlaying.length === 0) {
    playSequence(songURLsMain[pickedSongIndxPosn])
    displaySongList()
    pushSongsToCurrent(songURLsMain[pickedSongIndxPosn], songsMainArray[pickedSongIndxPosn])
  } else if ((currentSongPlaying.length !== 0) && (nextSongArray.length === 0)) {
    displaySongList()
    pushSongsToNext(songURLsMain[pickedSongIndxPosn], songsMainArray[pickedSongIndxPosn])
  } else {
    displaySongList()
  }
}

function onSongEnd () {
  if (nextSongArray.length === 0) {
    audioPlayerEl.pause()
    transferCurrentToPrev()
  } else {
    transferCurrentToPrev()
    playSequence(nextSongURLArray[0])
    transferNextToCurrent()
    ifNextSong()
  }
}

function playSequence (songURL) {
  audioPlayerEl.src = songURL
  audioPlayerEl.load()
  audioPlayerEl.pause()
  audioPlayerEl.play()
}

function pushSongsToCurrent (url, info) {
  currentSongURLPlaying.push(url)
  currentSongPlaying.push(info)
  labelCurrentSong()
}

function pushSongsToNext (url, info) {
  nextSongURLArray.push(url)
  nextSongArray.push(info)
  labelNextSong()
}

function transferCurrentToPrev () {
  prevURL.push(currentSongURLPlaying.shift())
  prevSong.push(currentSongPlaying.shift())
  labelPreviousSongs()
}

function transferNextToCurrent () {
  currentSongURLPlaying.push(nextSongURLArray.shift())
  currentSongPlaying.push(nextSongArray.shift())
  labelCurrentSong()
}

function ifNextSong () {
  let positionOfCurrentSong = songsMainArray.indexOf(currentSongPlaying[0])
  if (positionOfCurrentSong !== (songsMainArray.length - 1)) {
    getNextSong()
  }
}

function getNextSong () {
  let currentSongString = currentSongPlaying[0]
  let positionOfCurrentSong = songsMainArray.indexOf(currentSongString)
  let positionOfNextSong = positionOfCurrentSong + 1
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
}

function labelCurrentSong () {
  let positionOfCurrentSong = songsMainArray.indexOf(currentSongPlaying[0])
  let currentSongElement = document.getElementById(positionOfCurrentSong)
  currentSongElement.classList.add('current_song')

  if (currentSongElement.classList.contains('next_song')) {
    currentSongElement.classList.remove('next_song')
  }
}

function labelPreviousSongs () {
  let prevSongEls = document.querySelector('li.current_song')
  prevSongEls.classList.remove('current_song')
  prevSongEls.classList.add('already_played')
}

function labelNextSong () {
  let positionOfNextSong = 1 + (songsMainArray.indexOf(currentSongPlaying[0]))
  let nextSongElement = document.getElementById(positionOfNextSong)
  nextSongElement.classList.add('next_song')
}
