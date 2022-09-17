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
import { deg2rad, rad2deg } from "../lib/lib";

export interface ContainerSize {
  width: number;
  height: number;
}

// @ts-ignore
// window.rotate = Body.rotate;
// @ts-ignore
window.setAngle = Body.setAngle;

let seesaw: Body;
let globalEngine: Engine;

export const Play = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef(null);
  const [containerSize, setContainerSize] = useState<ContainerSize | undefined>(
    undefined
  );
  const [scene, setScene] = useState<Render | undefined>(undefined);
  const [currentAngle, setCurrentAngle] = useState<number>(0);
  const STATIC_DENSITY = 15;
  // const [engine] = useState(Engine.create({}));
  const [bases, setBases] = useState<Body[]>([]);
  const [rendered, setRendered] = useState(false);
  // const [seesaw, setSeesaw] = useState<Body>();

  useEffect(() => {
    bases.forEach((base) => {
      Body.setAngle(base, currentAngle);
    });
  }, [currentAngle]);

  useEffect(() => {
    const engine = Engine.create({});
    globalEngine = engine;
    Events.on(engine, "beforeUpdate", () => {
      if (seesaw) {
        setCurrentAngle(seesaw.angle);
      }
    });

    // fitScreen(boxRef);
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
      </div>
    </>
  );
};
