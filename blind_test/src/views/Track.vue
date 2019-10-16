<template>
  <div class="container">
    <div class="row my-3">
      <div class="col-12 text-center text-white">
        <b>{{currentStep}} / {{quantifyOfSongs}}</b>
      </div>
    </div>
    <div class="row" v-if="started && (currentStep + 1 <= quantifyOfSongs)">
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
            <i>{{timer}} Seconds</i>
          </div>
        </div>
      </div>
    </div>
    <div v-if="currentStep != quantifyOfSongs" class="row d-flex justify-content-center">
      <template v-if="started">
        <div v-for="(option, index) in currentSong.options" :key="index" class="col-sm-12 col-md-6">
          <button
            :disabled="lockSongs"
            @click="nextSong(option)"
            class="btn btn-block mt-1 d-flex justify-content-between"
            :class="optionClass(option)"
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
    <div class="text-white" v-if="currentStep == quantifyOfSongs">
      <b>Corrects: {{corrects}} / {{quantifyOfSongs}}</b>
    </div>
  </div>
</template>
<script>
import store from "../store";
import router from "../router";

import {
  LISTEN_LIMIT_SECONDS,
  ONE_SECOND,
  TIME_TO_RELOAD
} from "../models/Constants";

export default {
  data() {
    return {
      started: false,
      lockSongs: true,
      showValues: false,
      counter: 0,
      corrects: 0
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
      return store.state;
    },
    timer() {
      return this.counter;
    },
    progressBar() {
      let percentage = (this.counter / LISTEN_LIMIT_SECONDS) * 100;
      if (percentage >= 100) {
        percentage = 100;
      }
      return percentage;
    }
  },
  methods: {
    finishBet() {
      return this.currentStep + 1 < this.quantifyOfSongs;
    },
    optionClass(option) {
      if (this.showValues) {
        if (option.correct) {
          return "btn-success";
        }
        return "btn-danger";
      }

      if (this.lockSongs) {
        return "btn-light";
      }
      return "btn-light";
    },
    start() {
      this.started = true;
      this.incrementTimer();

      store.dispatch("PLAY_CURRENT_SONG").then(() => {
        this.unlockSongs();
      });
    },
    incrementTimer() {
      this.counterTime = setInterval(() => {
        this.counter = this.counter + 1;
      }, ONE_SECOND);
    },
    unlockSongs() {
      this.lockSongs = false;
      clearInterval(this.counterTime);
    },
    nextSong(option) {
      if (option.correct) {
        this.corrects++;
      }

      this.lockSongs = true;
      this.showValues = true;

      if (this.finishBet()) {
        setTimeout(() => {
          this.showValues = false;
          store.commit("INCREMENT_CURRENT_SONG");
          this.counter = 0;
          this.incrementTimer();

          store.dispatch("PLAY_CURRENT_SONG").then(() => {
            this.unlockSongs();
          });
        }, TIME_TO_RELOAD);
      } else {
        store.commit("INCREMENT_CURRENT_SONG");
      }
    }
  }
};
</script>