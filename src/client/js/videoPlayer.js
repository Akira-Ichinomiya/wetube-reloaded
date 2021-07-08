const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");

let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = (e) => {
  //비디오가 재생중이면 중지, 비디오가 중지상태면 재생
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtn.innerText = video.paused ? "Play" : "Pause";
};

const handleMute = (e) => {
  //비디오가 Mute 상태면 Unmute, 비디오가 Unmute상태면 Mute
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtn.innerText = video.muted ? "Unmute" : "Mute";
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

const handlePause = () => (playBtn.innerText = "Play");
const handlePlay = () => (playBtn.innerText = "Pause");

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
