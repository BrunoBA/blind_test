import Vue from 'vue'
import Vuex from 'vuex'
import SpotifyWebApi from 'spotify-web-api-node'
import axios from "axios";
axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    clientId: "f71ed70725b347ae86cc0630a7adbf24",
    secretId: "077c71e37d0a4239ac45b18cd6a60ed3",
    scopes: 'user-read-private user-read-email playlist-read-private',
    code: "",
    redirect: "http://localhost:8080/callback/"
  },
  getters: {
    redirectionUrl: state => 'https://accounts.spotify.com/authorize' +
      '?response_type=code' +
      '&client_id=' + state.clientId +
      (state.scopes ? '&scope=' + encodeURIComponent(state.scopes) : '') +
      '&redirect_uri=' + encodeURIComponent(state.redirect)
  },
  mutations: {
    SET_AUTHORIZATION_CODE(state, code) {
      state.code = code
    }
  },
  actions: {
    GET_AUTH_TOKEN({ commit }) {
      const URL = 'https://accounts.spotify.com/api/token'

      return new Promise((resolve, reject) => {
        axios.post(URL, {
          headers: {
            // 'Access-Control-Allow-Origin': '*',
            // 'Content-Type': 'application/json',
          },
        }).then(r => {
          resolve(r)
        }).catch(r => reject(r));
      })
    }
  }
})
