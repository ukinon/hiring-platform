"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { ChevronRight, Loader2 } from "lucide-react";
import Webcam from "react-webcam";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import Image from "next/image";

interface PhotoCaptureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCapture: (file: File) => void;
}

type HandPose = "pose1" | "pose2" | "pose3" | "complete";

interface HandPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

const HAND_POSES = [
  { id: "pose1", image: "/assets/hand-3.png", label: "Three fingers" },
  { id: "pose2", image: "/assets/hand-2.png", label: "Two fingers" },
  { id: "pose3", image: "/assets/hand-1.png", label: "One finger" },
];

const DETECTION_HOLD_MS = 250;
const POSITION_SMOOTHING = 0.35;

interface DetectionState {
  pose: string | null;
  position: HandPosition | null;
  timestamp: number;
}

const INITIAL_DETECTION_STATE: DetectionState = {
  pose: null,
  position: null,
  timestamp: 0,
};

interface MediaPipeHandResult {
  landmarks: Array<{ x: number; y: number; z: number }>;
  worldLandmarks: Array<{ x: number; y: number; z: number }>;
  handedness: string;
}

function detectHandGesture(
  hands: MediaPipeHandResult[],
  videoWidth: number,
  videoHeight: number
): {
  gesture: string | null;
  position: HandPosition | null;
} {
  if (!hands || hands.length === 0) {
    return { gesture: null, position: null };
  }

  let bestMatch: {
    gesture: string;
    hand: MediaPipeHandResult;
  } | null = null;

  for (const hand of hands) {
    const landmarks = hand.landmarks;

    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];

    const indexBase = landmarks[6];
    const middleBase = landmarks[10];
    const ringBase = landmarks[14];
    const pinkyBase = landmarks[18];

    const isFingerExtended = (
      tip: { x: number; y: number; z: number },
      base: { x: number; y: number; z: number }
    ) => tip.y < base.y;

    const indexExtended = isFingerExtended(indexTip, indexBase);
    const middleExtended = isFingerExtended(middleTip, middleBase);
    const ringExtended = isFingerExtended(ringTip, ringBase);
    const pinkyExtended = isFingerExtended(pinkyTip, pinkyBase);

    let gesture: string | null = null;

    if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
      gesture = "pose3";
    } else if (
      indexExtended &&
      middleExtended &&
      !ringExtended &&
      !pinkyExtended
    ) {
      gesture = "pose2";
    } else if (
      indexExtended &&
      middleExtended &&
      ringExtended &&
      !pinkyExtended
    ) {
      gesture = "pose1";
    }

    if (gesture) {
      bestMatch = { gesture, hand };
      break;
    }
  }

  if (!bestMatch) {
    return { gesture: null, position: null };
  }

  const landmarks = bestMatch.hand.landmarks;

  const xCoords = landmarks.map(
    (point: { x: number; y: number; z: number }) => point.x * videoWidth
  );
  const yCoords = landmarks.map(
    (point: { x: number; y: number; z: number }) => point.y * videoHeight
  );

  const minX = Math.min(...xCoords);
  const maxX = Math.max(...xCoords);
  const minY = Math.min(...yCoords);
  const maxY = Math.max(...yCoords);

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const handWidth = maxX - minX;
  const handHeight = maxY - minY;

  const boxSize = Math.max(handWidth, handHeight) * 0.6;

  const position: HandPosition = {
    x: centerX - boxSize / 2,
    y: centerY - boxSize / 2,
    width: boxSize,
    height: boxSize,
  };

  return { gesture: bestMatch.gesture, position };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function smoothPosition(
  current: HandPosition,
  previous: HandPosition | null
): HandPosition {
  if (!previous) {
    return current;
  }

  const alpha = POSITION_SMOOTHING;
  return {
    x: alpha * current.x + (1 - alpha) * previous.x,
    y: alpha * current.y + (1 - alpha) * previous.y,
    width: alpha * current.width + (1 - alpha) * previous.width,
    height: alpha * current.height + (1 - alpha) * previous.height,
  };
}

function toOverlayPosition(
  position: HandPosition,
  video: HTMLVideoElement
): HandPosition | null {
  const videoWidth = video.videoWidth;
  const videoHeight = video.videoHeight;
  const elementWidth = video.clientWidth;
  const elementHeight = video.clientHeight;

  if (!videoWidth || !videoHeight || !elementWidth || !elementHeight) {
    return null;
  }

  const scaleX = elementWidth / videoWidth;
  const scaleY = elementHeight / videoHeight;

  const scaledX = position.x * scaleX;
  const scaledY = position.y * scaleY;
  const scaledWidth = position.width * scaleX;
  const scaledHeight = position.height * scaleY;

  const adjustedWidth = Math.min(scaledWidth, elementWidth);
  const adjustedHeight = Math.min(scaledHeight, elementHeight);
  const mirroredX = elementWidth - (scaledX + adjustedWidth);

  return {
    x: clamp(mirroredX, 0, Math.max(elementWidth - adjustedWidth, 0)),
    y: clamp(scaledY, 0, Math.max(elementHeight - adjustedHeight, 0)),
    width: adjustedWidth,
    height: adjustedHeight,
  };
}

