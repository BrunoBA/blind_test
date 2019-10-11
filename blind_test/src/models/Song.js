import { 
  LISTEN_LIMIT_SECONDS,
  MIN_SECONDS,
  VOLUME
} from "../models/Constants";

class Song {
  constructor(url, currentTime = MIN_SECONDS, volume = VOLUME) {
    this.audio = new Audio(url)
    this.audio.volume = volume
    this.audio.currentTime = currentTime
  }

  play() {
    return new Promise (resolve => {
      this.audio.play()
      setTimeout(() => {
        this.audio.pause()
        resolve()
      }, LISTEN_LIMIT_SECONDS * 1000)
    })
  }
}

export default Song