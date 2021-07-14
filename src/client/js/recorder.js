import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumb: "thumbnail.jpg",
};

const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
};

const handleStart = () => {
  actionBtn.innerText = "Recording";
  actionBtn.disabled = true;
  actionBtn.removeEventListener("click", handleStart);
  // actionBtn.addEventListener("click", handleStop);
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (e) => {
    console.log(e.data);
    videoFile = URL.createObjectURL(e.data);
    console.log(videoFile);
    video.srcObject = null; //녹화 완료시 미리보기 화면 없애고 녹화한 파일 보여주기
    video.src = videoFile;
    video.play();
    actionBtn.innerText = "Download";
    actionBtn.disabled = false;
    actionBtn.addEventListener("click", handleDownload);
  };
  recorder.start();
  setTimeout(() => {
    recorder.stop();
  }, 5000);
};

const handleDownload = async () => {
  actionBtn.removeEventListener("click", handleDownload);
  actionBtn.innerText = "Downloading...";
  actionBtn.disabled = true;

  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load(); //ffmpeg 설정

  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile)); //변환 세팅
  await ffmpeg.run("-i", files.input, "-r", "60", files.output); //변환 시작
  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    files.thumb
  );

  const mp4File = ffmpeg.FS("readFile", files.output); //변환한 파일읽기
  const thumbFile = ffmpeg.FS("readFile", files.thumb); //변환한 파일읽기

  console.log(mp4File);
  console.log(mp4File.buffer);

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" }); //이진파일
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpeg" }); //이진파일

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  downloadFile(mp4Url, files.output);
  downloadFile(thumbUrl, files.thumb);

  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumb);
  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(videoFile);

  actionBtn.removeEventListener("click", handleDownload);
  actionBtn.innerText = "Start Recording";
  actionBtn.addEventListener("click", handleStart);
  actionBtn.disabled = false;
};

// const handleStop = () => {
//   actionBtn.innerText = "Download Recording";
//   actionBtn.removeEventListener("click", handleStop);
//   actionBtn.addEventListener("click", handleDownload);

//   recorder.stop();
// };

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    //마이크, 카메라 접근설정
    audio: true,
    video: {
      width: 1024,
      height: 576,
    },
  });
  video.srcObject = stream;
  video.loop = true;
  video.play();
};

init();

actionBtn.addEventListener("click", handleStart);
