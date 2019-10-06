<template>
  <div class="container">
    <div class="row my-3">
      <div class="col-12 text-center text-white">
        <b>{{currentStep}} / 10</b>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="progress my-3" style="height: 20px;">
          <div
            class="progress-bar progress-bar-striped progress-bar-animated bg-success"
            role="progressbar"
            :style="{width: `${progressBar}%`}"
            aria-valuenow="25"
            aria-valuemin="0"
            aria-valuemax="100"
          >
          <b v-if="readyToBet">Bet</b>
            
          </div>
        </div>
      </div>
    </div>
    <div class="row d-flex justify-content-center">
      <div v-for="(option, index) in currentSong.options" :key="index" class="col-8">
        <button
          :disabled="progressBar != 100"
          @click="nextSong(option)"
          class="btn btn-light btn-block mt-1 d-flex justify-content-between"
        >
          <i class="fa fa-music" aria-hidden="true"></i>
          <b>{{option.title}}</b>
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

const LISTEN_LIMIT_SECONDS = 2;
const MIN_SECONDS = 0;
const MAX_SECONDS = 29 - LISTEN_LIMIT_SECONDS;
const VOLUME = 0.1;

const ONE_SECOND = 1000;

export default {
  data() {
    return {
      timer: LISTEN_LIMIT_SECONDS,
      timeToSelect: 0,
      incrementTime: 0,
      functionToDecrement: null,
      functionToIncrement: null,
      timerOver: false,
      incrementTimeOver: false,
    };
  },
  mounted() {
    this.functionToDecrement = this.timeout();
    this.functionToIncrement = this.incrmentTimer();

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
    },
    progressBar() {
      let percentage = (this.incrementTime / LISTEN_LIMIT_SECONDS) * 100;

      if (percentage >= 100) {
        percentage = 100;
      }
      return percentage;
    },
    readyToBet() {
      return this.timerOver && this.incrementTimeOver
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
      return setInterval(() => {
        this.timer = this.timer - 1;
        console.log(`Timer.. ${this.timer}`);

        if (this.timer < 0) {
          this.timerOver == true
          console.log("Clear the timeout");
          clearInterval(this.functionToDecrement);
        }
      }, ONE_SECOND);
    },
    incrmentTimer() {
      return setInterval(() => {
        this.incrementTime = this.incrementTime + 1;
        console.log(`IncrementTime.. ${this.incrementTime}`);

        if (this.incrementTime > LISTEN_LIMIT_SECONDS) {
          this.incrementTimeOver = true
          console.log("Clear the timeout");
          clearInterval(this.functionToIncrement);
        }
      }, ONE_SECOND);
    },
    nextSong(option) {
      this.incrementTime = 0;
      this.timer = LISTEN_LIMIT_SECONDS;

      this.functionToDecrement = this.timeout();
      this.functionToIncrement = this.incrmentTimer();

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