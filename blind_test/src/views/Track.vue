<template>
  <div class="row">
    <div class="col-12">
      <button @click="nextSong()" class="btn btn-success">
        <b>Next Song {{fixedTimeout}}</b>
        <i class="ml-1 fa fa-forward" aria-hidden="true"></i>
      </button>
      <br />
      <button @click="takeTheTime()" class="btn btn-danger mt-4">
        <b>Bet</b>
      </button>
      <br />
      <span class="text-white" v-if="timeToSelect != 0">
        <b>Song selected in {{timeToSelect}}</b>
      </span>
    </div>
  </div>
</template>
<script>
import store from "../store";
import router from "../router";

export default {
  data() {
    return {
      timer: 30,
      timeToSelect: 0,
      track: null
    };
  },
  mounted() {
    this.timeout();
    store.dispatch("GET_TRACKS", router.currentRoute.params.id).then(res => {
      let randomNumber = this.getRndInteger(0, res.data.length - 1);
      this.loadAudio(res.data[randomNumber].track);
    });
  },
  computed: {
    fixedTimeout() {
      if (this.timer > 0) return this.timer;
      return 0;
    }
  },
  methods: {
    getRndInteger(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    loadAudio(audio) {
      setTimeout(() => {
        this.timer = 30;
        this.track = new Audio(audio.preview_url);
        this.track.volume = 0.5;
        this.track
          .play()
          .then(song => {
            console.log(`"${audio.name}" loaded!`);
          })
          .catch(err => {
            console.log(`Error to load (${audio.name})`);
            console.log(err);
          });
      }, 500);
    },
    timeout() {
      setInterval(() => {
        this.timer = this.timer - 1;
      }, 1000);
    },
    nextSong() {
      let randomNumber = this.getRndInteger(0, store.state.tracks.length - 1);
      this.loadAudio(store.state.tracks[randomNumber].track);
    },
    takeTheTime() {
      this.timeToSelect = this.fixedTimeout;
    }
  }
};
</script>