const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullscreen = document.getElementById("fullscreen");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");
const playIconBtn = playBtn.querySelector("i");
const muteIconBtn = muteBtn.querySelector("i");
const fullscreenBtn = fullscreen.querySelector("i");

let volumeValue = 0.5;
let controlsTimeout = null;
let controlsMovementTimeout = null;
video.volume = volumeValue;

const handlePlayClick = (e) => {
  //비디오가 재생중이면 중지, 비디오가 중지상태면 재생
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playIconBtn.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMute = (e) => {
  //비디오가 Mute 상태면 Unmute, 비디오가 Unmute상태면 Mute
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteIconBtn.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;
  console.log(value);
  if (video.muted) {
    //음소거 상태라면
    video.muted = false;
    muteBtn.innerText = "Mute";
  }
  if (!video.muted && parseFloat(value) === 0) {
    video.muted = true;
    muteBtn.innerText = "Unmute";
  } //음소거 상태가 아닌데 소리가 0이 되는 경우

  volumeValue = value; //글로벌 값 수정
  video.volume = value; //비디오 볼륨 설정
};

const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(11, 8);
const handlePause = () => (playIconBtn.classList = "fas fa-play");
const handlePlay = () => (playIconBtn.classList = "fas fa-pause");
const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
  console.log("totaltime은", timeline.max);
};
const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
  console.log("currentTime은", currentTime.innerText);
};

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleFullscreen = () => {
  const screen = document.fullscreenElement;
  if (screen) {
    //전체화면일 경우
    fullscreenBtn.classList = "fas fa-expand";
    document.exitFullscreen();
  } else {
    fullscreenBtn.classList = "fas fa-compress";
    videoContainer.requestFullscreen();
  }
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
};

const handleEnded = () => {
  playIconBtn.classList = "fas fa-play";
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, {
    method: "POST",
  });
};

if (video.readyState === 4) {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
}
video.addEventListener("loadedmetadata", handleLoadedMetadata);
playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
timeline.addEventListener("input", handleTimelineChange);
fullscreen.addEventListener("click", handleFullscreen);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
video.addEventListener("click", handlePlayClick);
