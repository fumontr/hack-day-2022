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

const ballBasesWorld: Matter.ICollisionFilter = {
  category: 0b01,
  mask: 0b01,
};

const seesawFLoorWorld: Matter.ICollisionFilter = {
  category: 0b10,
  mask: 0b10,
};

const videoConstraints = {
  width: 720,
  height: 360,
  facingMode: "user",
};

const findPosition = (poses: PosePose[], windowWidth: number) => {
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      const threshold = 0.4;
      let position = confirmPosition(pose, threshold, windowWidth);
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
let poseNet;
let count = 0;

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

export const Play = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const webcamRef = useRef<Webcam>(null);

  const [scene, setScene] = useState<Render | undefined>(undefined);
  const [currentAngle, setCurrentAngle] = useState<number>(0);
  const [bases, setBases] = useState<Body[]>([]);
  const [position, setPosition] = useState<number>(0.5);
  const [currentBall, setCurrentBall] = useState<Body>();
  const [displaySize, setDisplaySize] = useState<ContainerSize>({
    width: 0,
    height: 0,
  });

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
        Vector.create(0, (position - 0.5) * FORCE_FACTOR)
      );
    }
  }, [position]);
  const getGoalBodies = (position: ContainerSize): Body[] => {
    const { width, height } = position;
    const LINE_WIDTH = height * 0.0075;
    const coords = {
      origin: { x: 0.12, y: 0.75 },
      // origin: { x: 0.05, y: 0.2 }, // for debug
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
            console.error("failed!");
          } else if (pair.bodyB.id === floorSensor.id) {
            World.remove(globalEngine.world, pair.bodyA);
            setCurrentBall(undefined);
            console.error("failed!");
          }
          if (pair.bodyA.id === goal[1].id || pair.bodyB.id === goal[1].id) {
            console.warn("clear!");
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
      const ball = Bodies.circle(150, 0, 20, ballOption);
      setCurrentBall(ball);

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

      World.add(engine.world, [ball]);
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
        });
      };
      f();
    }
  }, [webcamRef]);

  return (
    <>
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
              Math.sin(currentAngle) * displaySize.width * (position - 0.5),
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
            style={{ height: "100%", width: "100%", objectFit: "contain" }}
          />
        </div>
      </div>
      <div style={{ zIndex: "999999", position: "absolute", top: 0, left: 0 }}>
        <button
          className="debug-btn"
          onClick={() => {
            const ball = Bodies.circle(150, 0, 20, ballOption);
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
