import { useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import "./App.css";
import { drawFaceExpressions } from "face-api.js/build/commonjs/draw";

function App() {
  const videoRef = useRef();
  const canvasRef = useRef();
  //P-TAG USEREF
  // const ptagRef = useRef()

  //LOAD FROM USEEFFECT
  useEffect(() => {
    startVideo();
    videoRef && loadModels();
  }, []);

  //OPEN YOUR FACE WEBCAM
  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((currentStream) => {
        videoRef.current.srcObject = currentStream;
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //LOAD MODELS FROM FACE API
  const loadModels = () => {
    //THIS FOR FACE-DETECT AND LOAD FROM YOUR PUBLIC/MODELS DIRECTORY
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    ]).then(() => {
      faceMyDetect();
    });
  };

  const faceMyDetect = () => {
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      //DRAW YOUR FACE IN WEBCAM
      canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
        videoRef.current
      );
      faceapi.matchDimensions(canvasRef.current, {
        width: 940,
        height: 650,
      });
      const resized = faceapi.resizeResults(detections, {
        width: 940,
        height: 650,
      });

      faceapi.draw.drawDetections(canvasRef.current, resized);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
      faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
    }, 1000);

    //PTAG GIVING OUT EMOTIONS
    console.log(drawFaceExpressions);
  };

  return (
    <div className="myApp">
      <h1>FACE DETECTION - REACT FACE-API YOUTUBE</h1>
      <div className="appVide">
        <video crossOrigin="anonymous" ref={videoRef} autoPlay></video>
      </div>
      <canvas
        ref={canvasRef}
        width="940"
        height="650"
        className="appCanvas"
      ></canvas>
    </div>
  );
}

export default App;
