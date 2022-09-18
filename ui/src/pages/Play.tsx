import {
  Engine,
  Render,
  World,
  Body,
  Bodies,
  Composite,
  Runner,
  Constraint,
  Vector,
  Events,
} from "matter-js";
import ManBack from "../assets/man_back.png";
import React, {
  Ref,
  RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Webcam from "react-webcam";
import {
  ContainerSize,
  deg2rad,
  getWidthHeightFromRef,
  rad2deg,
} from "../lib/lib";
import { default as ml5, Pose, PosePose } from "ml5";
import * as WebSocket from "websocket";
import { useLocation, useNavigate } from "react-router-dom";
import { Mode } from "../App";
import { useDisclosure } from "@chakra-ui/react";
import { BeforeStartPendingModal } from "../components/BeforeStartPendingModal";
import { SuccessModal } from "../components/SuccessModal";
import { FailureModal } from "../components/FailureModal";

const ballBasesWorld: Matter.ICollisionFilter = {
  category: 0b01,
  mask: 0b01,
};

const seesawFLoorWorld: Matter.ICollisionFilter = {
  category: 0b10,
  mask: 0b10,
};

export type Status = "Playing" | "Waiting" | "Success" | "Failure";

export type PositionInfo = {
  user_id: string;
  position_x: string;
  room_status: Status;
};

const videoConstraints = {
  width: 720,
  height: 360,
  facingMode: "user",
  frameRate: { ideal: 10, max: 10 },
};

const FRICTION_STATIC = 0;
const FRICTION = 0;
const RESTITUTION = 0;

const BALL_MASS = 100;

const SEESAW_MASS = 10000;
const SEESAW_INERTIA = 1000000;

const FORCE_FACTOR = 0.18;

let seesaw: Body;
let globalEngine: Engine;
let globalSocket: WebSocket.w3cwebsocket;
let poseNet;
let count = 0;

const THRESHOLD = 0.4;

const findPosition = (poses: PosePose[], windowWidth: number) => {
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      let position = confirmPosition(pose, THRESHOLD, windowWidth);
      // 多分このforを全部回せば複数人対応できる
      return position;
    }
  }
};

const confirmPosition = (pose: Pose, threshold: number, width: number) => {
  // 両肩
  if (
    pose.leftShoulder.confidence > threshold &&
    pose.rightShoulder.confidence > threshold
  ) {
    let center = (pose.leftShoulder.x + pose.rightShoulder.x) / 2;
    let xPersentage = center / width;
    return xPersentage;
  }
  // 両腰
  if (
    pose.leftHip.confidence > threshold &&
    pose.rightHip.confidence > threshold
  ) {
    let center = (pose.leftHip.x + pose.rightHip.x) / 2;
    let xPersentage = center / width;
    return xPersentage;
  }
  // 両膝
  if (
    pose.leftKnee.confidence > threshold &&
    pose.rightKnee.confidence > threshold
  ) {
    let center = (pose.leftKnee.x + pose.rightKnee.x) / 2;
    let xPersentage = center / width;
    return xPersentage;
  }
  // 片肩
  if (
    pose.leftShoulder.confidence > threshold &&
    pose.rightShoulder.confidence > threshold
  ) {
    let center = null;
    if (pose.leftShoulder.confidence > pose.rightShoulder.confidence) {
      center = pose.leftShoulder.x;
    } else {
      center = pose.rightShoulder.x;
    }
    let xPersentage = center / width;
    return xPersentage;
  }
  // 片腰
  if (
    pose.leftHip.confidence > threshold &&
    pose.rightHip.confidence > threshold
  ) {
    let center = null;
    if (pose.leftHip.confidence > pose.rightHip.confidence) {
      center = pose.leftHip.x;
    } else {
      center = pose.rightHip.x;
    }
    let xPersentage = center / width;
    return xPersentage;
  }
  // 片膝
  if (
    pose.leftKnee.confidence > threshold &&
    pose.rightKnee.confidence > threshold
  ) {
    let center = null;
    if (pose.leftKnee.confidence > pose.rightKnee.confidence) {
      center = pose.leftKnee.x;
    } else {
      center = pose.rightKnee.x;
    }
    let xPersentage = center / width;
    return xPersentage;
  }
  return null;
};

const ballOption = {
  restitution: RESTITUTION,
  frictionStatic: FRICTION_STATIC,
  friction: FRICTION,
  mass: BALL_MASS,
  render: {
    fillStyle: "skyblue",
  },
  collisionFilter: ballBasesWorld,
};

export type MateInfo = {
  user_id: string;
  position_x: number;
  // room_status: Status;
};

export type MatesInfo = {
  [key: string]: {
    position: string;
  };
};

