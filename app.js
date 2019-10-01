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
      console.log(playlist)
      return { id: playlist.id, image: playlist.images[0], name: playlist.name, tracks: playlist.tracks }
    })
    res.send(playlists)
  }).catch(error => console.log(error));
})

app.post('/tracks', (req, res, next) => {
  spotifyApi.getPlaylistTracks(req.body.playlistId, {
    offset: 1,
    limit: 100,
    fields: 'items'
  })
  .then(
    function(data) {
      let tracks = data.body.items.filter(track => track.track.preview_url != null)
      res.send(tracks)
    },
    function(err) {
      console.log('Something went wrong!', err);
    }
  );
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))