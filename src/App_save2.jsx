import { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import "./App.css";
import { nanoid } from "nanoid";

function App() {
  // const [emotions, setEmotions] = useState([]);
  const [emotionsArray, setEmotionsArray] = useState([]);

  const videoRef = useRef();
  const canvasRef = useRef();
  //EXPRESSION REF
  const expressionsRef = useRef({});

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
      // console.log("detections", detections);
      // setEmotions(detections[0].expressions);
      // save last 30sec Emotions
      // setEmotionsArray([
      //   ...emotionsArray,
      //   {
      //     id: nanoid(),
      //     experiences: detections[0].expressions,
      //   },
      // ]);
      // End save last 30sec Emotions
      //DRAW YOUR FACE IN WEBCAM
      // canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
      //   videoRef.current
      // );
      const canvas = faceapi.createCanvasFromMedia(videoRef.current);
      canvasRef.current.innerHTML = ""; // Clear previous content
      canvasRef.current.appendChild(canvas);

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
  };
  console.log("emotionArray", emotionsArray);

  const handleEmotionValue = (emotion) => {
    console.log("emotion", emotion);
  };
  handleEmotionValue(emotionsArray[1].expressions);

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
      <div className="emotionsBox">
        {/* Display each key-value pair in a separate <span> */}
        {Object.keys(expressionsRef.current).map((key) => (
          <span className="keyValueSpan" key={nanoid()}>
            {key}: {expressionsRef.current[key]},{" "}
          </span>
        ))}
      </div>
    </div>
  );
}

export default App;