function isOpen(ws: WebSocket.w3cwebsocket) {
  return ws.readyState === ws.OPEN;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const Play: React.FC<{
  myId: string | null;
  roomId: string | null;
  mode: Mode;
  setMode: (mode: Mode) => void;
}> = ({ myId, roomId, mode, setMode }) => {
  const {
    isOpen: pendingOpen,
    onOpen: onPendingOpen,
    onClose: onClosePending,
  } = useDisclosure();
  const {
    isOpen: successOpen,
    onOpen: onSuccessOpen,
    onClose: onSuccessClose,
  } = useDisclosure();
  const {
    isOpen: failureOpen,
    onOpen: onFailureOpen,
    onClose: onFailureClose,
  } = useDisclosure();

  // const { search } = useLocation();
  // const query2 = new URLSearchParams(search);
  // const roomIdFromParam = query2.get("room");
  // if (roomIdFromParam !== roomId) {
  //   // 個人モードここで実装
  //   // console.log("ざんねん！");
  //   // navigate("/");
  // }
  // if (roomId) {
  //   var searchParams = new URLSearchParams(window.location.search);
  //   searchParams.set("room", roomId);
  //   window.location.search = searchParams.toString();
  // } else {
  //   // no room, 個人プレイ mode
  // }
  // console.log(search);
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const webcamRef = useRef<Webcam>(null);

  const [scene, setScene] = useState<Render | undefined>(undefined);
  const [currentAngle, setCurrentAngle] = useState<number>(0);
  const [bases, setBases] = useState<Body[]>([]);
  const [position, setPosition] = useState<number>(0.5);
  const [currentBall, setCurrentBall] = useState<Body>();
  const [isParent, setParent] = useState(false);
  const [displaySize, setDisplaySize] = useState<ContainerSize>({
    width: 0,
    height: 0,
  });

  const [mates, setMates] = useState<MatesInfo>({});

  useEffect(() => {
    bases.forEach((base) => {
      Body.setAngle(base, currentAngle);
    });
  }, [currentAngle]);

  useEffect(() => {
    count++;
    if (position && seesaw && count == 6) {
      count = 0;
      Body.applyForce(
        seesaw as Body,
        Vector.create(0, 0),
        Vector.create(
          0,
          ((position -
            0.5 +
            Object.values(mates).reduce(
              (acc, cur) => acc + (parseFloat(cur.position) - 0.5),
              0
            )) /
            (1 + Object.values(mates).length)) *
            FORCE_FACTOR
        )
      );
    }
  }, [position]);

  const getGoalBodies = (position: ContainerSize): Body[] => {
    const { width, height } = position;
    const LINE_WIDTH = height * 0.0075;
    const coords = {
      // origin: { x: 0.14, y: 0.75 },
      origin: { x: 0.05, y: 0.2 }, // for debug
      size: { height: height * 0.07, width: height * 0.12 },
    };
    const options = {
      isStatic: true,
      render: { fillStyle: "orange" },
      collisionFilter: ballBasesWorld,
      frictionStatic: FRICTION_STATIC,
      friction: FRICTION,
      restitution: RESTITUTION,
    };
    return [
      Bodies.rectangle(
        width * coords.origin.x,
        height * coords.origin.y,
        LINE_WIDTH,
        coords.size.height,
        options
      ),
      Bodies.rectangle(
        width * coords.origin.x + coords.size.width / 2,
        height * coords.origin.y + coords.size.height - coords.size.height / 2,
        coords.size.width + LINE_WIDTH,
        LINE_WIDTH,
        options
      ),
      Bodies.rectangle(
        width * coords.origin.x + coords.size.width,
        height * coords.origin.y,
        LINE_WIDTH,
        coords.size.height,
        options
      ),
    ];
  };
  // useEffect once
  useEffect(() => {
    let socket;
    if (mode === "Together") {
      socket = new WebSocket.w3cwebsocket(
        `wss://backend-dot-hack-day-2022-362804.de.r.appspot.com/rooms/${roomId}/connect`
      );
      globalSocket = socket;
      socket.onopen = () => {
        console.log("connected");
      };
      socket.onclose = () => {
        console.log("reconnecting...");
      };
      socket.onerror = (err) => {
        console.log("connection error:", err);
      };
    }
    const engine = Engine.create({});
    globalEngine = engine;
    Events.on(engine, "beforeUpdate", () => {
      if (seesaw) {
        setCurrentAngle(seesaw.angle);
      }
    });
    if (boxRef.current && canvasRef.current) {
      const { width, height } = getWidthHeightFromRef(boxRef);
      setDisplaySize({ width, height });

      const BAR_WIDTH = width * 0.6;
      const BAR_HEIGHT = height * 0.009;

      console.log("o");
      let render = Render.create({
        element: boxRef.current,
        engine: engine,
        canvas: canvasRef.current,
        options: {
          background: "#f9fbe7",
          wireframes: false,
        },
      });
      const baseCoordinates: [x: number, y: number][] = [
        [0.45, 0.15],
        [0.55, 0.3],
        [0.45, 0.45],
        [0.55, 0.66],
      ];

      const baseObjects = baseCoordinates.map(([x, y]) => {
        return Bodies.rectangle(width * x, height * y, BAR_WIDTH, BAR_HEIGHT, {
          isStatic: true,
          render: { fillStyle: "grey" },
          collisionFilter: ballBasesWorld,
          frictionStatic: FRICTION_STATIC,
          friction: FRICTION,
          restitution: RESTITUTION,
        });
      });

      const goal = getGoalBodies({ width, height });

      const floor = Bodies.rectangle(
        width / 2,
        height - 10,
        width,
        BAR_HEIGHT,
        {
          isStatic: true,
          render: { fillStyle: "lightgrey" },
          collisionFilter: seesawFLoorWorld,
        }
      );

      const floorSensor = Bodies.rectangle(width / 2, height + 100, 100000, 1, {
        isStatic: true,
        isSensor: true,
        render: { fillStyle: "transparent" },
        collisionFilter: ballBasesWorld,
      });

      Events.on(engine, "collisionStart", function (event) {
        const pairs = event.pairs;
        for (var i = 0, j = pairs.length; i != j; ++i) {
          const pair = pairs[i];
          if (pair.bodyA.id === floorSensor.id) {
            World.remove(globalEngine.world, pair.bodyB);
            setCurrentBall(undefined);
            console.error("failed!1");
            console.log(mode);
            if (mode === "Alone") {
              // @ts-ignore
              window.mode = "AloneFailure";
              setMode("AloneFailure");
            } else if (mode === "Together") {
              setMode("TogetherFailure");
            } else {
              console.error("ありえな1");
              setMode("AloneFailure");
              // navigate("/");
            }
          } else if (pair.bodyB.id === floorSensor.id) {
            World.remove(globalEngine.world, pair.bodyA);
            setCurrentBall(undefined);
            console.error("failed!2");
            if (mode === "Alone") {
              setMode("AloneFailure");
            } else if (mode === "Together") {
              setMode("TogetherFailure");
            } else {
              console.error("ありえな2");
              setMode("AloneFailure");
              // navigate("/");
            }
          }
          if (pair.bodyA.id === goal[1].id || pair.bodyB.id === goal[1].id) {
            console.warn("clear!");
            if (mode === "Alone") {
              setMode("AloneSuccess");
            } else if (mode === "Together") {
              setMode("TogetherSuccess");
            } else {
              console.error("ありえな3");
              setMode("AloneSuccess");
              // navigate("/");
            }
          }
        }
      });

      const seesawStick = Bodies.rectangle(
        width / 2,
        height * 0.9,
        width * 0.85,
        height * 0.015,
        {
          render: { fillStyle: "gold" },
          collisionFilter: seesawFLoorWorld,
          mass: SEESAW_MASS,
          inertia: SEESAW_INERTIA,
        }
      );
      Body.setAngle(seesawStick, deg2rad(0));
      seesaw = seesawStick;
      setBases(baseObjects);

      // TODO: 割合でやる
      // const ball = Bodies.circle(width * 0.2, 0, height * 0.03, ballOption);
      // setCurrentBall(ball);

      Composite.add(engine.world, [
        ...baseObjects,
        floor,
        floorSensor,
        seesawStick,
        Constraint.create({
          bodyA: seesawStick,
          pointB: Vector.clone(seesawStick.position),
          stiffness: 1,
          length: 0,
        }),
      ]);
      Composite.add(engine.world, goal);

      // World.add(engine.world, [ball]);
      Render.run(render);
      const runner = Runner.create();
      Runner.run(runner, engine);
      setScene(render);
    }
  }, []);

  useEffect(() => {
    if (scene && boxRef.current) {
      const { width, height } = displaySize;
      // Dynamically update canvas and bounds
      scene.bounds.max.x = width;
      scene.bounds.max.y = height;
      scene.options.width = width;
      scene.options.height = height;
      scene.canvas.width = width;
      scene.canvas.height = height;
    }
  }, [scene]);

  useEffect(() => {
    if (webcamRef.current) {
      const modelLoaded = () => {
        if (!webcamRef.current?.video) return;
        const { width, height } = videoConstraints;
        webcamRef.current.video.width = width;
        webcamRef.current.video.height = height;
        const detectionInterval = setInterval(() => {
          return () => {
            if (detectionInterval) {
              clearInterval(detectionInterval);
            }
          };
        }, 200);
      };
      const f = async () => {
        poseNet = await ml5.poseNet(
          webcamRef.current?.video,
          "single",
          modelLoaded
        );
        poseNet.on("pose", function (poses: PosePose[]) {
          let position = findPosition(poses, videoConstraints.width);
          setPosition(position ?? 0.5);
          if (
            mode === "Together" &&
            myId &&
            position &&
            globalSocket
            // !isOpen(globalSocket)
          ) {
            const info: PositionInfo = {
              user_id: myId,
              position_x: position.toString() ?? "0.5",
              room_status: "Playing",
            };
            globalSocket.send(JSON.stringify(info));
            // console.log("sending!");
          }
        });
        if (mode === "Together") {
          await sleep(1000);
          globalSocket.onmessage = (msg: WebSocket.IMessageEvent) => {
            const data = JSON.parse(msg.data.toString()) as PositionInfo;
            // console.log(data);
            if (data.user_id !== myId) {
              // mates
              const _mates: MatesInfo = JSON.parse(JSON.stringify(mates));
              if (_mates[data.user_id]) {
                _mates[data.user_id].position = data.position_x;
              } else {
                _mates[data.user_id] = { position: data.position_x };
              }
              setMates(_mates);
            }
          };
        }
      };
      f();
    }
  }, [webcamRef]);
  const navigate = useNavigate();
  useEffect(() => {
    if (mode === "Alone" || mode === "Together") {
      const ball = Bodies.circle(
        displaySize.width * 0.2,
        0,
        displaySize.height * 0.03,
        ballOption
      );
      World.add(globalEngine.world, [ball]);
      setCurrentBall(ball);
    } else if (mode === "None") {
      console.log("hihi");
      navigate("/");
    }
  }, [mode]);

  return (
    <>
      <BeforeStartPendingModal
        pendingOpen={mode === "AlonePending" || mode === "TogetherPending"}
        setMode={setMode}
        mode={mode}
        onClosePending={onClosePending}
        setParent={setParent}
      />
      <SuccessModal
        successOpen={mode === "AloneSuccess" || mode === "TogetherSuccess"}
        onSuccessClose={onSuccessClose}
        mode={mode}
        setMode={setMode}
      />
      <FailureModal
        failureOpen={mode === "AloneFailure" || mode === "TogetherFailure"}
        onFailureClose={onFailureClose}
        mode={mode}
        setMode={setMode}
      />
      <div
        ref={boxRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <canvas
          id="mainCanvas"
          ref={canvasRef}
          style={{ zIndex: 10, position: "relative" }}
        />
        <div
          className="me"
          style={{
            position: "absolute",
            bottom:
              displaySize.height * 0.1 +
              (document.body.clientHeight - displaySize.height) / 2 +
              Math.sin(currentAngle) * displaySize.width * (position - 0.5),
            // ポジションの正規化しようとしたけどできてない
            left: `${
              Math.round(
                ((document.body.clientWidth - displaySize.width) / 2 +
                  displaySize.width / 2 +
                  (0.5 - position) * displaySize.width) *
                  1
              ) / 1
            }px`,
            height: "80px",
            transform: "translateX(-50%)",
            zIndex: "99999",
          }}
        >
          <img
            src={ManBack}
            alt=""
            style={{
              height: "100%",
              width: "100%",
              objectFit: "contain",
              opacity: position !== 0.5 ? "1" : "0.3",
            }}
          />
        </div>
        {Object.values(mates).map((mate) => {
          return (
            <div
              className="people"
              style={{
                position: "absolute",
                bottom:
                  displaySize.height * 0.1 +
                  (document.body.clientHeight - displaySize.height) / 2 +
                  Math.sin(currentAngle) *
                    displaySize.width *
                    (parseFloat(mate.position) - 0.5),
                // ポジションの正規化しようとしたけどできてない
                left: `${
                  Math.round(
                    ((document.body.clientWidth - displaySize.width) / 2 +
                      displaySize.width / 2 +
                      (0.5 - parseFloat(mate.position)) * displaySize.width) *
                      1
                  ) / 1
                }px`,
                height: "70px",
                transform: "translateX(-50%)",
                zIndex: "99999",
              }}
            >
              <img
                src={ManBack}
                alt=""
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "contain",
                  opacity: position !== 0.5 ? "0.6" : "0.3",
                }}
              />
            </div>
          );
        })}
      </div>
      <div style={{ zIndex: "999999", position: "absolute", top: 0, left: 0 }}>
        <button
          className="debug-btn"
          onClick={() => {
            const ball = Bodies.circle(
              displaySize.width * 0.2,
              0,
              displaySize.height * 0.03,
              ballOption
            );

            World.add(globalEngine.world, [ball]);
            setCurrentBall(ball);
          }}
        >
          add ball
        </button>
      </div>
      <div
        className="cameraContainer"
        style={{
          zIndex: "99999",
          position: "absolute",
          right: 0,
        }}
      >
        <Webcam
          style={{ transform: "scale(0.2)" }}
          audio={false}
          width={200}
          height={100}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          mirrored
        />
      </div>
    </>
  );
};
