<template>
  <div id="app" class="bg-dark">
    <div id="nav">
      <router-link to="/login"></router-link>
      <router-link to="/playlists"></router-link>
    </div>
    <div class="container-fluid">
      <router-view />
    </div>
  </div>
</template>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  min-height: 700px;
  padding-top: 10px;

}
@import "~font-awesome/css/font-awesome.min.css";
@import "~bootstrap/dist/css/bootstrap.min.css";
</style>
