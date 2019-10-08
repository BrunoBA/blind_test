<template>
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
            <th scope="col"></th>
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
            <td class="text-left">{{ item.name }}</td>
            <td>{{ item.tracks.total }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import store from "../store";

export default {
  created() {
    console.clear()
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
  }
};
</script>
<style>
.max-size {
  width: 60px;
}
</style>