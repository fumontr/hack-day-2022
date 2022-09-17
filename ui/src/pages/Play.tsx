import {
  Engine,
  Render,
  World,
  Body,
  Bodies,
  Composite,
  Runner,
} from "matter-js";
import React, {
  Ref,
  RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { deg2rad } from "../lib/lib";

export interface ContainerSize {
  width: number;
  height: number;
}

window.rotate = Body.rotate;

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
  const [bases, setBases] = useState<Matter.Body[]>([]);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    const engine = Engine.create({});
    // fitScreen(boxRef);
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
    if (boxRef.current && canvasRef.current) {
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
      const BAR_WIDTH = width * 0.6;
      const BAR_HEIGHT = 3;
      const base1 = Bodies.rectangle(
        width * 0.85,
        height * 0.1,
        BAR_WIDTH,
        BAR_HEIGHT,
        {
          isStatic: true,
          render: { fillStyle: "#060a19" },
        }
      );
      const base2 = Bodies.rectangle(
        width * 0.15,
        height * 0.2,
        BAR_WIDTH,
        BAR_HEIGHT,
        {
          isStatic: true,
          render: { fillStyle: "#060a19" },
        }
      );
      const base3 = Bodies.rectangle(
        width * 0.85,
        height * 0.4,
        BAR_WIDTH,
        BAR_HEIGHT,
        {
          isStatic: true,
          render: { fillStyle: "#060a19" },
        }
      );
      const base4 = Bodies.rectangle(
        width * 0.15,
        height * 0.6,
        BAR_WIDTH,
        BAR_HEIGHT,
        {
          isStatic: true,
          render: { fillStyle: "#060a19" },
        }
      );
      const nanawariLine = Bodies.rectangle(
        width / 2,
        height * 0.7,
        width,
        BAR_HEIGHT,
        {
          isStatic: true,
          render: { fillStyle: "grey" },
        }
      );

      setBases([base1, base2, base3, base4]);

      const ball = Bodies.circle(150, 0, 20, {
        restitution: 0.9,
        render: {
          fillStyle: "skyblue",
        },
      });
      Composite.add(engine.world, [base1, base2, base3, base4, nanawariLine]);
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
            window.rotate(bases[0], 0.1);
            window.rotate(bases[1], 0.1);
            window.rotate(bases[2], 0.1);
            window.rotate(bases[3], 0.1);
          }}
        >
          +
        </button>
        <button
          className="debug-btn"
          onClick={() => {
            window.rotate(bases[0], -0.1);
            window.rotate(bases[1], -0.1);
            window.rotate(bases[2], -0.1);
            window.rotate(bases[3], -0.1);
          }}
        >
          -
        </button>
      </div>
    </>
  );
};
