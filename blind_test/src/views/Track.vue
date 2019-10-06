<template>
  <div class="container">
    <div class="row">
      <div class="col-12 text-center text-white">
        <b>{{currentStep}} / 10</b>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <button @click="nextSong()" class="btn btn-success">
          <b>Next Song {{fixedTimeout}}</b>
          <i class="ml-1 fa fa-forward" aria-hidden="true"></i>
        </button>
      </div>
    </div>
    <div class="row d-flex justify-content-center">
      <div v-for="(item, index) in currentSong.options" :key="index" class="col-8">
        <button @click="takeTheTime()" class="btn btn-light btn-block mt-1 d-flex justify-content-between">
          <i class="fa fa-music" aria-hidden="true"></i>
          <b>{{item.title}}</b>
          <span></span>
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <span class="text-white" v-if="timeToSelect != 0">
          <b>Song selected in {{timeToSelect}}</b>
        </span>
      </div>
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

const LISTEN_LIMIT_SECONDS = 5;
const MIN_SECONDS = 0;
const MAX_SECONDS = 29 - LISTEN_LIMIT_SECONDS;
const VOLUME = 0.01;

export default {
  data() {
    return {
      timer: LISTEN_LIMIT_SECONDS,
      timeToSelect: 0
    };
  },
  mounted() {
    this.timeout();

    store.commit("RESET_STEP");
    store.dispatch("GET_TRACKS", router.currentRoute.params.id).then(res => {
      store.commit(
        "INSERT_ORDER_OF_RANDOM_SONGS",
        getUniqueRandomIndex(res.data, 10)
      );

      let RANDOM_INDEX = store.state.trackOrder[store.state.currentSong];
      this.loadAudio(res.data[RANDOM_INDEX].track);
    });
  },
  computed: {
    fixedTimeout() {
      if (this.timer > 0) return this.timer;
      return 0;
    },
    currentStep() {
      return store.state.currentSong;
    },
    currentSong() {
      return store.state.tracks[
        store.state.trackOrder[store.state.currentSong]
      ];
    }
  },
  methods: {
    loadAudio(audio) {
      this.timer = LISTEN_LIMIT_SECONDS;
      this.track = new Audio(audio.preview_url);
      this.track.volume = VOLUME;
      let currentTime = getNumbersBetweenInterval(MIN_SECONDS, MAX_SECONDS);
      this.track.currentTime = currentTime;
      this.track
        .play()
        .then(() => {
          console.log(
            `"${audio.name}" - between ${currentTime} - ${currentTime +
              LISTEN_LIMIT_SECONDS}!`
          );
          setTimeout(() => {
            this.track.pause();
          }, LISTEN_LIMIT_SECONDS * 1000);
        })
        .catch(() => {
          // this.track.pause();
          console.log(`Error to load (${audio.name})`);
        });
    },
    timeout() {
      setInterval(() => {
        this.timer = this.timer - 1;
      }, 1000);
    },
    nextSong() {
      store.commit("INCREMENT_CURRENT_SONG");
      let RANDOM_INDEX = store.state.trackOrder[store.state.currentSong];
      this.loadAudio(store.state.tracks[RANDOM_INDEX].track);
    },
    takeTheTime() {
      this.timeToSelect = this.fixedTimeout;
    }
  }
};
</script>