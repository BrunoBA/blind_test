<template>
  <div class="container">
    <div class="row">
      <div class="col-12 text-center">
        <h1 class="text-white">
          Playlists
          <i class="fa fa-spotify text-success" aria-hidden="true"></i>
        </h1>
      </div>
      <div class="col-12">
        <table class="table table-dark">
          <thead>
            <tr>
              <th scope="col">Thumbnail</th>
              <th scope="col" class="text-left">PlaylistName</th>
              <th scope="col">Tracks</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in playlists" :key="item.id">
              <td>
                <router-link :to="`/track/${item.id}`">
                  <img :src="item.image.url" class="figure-img img-fluid rounded max-size" />
                </router-link>
              </td>
              <td class="text-left">
                <router-link
                  class="remove-decorator"
                  :to="`/track/${item.id}`"
                >{{ formatText(item.name) }}</router-link>
              </td>
              <td>{{ item.tracks.total }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import store from "../store";
import { formatOptionText } from "../models/Utils";

export default {
  created() {
    if (store.state.playlists.length == 0) {
      store.dispatch("GET_PLAYLISTS");
    }
  },
  data() {
    return {};
  },
  computed: {
    state() {
      return store.state;
    },
    playlists() {
      return store.state.playlists;
    },
    clientEncoded() {
      return btoa(store.state.clientId);
    },
    redirectEncoded() {
      return encodeURIComponent(store.state.redirect);
    }
  },
  methods: {
    formatText(text) {
      return formatOptionText(text, 30);
    }
  }
};
</script>
<style>
.max-size {
  width: 100px;
  min-width: 50px;
}
a {
  text-decoration: none;
  color: white;
}

a:hover {
  text-decoration: none;
  color: white;
}
</style>