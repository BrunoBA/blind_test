import { 
  LISTEN_LIMIT_SECONDS,
  MIN_SECONDS,
  VOLUME
} from "../models/Constants";

class Song {
  constructor(url, interval = MIN_SECONDS, volume = VOLUME) {
    this.interval = interval
    this.audio = new Audio(url)
    this.audio.volume = volume
  }

  play() {
    new Promise (function(resolve) {
      this.audio.play()
      setTimeout(() => {
        this.pause()
        resolve()
      }, LISTEN_LIMIT_SECONDS * 1000)
    })
  }
}

export default Song