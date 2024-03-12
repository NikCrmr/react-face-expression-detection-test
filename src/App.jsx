import { useRef, useEffect, useState } from "react";
import "./App.css";
import * as faceapi from "face-api.js";
import { nanoid } from "nanoid";
// import { averageEmotions } from "../components/AverageEmotionValue";
// import { averageEmotionsRounded } from "../components/AverageEmotionValue";
import EmotionAnalysisComponent from "../components/AverageEmotion";

function App() {
  // const [emotions, setEmotions] = useState([]);
  const [emotionsArray, setEmotionsArray] = useState([]);
  const videoRef = useRef();
  const canvasRef = useRef();
  //EXPRESSION REF
  const expressionsRef = useRef({});

  // LOAD FROM USEEFFECT
  useEffect(() => {
    startVideo();
    videoRef && loadModels();
  }, []);

  // OPEN YOU FACE WEBCAM
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
  // LOAD MODELS FROM FACE API

  const loadModels = () => {
    Promise.all([
      // THIS FOR FACE DETECT AND LOAD FROM YOU PUBLIC/MODELS DIRECTORY
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

      //SAVE TO ARRAY OF 20 objects
      if (detections.length > 0) {
        const expressions = detections[0].expressions;
        expressionsRef.current = expressions;
        // Use the functional form of setEmotionsArray to correctly update based on the previous state
        setEmotionsArray((prevEmotionsArray) => {
          const newEmotionsArray = [
            ...prevEmotionsArray.slice(-20 + 1),
            {
              id: nanoid(),
              experiences: expressions,
            },
          ];
          return newEmotionsArray;
        });
        expressionsRef.current = expressions;
      }

      // DRAW YOU FACE IN WEBCAM
      canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(
        videoRef.current
      );
      faceapi.matchDimensions(canvasRef.current, {
        width: 846,
        height: 585,
      });

      const resized = faceapi.resizeResults(detections, {
        width: 846,
        height: 585,
      });

      faceapi.draw.drawDetections(canvasRef.current, resized);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
      faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
    }, 1000);
  };
  console.log("emotionArray", emotionsArray);
  // console.log("averageEmotions", averageEmotions);
  // console.log("averageEmotionsRounded", averageEmotionsRounded);
  return (
    <div className="myapp">
      <h1>Emotion Detection</h1>
      <div className="appvide">
        <video crossOrigin="anonymous" ref={videoRef} autoPlay></video>
      </div>
      <canvas ref={canvasRef} width="940" height="650" className="appcanvas" />
      <div className="emotionsBox">
        {/* Display each key-value pair in a separate <span> */}
        {Object.keys(expressionsRef.current).map((key) => (
          <span className="keyValueSpan" key={nanoid()}>
            {key}: {expressionsRef.current[key]},{" "}
          </span>
        ))}
      </div>
      <EmotionAnalysisComponent data={emotionsArray} />
    </div>
  );
}

export default App;
