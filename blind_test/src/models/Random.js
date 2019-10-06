export function getNumbersBetweenInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getUniqueRandomIndex (tracks, LIMIT_OF_SONGS) {
  let arr = [];

  if (tracks.length > LIMIT_OF_SONGS) {
    LIMIT_OF_SONGS = tracks.length
  }

  while (arr.length < LIMIT_OF_SONGS) {
    let RANDOM_KEY = getNumbersBetweenInterval(0, tracks.length - 1);
    if (arr.indexOf(RANDOM_KEY) === -1) {
      arr.push(RANDOM_KEY);
    }
  }
  return arr;
}
