"use client";
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { load as cocoSSDLoad } from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import {renderPredictions} from '../utils/prediction-render';
let detectionInterval;

const ObjectDetector = () => {
  const [isLoad, setIsLoad] = useState(false);
  const webCamRef = useRef(null);
  const canvasRef =useRef(null);

  async function  runobjDetection(net) {
    if(  canvasRef.current !== null &&
      canvasRef.current.getContext('2d') !== null &&
      webCamRef.current !== null &&
      webCamRef.current.video.readyState === 4){
    canvasRef.current.width=webCamRef.current.video.videoWidth;
    canvasRef.current.height=webCamRef.current.video.videoHeight;
    const detectetObj = await net.detect(
      webCamRef.current.video,
      undefined,
      0.6
    );
    // console.log(detectetObj);
    const context = canvasRef.current.getContext("2d");
    renderPredictions(detectetObj, context);
    }

  }
  const stopCamera = () => {
    if (webCamRef.current !== null) {
      const videoTrack = webCamRef.current.video.srcObject.getVideoTracks()[0];
      videoTrack.stop();
    }
  };

  const showVideo = () => {
    if (webCamRef.current !== null && webCamRef.current.ready === 4) {
      const myVideoWidth = webCamRef.current.video.videoWidth;
      const myVideoHeight = webCamRef.current.video.videoHeight;
      webCamRef.current.video.width = myVideoWidth;
      webCamRef.current.video.height = myVideoHeight;
    }
  };

  const runCOCO = async () => {
    setIsLoad(true);
    const net = await cocoSSDLoad();
    setIsLoad(false);
    detectionInterval = setInterval(() => {
       runobjDetection(net)
    }, 20);
  };

  useEffect(() => {
    runCOCO();
    showVideo();
  }, []);
  return (
    <div className="">
      <h2 className="text-center mb-2">Object Detector Application</h2>
      {isLoad ? (
      
        <div>Loading AI Detector...</div>
        ) : (
          <div className="relative  flex justify-center items-center rounded-md">
          <Webcam
            ref={webCamRef}
            audio={false}
            className="rounded-md w-full lg:h-[720px]"
          ></Webcam>
          <canvas ref={canvasRef} className="absolute top-0 left-0 z-20 w-full lg:h-[720px]">

          </canvas>
          
        </div>
      )}
      <button className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md" onClick={stopCamera}>
            Stop Camera
          </button>
    </div>
  );
};

export default ObjectDetector;
