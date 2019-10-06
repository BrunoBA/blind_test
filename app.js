const express = require('express')
const cors = require('cors');
const app = express()
const moment = require('moment')
const port = 3000
const SpotifyWebApi = require('spotify-web-api-node');
const axios = require('axios');

// credentials are optional
const scope = 'playlist-read-collaborative'

const spotifyApi = new SpotifyWebApi({
  clientId: 'f71ed70725b347ae86cc0630a7adbf24',
  clientSecret: '077c71e37d0a4239ac45b18cd6a60ed3',
  redirectUri: 'http://localhost:8080/login/'
});

let apiCredentials = {
  token: null,
  refreshToken: null,
  expiresAt: null
}

const MAX_SIZE_STRING = 30

function getNumbersBetweenInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatArtists(arrayOfArtists) {

  if (arrayOfArtists.length == 1) {
    return arrayOfArtists[0].name
  }

  if (arrayOfArtists.length > 1) {
    return arrayOfArtists.reduce((previousValue, artist) => {
      if (previousValue.length == 0) {
        return artist.name
      }
      return `${previousValue} & ${artist.name}`
    }, "")
  }

  return ""
}

function formatOptionText (text, SIZE) {
  if (text.length > SIZE) {
    return `${text.substring(0, SIZE)}...`
  }

  return text
}

function buildObjectOptionById(tracks, INDEX, correct) {
  return {
    title: formatOptionText(tracks[INDEX].track.name, MAX_SIZE_STRING),
    artist: formatOptionText(formatArtists(tracks[INDEX].track.artists), MAX_SIZE_STRING),
    album: formatOptionText(tracks[INDEX].track.album.name, MAX_SIZE_STRING),
    correct
  }
}

function addOptions(CORRECTLY_ID, tracks) {

  let arr = [CORRECTLY_ID];
  let arrayOfSongs = [
    buildObjectOptionById(tracks, CORRECTLY_ID, true)
  ]

  while (arr.length < 4) {
    let RANDOM_KEY = getNumbersBetweenInterval(0, tracks.length - 1);
    if (arr.indexOf(RANDOM_KEY) === -1) {
      arr.push(RANDOM_KEY);
      let randomOption = buildObjectOptionById(tracks, RANDOM_KEY, false);
      arrayOfSongs.push(randomOption);
    }
  }

  return arrayOfSongs;
}


function setAuthToken() {
  // if (apiCredentials.token == null || apiCredentials.expiresAt == null || moment().isAfter(apiCredentials.expiresAt)) {
  if (moment().isAfter(apiCredentials.expiresAt)) {
    return new Promise(resolve => {
      spotifyApi.refreshAccessToken().then(data => {
        console.log('The access token has been refreshed!');
        spotifyApi.setAccessToken(data.body['access_token']);
        resolve()
      }).catch(err => {
        console.log('Could not refresh access token', err);
        resolve()
      })
    });

    // spotifyApi.clientCredentialsGrant()
    //   .then(data => {
    //     let now = moment()

    //     apiCredentials.token = data.body.access_token
    //     apiCredentials.expiresAt = now.add(data.body.expires_in, 's')

    //     spotifyApi.setAccessToken(apiCredentials.token)
    //     resolve()
    //   })
  } else {
    return Promise.resolve()
  }
}

app.use(cors())
app.use(express.json())

app.post('/auth', (req, res, next) => {
  spotifyApi.authorizationCodeGrant(req.body.code).then(data => {
    let now = moment()

    apiCredentials.token = data.body.access_token
    apiCredentials.refreshToken = data.body.refresh_token
    apiCredentials.expiresAt = now.add(data.body.expires_in, 's')

    spotifyApi.setRefreshToken(data.body.refresh_token)
    spotifyApi.setAccessToken(apiCredentials.token)
    res.send(apiCredentials)
  })
})

app.use((req, res, next) => {
  let authToken = req.body.authToken

  spotifyApi.setAccessToken(authToken)

  // setAuthToken().then(() => {
  //   console.log(apiCredentials)
  // })
  next()
});

app.post('/playlists', (req, res, next) => {
  spotifyApi.getUserPlaylists().then(data => {
    let playlists = data.body.items.map(playlist => {
      return { id: playlist.id, image: playlist.images[0], name: playlist.name, tracks: playlist.tracks }
    })
    res.send(playlists)
  }).catch(error => console.log(error));
})

app.post('/tracks', (req, res, next) => {
  spotifyApi.getPlaylistTracks(req.body.playlistId, {
    offset: 0,
    limit: 100,
    fields: 'items',
    market: 'PT'
  })
    .then(data => {
      let tracks = data.body.items.filter(track => track.track.preview_url != null)
      tracks = tracks.map((track, index) => {
        track.options = addOptions(index, data.body.items)
        return track
      })

      res.send(tracks)
    })
    .catch(error => { console.log(error) })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))