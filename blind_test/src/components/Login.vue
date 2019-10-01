<template>
  <div class="m-4">
    <a :href="url">
      <button class="btn btn-success">
        <b>
          Login
        </b>
        <i class="fa fa-spotify text-white" aria-hidden="true"></i>
      </button>
    </a>
  </div>
</template>

<script>
import store from "../store";

export default {
  name: "Login",
  created() {},
  data() {
    return {};
  },
  computed: {
    url() {
      return store.getters.redirectionUrl;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