function resolveDetection({
  detection,
  video,
  lastDetection,
  now,
}: {
  detection: { gesture: string | null; position: HandPosition | null };
  video: HTMLVideoElement;
  lastDetection: DetectionState;
  now: number;
}): {
  pose: string | null;
  position: HandPosition | null;
  nextDetection: DetectionState;
} {
  if (detection.gesture && detection.position) {
    const overlayPosition = toOverlayPosition(detection.position, video);

    if (!overlayPosition) {
      return {
        pose: null,
        position: null,
        nextDetection: { pose: null, position: null, timestamp: now },
      };
    }

    const smoothed = smoothPosition(overlayPosition, lastDetection.position);

    return {
      pose: detection.gesture,
      position: smoothed,
      nextDetection: {
        pose: detection.gesture,
        position: smoothed,
        timestamp: now,
      },
    };
  }

  if (now - lastDetection.timestamp <= DETECTION_HOLD_MS) {
    return {
      pose: lastDetection.pose,
      position: lastDetection.position,
      nextDetection: lastDetection,
    };
  }

  return {
    pose: null,
    position: null,
    nextDetection: { pose: null, position: null, timestamp: now },
  };
}

export default function PhotoCaptureDialog({
  open,
  onOpenChange,
  onCapture,
}: PhotoCaptureDialogProps) {
  const webcamRef = useRef<Webcam>(null);
  const modelRef = useRef<HandLandmarker | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastDetectionRef = useRef<DetectionState>({
    ...INITIAL_DETECTION_STATE,
  });
  const [currentPose, setCurrentPose] = useState<HandPose | null>(null);
  const [detectedPose, setDetectedPose] = useState<string | null>(null);
  const [handPosition, setHandPosition] = useState<HandPosition | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCountdownActive, setIsCountdownActive] = useState(false);

  const stopHandDetection = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const disposeModel = useCallback(() => {
    if (modelRef.current) {
      modelRef.current.close();
      modelRef.current = null;
    }
  }, []);

  const loadModel = useCallback(async () => {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      const handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 2,
        minHandDetectionConfidence: 0.5,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      modelRef.current = handLandmarker;
      setIsModelLoaded(true);
    } catch (error) {
      console.error("Error loading MediaPipe hand detection model:", error);
    }
  }, []);

  const startHandDetection = useCallback(() => {
    const detectHands = async () => {
      if (
        webcamRef.current &&
        webcamRef.current.video &&
        webcamRef.current.video.readyState === 4 &&
        modelRef.current
      ) {
        const video = webcamRef.current.video;
        const now =
          typeof performance !== "undefined" ? performance.now() : Date.now();

        const results = modelRef.current.detectForVideo(video, now);

        const hands: MediaPipeHandResult[] = [];
        if (results.landmarks && results.landmarks.length > 0) {
          for (let i = 0; i < results.landmarks.length; i++) {
            hands.push({
              landmarks: results.landmarks[i],
              worldLandmarks: results.worldLandmarks?.[i] || [],
              handedness:
                results.handedness?.[i]?.[0]?.categoryName || "Unknown",
            });
          }
        }

        const detection = detectHandGesture(
          hands,
          video.videoWidth,
          video.videoHeight
        );

        const { pose, position, nextDetection } = resolveDetection({
          detection,
          video,
          lastDetection: lastDetectionRef.current,
          now,
        });

        lastDetectionRef.current = nextDetection;
        setDetectedPose(pose);
        setHandPosition(position);
      }
      animationFrameRef.current = requestAnimationFrame(detectHands);
    };

    detectHands();
  }, []);

  useEffect(() => {
    if (open) {
      loadModel();
    }
    return () => {
      stopHandDetection();
      disposeModel();
    };
  }, [open, loadModel, stopHandDetection, disposeModel]);

  useEffect(() => {
    if (open && !capturedImage && isReady && isModelLoaded) {
      setCurrentPose("pose1");
      startHandDetection();
    } else {
      stopHandDetection();
    }

    return () => {
      stopHandDetection();
    };
  }, [
    open,
    capturedImage,
    isReady,
    isModelLoaded,
    startHandDetection,
    stopHandDetection,
  ]);

  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        stopHandDetection();
        setCurrentPose("complete");
      }
    }
  }, [stopHandDetection]);

  useEffect(() => {
    if (
      !isReady ||
      !isModelLoaded ||
      capturedImage ||
      !currentPose ||
      !detectedPose ||
      isCountdownActive
    )
      return;

    if (detectedPose === currentPose) {
      let timeoutId: NodeJS.Timeout;

      if (currentPose === "pose1") {
        timeoutId = setTimeout(() => {
          setCurrentPose("pose2");
          setDetectedPose(null);
        }, 800);
      } else if (currentPose === "pose2") {
        timeoutId = setTimeout(() => {
          setCurrentPose("pose3");
          setDetectedPose(null);
        }, 800);
      } else if (currentPose === "pose3") {
        setIsCountdownActive(true);
        setCountdown(3);
      }

      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    }
  }, [
    isReady,
    isModelLoaded,
    capturedImage,
    currentPose,
    detectedPose,
    isCountdownActive,
  ]);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      capturePhoto();
      setCountdown(null);
      setIsCountdownActive(false);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, capturePhoto]);

  const handleRetake = useCallback(() => {
    setCapturedImage(null);
    setCurrentPose("pose1");
    setDetectedPose(null);
    setHandPosition(null);
    setCountdown(null);
    setIsCountdownActive(false);
    setIsReady(false);
    setIsModelLoaded(false);
    lastDetectionRef.current = { ...INITIAL_DETECTION_STATE };

    const timeoutId = setTimeout(() => {
      setIsReady(true);
      loadModel();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [loadModel]);

  const handleConfirm = () => {
    if (capturedImage) {
      fetch(capturedImage)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "photo-profile.jpg", {
            type: "image/jpeg",
          });
          onCapture(file);
          handleClose();
        });
    }
  };

  const handleClose = () => {
    setCapturedImage(null);
    setCurrentPose(null);
    setDetectedPose(null);
    setHandPosition(null);
    setCountdown(null);
    setIsCountdownActive(false);
    setIsReady(false);
    setIsModelLoaded(false);
    lastDetectionRef.current = { ...INITIAL_DETECTION_STATE };
    stopHandDetection();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-heading-m-bold">
            Raise Your Hand to Capture
          </DialogTitle>
        </DialogHeader>

        {!isModelLoaded && (
          <div className="flex items-center justify-center h-48">
            <p className="text-m-regular text-neutral-70">
              <Loader2 className="inline-block mr-2 text-primary animate-spin" />
              Loading hand detection model...
            </p>
          </div>
        )}

        {isModelLoaded && (
          <div className="space-y-4">
            <p className="text-m-regular text-neutral-70">
              {capturedImage
                ? "Review your photo."
                : "We'll take the photo once your hand pose is detected."}
            </p>

            <div className="relative aspect-video bg-neutral-20 rounded-lg overflow-hidden">
              {!capturedImage ? (
                <>
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                      facingMode: "user",
                      width: 1280,
                      height: 720,
                    }}
                    onUserMedia={() => setIsReady(true)}
                    className="w-full h-full object-cover"
                    mirrored
                  />

                  {countdown !== null ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
                      <p className="text-white text-m-regular mb-2">
                        Capturing photo in
                      </p>
                      <p className="text-white text-[120px] font-bold leading-none">
                        {countdown}
                      </p>
                    </div>
                  ) : (
                    <>
                      {handPosition && (
                        <>
                          <div
                            className="absolute border-[2px] rounded-lg pointer-events-none transition-all duration-150"
                            style={{
                              left: `${handPosition.x}px`,
                              top: `${handPosition.y}px`,
                              width: `${handPosition.width}px`,
                              height: `${handPosition.height}px`,
                              borderColor:
                                detectedPose === currentPose
                                  ? "var(--success)"
                                  : "var(--danger)",
                            }}
                          />
                          <div
                            className="absolute px-2 py-1 rounded text-white text-xs font-semibold transition-all duration-150 whitespace-nowrap"
                            style={{
                              left: `${handPosition.x}px`,
                              top: `${Math.max(handPosition.y - 25, 0)}px`,
                              backgroundColor:
                                detectedPose === currentPose
                                  ? "var(--success)"
                                  : "var(--danger)",
                            }}
                          >
                            {detectedPose === currentPose ? (
                              <>
                                {currentPose === "pose1" && "Pose 3"}
                                {currentPose === "pose2" && "Pose 2"}
                                {currentPose === "pose3" && "Pose 1"}
                              </>
                            ) : (
                              "Undetected"
                            )}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </>
              ) : (
                <Image
                  src={capturedImage}
                  alt="Captured"
                  width={1280}
                  height={720}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {!capturedImage && (
              <div>
                <p className="text-m-regular mb-4">
                  To take a picture, follow the hand poses in the order shown
                  below. The system will automatically capture the image once
                  the final pose is detected.
                </p>
                <div className="flex items-center justify-center gap-4">
                  {HAND_POSES.map((pose, index) => (
                    <div key={pose.id} className="flex items-center gap-4">
                      <div className="flex flex-col items-center justify-center w-20 h-20 bg-neutral-20 rounded-lg p-2">
                        <Image
                          src={pose.image}
                          alt={pose.label}
                          width={64}
                          height={64}
                          className="object-contain"
                        />
                      </div>
                      {index < HAND_POSES.length - 1 && (
                        <ChevronRight className="w-6 h-6 text-neutral-50" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {capturedImage && (
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={handleRetake}>
                  Retake Photo
                </Button>
                <Button onClick={handleConfirm}>Submit</Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
