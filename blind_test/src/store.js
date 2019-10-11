import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";
import Song from "./models/Song";
import { getNumbersBetweenInterval, getUniqueRandomIndex } from "./models/Random";
import { MIN_SECONDS, MAX_SECONDS } from "./models/Constants";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    clientId: "f71ed70725b347ae86cc0630a7adbf24",
    secretId: "077c71e37d0a4239ac45b18cd6a60ed3",
    scopes: 'playlist-read-collaborative playlist-modify-private playlist-modify-public playlist-read-private user-read-private user-read-email',
    code: "",
    redirect: "http://localhost:8080/login/",
    authToken: null,
    playlists: [],
    tracks: [],
    trackOrder: [],
    currentStep: 0
  },
  getters: {
    redirectionUrl: state => 'https://accounts.spotify.com/authorize' +
      '?response_type=code' +
      '&client_id=' + state.clientId +
      (state.scopes ? '&scope=' + encodeURIComponent(state.scopes) : '') +
      '&redirect_uri=' + encodeURIComponent(state.redirect),
    authToken: () => {
      return localStorage.getItem('authToken')
    },
    getCurrentSong: state => {
      return state.tracks[state.trackOrder[state.currentStep]]
    },
    totalOfSongs: state => {
      return state.tracks.length
    }
  },
  mutations: {
    SET_AUTHORIZATION_CODE(state, code) {
      state.code = code
    },
    SET_AUTH_TOKEN(state, authToken) {
      localStorage.setItem('authToken', authToken)
      state.authToken = authToken
    },
    SET_PLAYLISTS(state, playlists) {
      state.playlists = playlists
    },
    SET_TRACKS(state, tracks) {
      state.tracks = tracks
    },
    INSERT_ORDER_OF_RANDOM_SONGS(state, trackOrder) {
      state.trackOrder = trackOrder
    },
    INCREMENT_CURRENT_SONG (state) {
      state.currentStep = state.currentStep + 1
    },
    RESET_STEP (state) {
      state.currentStep = 0
    }
  },
  actions: {
    GET_AUTH_TOKEN({ commit }, code) {
      const URL = 'http://localhost:3000/auth'

      return new Promise((resolve, reject) => {
        axios.post(URL, { code }).then(r => {
          this.commit('SET_AUTH_TOKEN', r.data.token)
          resolve(r)
        }).catch(r => reject(r));
      })
    },
    GET_PLAYLISTS({ commit }) {
      const URL = 'http://localhost:3000/playlists'

      return new Promise((resolve, reject) => {
        let authToken = this.getters.authToken
        axios.post(URL, { authToken }).then(r => {
          this.commit('SET_PLAYLISTS', r.data)
          resolve(r)
        }).catch(r => {
          this.commit('SET_PLAYLISTS', [])
          reject(r)
        });
      })
    },
    GET_TRACKS({ commit }, playlistId) {
      const URL = 'http://localhost:3000/tracks'

      return new Promise((resolve, reject) => {
        let authToken = this.getters.authToken
        axios.post(URL, { authToken, playlistId }).then(r => {
          this.commit('INSERT_ORDER_OF_RANDOM_SONGS', getUniqueRandomIndex(r.data, r.data.length));
          this.commit('SET_TRACKS', r.data)
          resolve(r)
        }).catch(r => {
          this.commit('INSERT_ORDER_OF_RANDOM_SONGS', [])
          this.commit('SET_TRACKS', [])
          reject(r)
        });
      })
    },
    PLAY_CURRENT_SONG({ commit }) {
      const currentTime = getNumbersBetweenInterval(MIN_SECONDS, MAX_SECONDS);
      const song = new Song(this.getters.getCurrentSong.track.preview_url, currentTime);
      return song.play()
    }
  }
})
