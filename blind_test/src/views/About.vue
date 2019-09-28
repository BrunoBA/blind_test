<template>
  <div class="row">
    <div class="col-12">
      <table class="table table-dark">
        <tbody>
          <tr>
            <th>Code</th>
            <td>
              <small>{{code}}</small>
            </td>
          </tr>
          <tr>
            <th>ClientId</th>
            <td>
              <small>{{state.clientId}}</small>
            </td>
          </tr>
          <tr>
            <th>ClientId (encoded)</th>
            <td>
              <small>{{clientEncoded}}</small>
            </td>
          </tr>
          <tr>
            <th>Redirect Url (encoded)</th>
            <td>
              <small>{{redirectEncoded}}</small>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import store from "../store";
var SpotifyWebApi = require("spotify-web-api-node");

export default {
  created() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code != null) {
      store.commit("SET_AUTHORIZATION_CODE", code);

      // credentials are optional
      var spotifyApi = new SpotifyWebApi({
        clientId: store.state.clientId,
        clientSecret: store.state.secretId,
        redirectUri: store.state.redirect
      });

      store.dispatch("GET_AUTH_TOKEN");

      // spotifyApi.setAccessToken(code);
      // spotifyApi.searchPlaylists("tes").then(
      //   function(data) {
      //     console.log("Found playlists are", data.body);
      //   },
      //   function(err) {
      //     console.log("Something went wrong!", err);
      //   }
      // );
    }
  },
  data() {
    return {};
  },
  computed: {
    state () {
      return store.state;
    },
    code() {
      return store.state.code;
    },
    clientEncoded() {
      return btoa(store.state.clientId);
    },
    redirectEncoded() {
      return encodeURIComponent(store.state.redirect);
    }
  }
};
</script>