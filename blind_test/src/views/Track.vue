<template>
  <div class="container">
    <div class="row my-3">
      <div class="col-12 text-center text-white">
        <!-- <b>{{currentStep}} / {{quantifyOfSongs}}</b> -->
        <b>1/10</b>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="progress my-3" style="height: 20px;">
          <div
            class="progress-bar progress-bar-striped progress-bar-animated bg-success"
            role="progressbar"
            style="width: 10%"
            aria-valuenow="25"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>
    </div>
    <div class="row d-flex justify-content-center">
      <template v-if="started">
        <div v-for="(option, index) in currentSong.options" :key="index" class="col-8">
          <button
            :disabled="lockSongs"
            @click="nextSong(option)"
            class="btn btn-light btn-block mt-1 d-flex justify-content-between"
          >
            <i class="fa fa-music" aria-hidden="true"></i>
            <b>{{option.title}}</b>
            <span></span>
          </button>
        </div>
      </template>
      <div v-else class="col-8">
        <button @click="start()" class="btn btn-success">Start</button>
      </div>
    </div>
    <div class="text-white">
      {{state.currentStep}}
      {{state.trackOrder[state.currentStep]}}
    </div>
  </div>
</template>
<script>
import store from "../store";
import router from "../router";
import {
  getNumbersBetweenInterval,
  getUniqueRandomIndex
} from "../models/Random";

import {
  LISTEN_LIMIT_SECONDS,
  MIN_SECONDS,
  MAX_SECONDS,
  VOLUME,
  ONE_SECOND
} from "../models/Constants";

export default {
  data() {
    return {
      timer: LISTEN_LIMIT_SECONDS,
      started: false,
      lockSongs: true
    };
  },
  created() {
    store.commit("RESET_STEP");
    store.dispatch("GET_TRACKS", router.currentRoute.params.id);
  },
  mounted() {},
  computed: {
    currentStep() {
      return store.state.currentStep;
    },
    currentSong() {
      return store.getters.getCurrentSong;
    },
    quantifyOfSongs() {
      return store.getters.totalOfSongs;
    },
    state() {
      return store.state
    }
  },
  methods: {
    start() {
      this.started = true;
      store.dispatch("PLAY_CURRENT_SONG").then(() => (this.lockSongs = false));
    },
    nextSong(option) {
      this.lockSongs = true;
      store.commit("INCREMENT_CURRENT_SONG");
      store.dispatch("PLAY_CURRENT_SONG").then(() => {
        this.lockSongs = false;
        console.log("Acabou");
      });
    },
    takeTheTime() {
      this.timeToSelect = this.fixedTimeout;
    }
  }
};
</script>