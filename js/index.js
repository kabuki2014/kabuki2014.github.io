const regexp = /(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))([^\?&"'>]+)/;

const inputField = document.getElementById("url-input");
const startField = document.getElementById("start-input");
const endField = document.getElementById("end-input");
let ytPlayer = document.getElementById("yt-player");
const playerContainer = document.getElementById("player-container");
const urlOutput = document.getElementById("url-output");
const movingRow = document.getElementById("moving-row");

inputField.focus();
let videoId;

function determineVideoId() {
  const match = inputField.value.match(regexp);
  if (!match) return undefined;
  const id = match[5];
  return id;
}

function handleTimeInputBlur() {
  ytplayer.loadVideoById({
    videoId: ytplayer.getVideoData()['video_id'],
    startSeconds: startField.value,
    endSeconds: endField.value,
  });
  outputUrl();
}

function onYouTubeIframeAPIReady() {
  ytplayer = new YT.Player('yt-player', {
    playerVars: { 'autoplay': 1 },
  });
  ytplayer.tabIndex = -1;
}

function resetTimeInputs() {
  startField.value = 0;
  const interval = setInterval(function() {
    const duration = ytplayer.getDuration();
    if (duration !== 0) {
      clearInterval(interval);
      endField.value = parseInt(duration);
    }
  }, 100);
}

function showTimes() {
  startField.style.display = "inline-block";
  endField.style.display = "inline-block";
}

function showVideoPlayer() {
  movingRow.classList.remove('active');
  const videoUrl = inputField.value;
  const videoId = videoUrl.match(regexp)[5];
  playerContainer.style.display = "inline-block";
  ytplayer.loadVideoById(videoId);
  //const src = 'http://www.youtube.com/embed/' + videoId + '?autoplay=1';

}

function constructUrl() {
  let url = 'http://www.youtube.com/embed/' + videoId + '?';
  if (startField.value !== '') {
    url += 'start=' + startField.value;
  }
  if (endField.value !== '') {
    if (startField.value !== '') {
      url += '&';
    }
    url += 'end=' + endField.value;
  }
  return url;
}

function outputUrl() {
  // https://www.youtube.com/embed/chElHV99xak?start=53&end=59
  if (videoId === undefined) return;
  const url = constructUrl();
  inputField.value = url;
  inputField.style.direction = 'rtl';
}

inputField.addEventListener('input', function(){
  inputField.style.direction = 'ltr';
  videoId = determineVideoId();
  if (videoId === undefined) return;
  showVideoPlayer();
  showTimes();
});

startField.addEventListener('input', handleTimeInputBlur);
endField.addEventListener('input', handleTimeInputBlur);
