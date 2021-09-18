const { desktopCapturer, remote, shell, ipcRenderer } = require("electron");
const path = require("path");
const fs = require("fs");

let mediaRecorder = null;
let chunks = []

async function start() {
  if (mediaRecorder) return;

  const sources = await desktopCapturer.getSources({ types: ["screen"] });
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: "screen",
        chromeMediaSourceId: sources[0].id,
      },
    },
  });

  mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm; codecs=vp9" });
  mediaRecorder.ondataavailable = (event) => {
    event.data.size > 0 && chunks.push(event.data);
  };

  mediaRecorder.start();
  updateStatusText('录制中...')
}

function stop(){
  if(!mediaRecorder) return

  mediaRecorder.onstop = async () => {
    const blob = new Blob(chunks, { type: "video/webm" });
    const buffer = Buffer.from(await blob.arrayBuffer());
    const filePath = path.resolve(remote.app.getPath("downloads"), `${Date.now()}.webm`);

    fs.writeFile(filePath, buffer, () => {
      shell.openPath(filePath);
      mediaRecorder = null;
      chunks = []
    });
  };
  mediaRecorder.stop();
  updateStatusText('空闲')
}

function updateStatusText(text){
  const $statusElement = document.querySelector('#status')
  $statusElement.textContent = text
}

ipcRenderer.on("StartRecording", start);
ipcRenderer.on("StopRecording", stop);
