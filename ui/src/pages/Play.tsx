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
import React, {
  Ref,
  RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Webcam from "react-webcam";
import { deg2rad, rad2deg } from "../lib/lib";
import { default as ml5, Pose, PosePose } from "ml5";

export interface ContainerSize {
  width: number;
  height: number;
}

function findPositon(poses: PosePose[], windowWidth: number) {
  // console.log(poses);
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      const threshold = 0.4;
      let position = confirmPosition(pose, threshold, windowWidth);
      // 多分このforを全部回せば複数人対応できる
      return position;
    }
  }
}

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

// @ts-ignore
// window.rotate = Body.rotate;
// @ts-ignore
window.setAngle = Body.setAngle;

let seesaw: Body;
let globalEngine: Engine;
let poseNet;
let count = 0;

export const Play = (myId) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef(null);
  const [containerSize, setContainerSize] = useState<ContainerSize | undefined>(
    undefined
  );
  const [scene, setScene] = useState<Render | undefined>(undefined);
  const [currentAngle, setCurrentAngle] = useState<number>(0);
  const [bases, setBases] = useState<Body[]>([]);
  const [rendered, setRendered] = useState(false);
  const [position, setPosition] = useState<number>(0.5);

  useEffect(() => {
    console.log(myId)
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
        Vector.create(0, (position - 0.5) / 10)
      );
    }
  }, [position]);

  // useEffect once
  useEffect(() => {
    const engine = Engine.create({});
    globalEngine = engine;
    Events.on(engine, "beforeUpdate", () => {
      if (seesaw) {
        setCurrentAngle(seesaw.angle);
      }
    });
    if (boxRef.current && canvasRef.current && !rendered) {
      const clientWidth = boxRef.current.clientWidth;
      const clientHeight = boxRef.current.clientHeight;
      let width = 0;
      let height = 0;
      if (clientHeight > (clientWidth * 3) / 4) {
        width = clientWidth;
        height = clientWidth * (3 / 4);
      } else {
        height = clientHeight;
        width = clientHeight * (4 / 3);
      }
      console.log("o");
      setRendered(true);
      let render = Render.create({
        element: boxRef.current,
        engine: engine,
        canvas: canvasRef.current,
        options: {
          background: "rgba(255, 0, 0, 0.5)",
          wireframes: false,
        },
      });
      console.log({ width, height });
      const BAR_WIDTH = width * 0.5;
      const BAR_HEIGHT = 3;
      const baseCoordinates: [x: number, y: number][] = [
        [0.6, 0.1],
        [0.4, 0.2],
        [0.6, 0.4],
        [0.4, 0.5],
      ];
      const baseObjects = baseCoordinates.map(([x, y]) => {
        return Bodies.rectangle(width * x, height * y, BAR_WIDTH, BAR_HEIGHT, {
          isStatic: true,
          render: { fillStyle: "#060a19" },
        });
      });
      const seesawGroup = Body.nextGroup(true);
      const floor = Bodies.rectangle(
        width / 2,
        height - 10,
        width,
        BAR_HEIGHT,
        {
          isStatic: true,
          render: { fillStyle: "tomato" },
          collisionFilter: { group: seesawGroup },
        }
      );

      // var catapult = Bodies.rectangle(400, 520, 320, 20, { collisionFilter: { group: group } });
      const catapult = Bodies.rectangle(
        width / 2,
        height * 0.9,
        width * 0.85,
        10,
        {
          render: { fillStyle: "gold" },
          collisionFilter: { group: seesawGroup },
        }
      );
      Body.setAngle(catapult, deg2rad(0));
      // setSeesaw(catapult);
      seesaw = catapult;
      setBases(baseObjects);

      const ball = Bodies.circle(150, 0, 20, {
        restitution: 0.9,
        render: {
          fillStyle: "skyblue",
        },
      });
      Composite.add(engine.world, [
        ...baseObjects,
        floor,
        catapult,
        Constraint.create({
          bodyA: catapult,
          pointB: Vector.clone(catapult.position),
          stiffness: 1,
          length: 0,
        }),
      ]);
      World.add(engine.world, [ball]);

      Render.run(render);
      // create runner
      var runner = Runner.create();
      // run the engine
      Runner.run(runner, engine);
      // Runner.run(engine);
      setScene(render);
    }
  }, []);

  useEffect(() => {
    if (scene && boxRef.current) {
      const clientWidth = boxRef.current.clientWidth;
      const clientHeight = boxRef.current.clientHeight;
      let width, height;
      if (clientHeight > (clientWidth * 3) / 4) {
        width = clientWidth;
        height = clientWidth * (3 / 4);
      } else {
        height = clientHeight;
        width = clientHeight * (4 / 3);
      }
      console.log("a");
      // Dynamically update canvas and bounds
      scene.bounds.max.x = width;
      scene.bounds.max.y = height;
      scene.options.width = width;
      scene.options.height = height;
      scene.canvas.width = width;
      scene.canvas.height = height;
    }
  }, [scene]);

  const webcamRef = useRef<Webcam>(null);
  const videoConstraints = {
    width: 720,
    height: 360,
    facingMode: "user",
  };

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
          let position = findPositon(poses, videoConstraints.width);
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
          border: "2px solid blue",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <canvas id="mainCanvas" ref={canvasRef} style={{ zIndex: 10 }} />
      </div>
      <div style={{ zIndex: "99999", position: "absolute", top: 0, left: 0 }}>
        <button
          className="debug-btn"
          onClick={() => {
            const ball = Bodies.circle(150, 0, 20, {
              restitution: 0.9,
              render: {
                fillStyle: "skyblue",
              },
            });
            World.add(globalEngine.world, [ball]);
          }}
        >
          -
        </button>
        <button
          className="debug-btn"
          onClick={() => {
            Body.applyForce(
              seesaw as Body,
              Vector.create(0, 0),
              Vector.create(0, -0.01)
            );
          }}
        >
          seesaw+
        </button>
        <button
          className="debug-btn"
          onClick={() => {
            Body.applyForce(
              seesaw as Body,
              Vector.create(0, 0),
              Vector.create(0, 0.01)
            );
          }}
        >
          seesaw-
        </button>
        <p style={{ background: "pink", border: "2px solid red" }}>
          {/* {position} */}
          {Math.round(position * 100) / 100 ? (
            1 - Math.round(position * 100) / 100
          ) : (
            <span style={{ fontSize: "36px" }}>out of range!!</span>
          )}
        </p>
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
