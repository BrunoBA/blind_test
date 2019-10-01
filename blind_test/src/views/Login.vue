<template>
  <div>
    <span class="text-white">
      Redirecting...
    </span>
  </div>
</template>
<script>
import store from "../store";
import router from "../router";

export default {
  created() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code != null) {
      store.commit("SET_AUTHORIZATION_CODE", code);
      store
        .dispatch("GET_AUTH_TOKEN", code)
        .then(res => {
          console.log(store.state.authToken)
          router.push('/playlists')
        })
        .catch(error => router.push('/'));
    } else {
      window.location.href = store.getters.redirectionUrl;
    }
  }
};
</script>
<style>
</style>