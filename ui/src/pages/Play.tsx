import Matter, {
  Engine,
  Render,
  World,
  Body,
  Bodies,
  Composite,
  Runner,
} from "matter-js";
import React, { Ref, RefObject, useEffect, useRef, useState } from "react";

export interface ContainerSize {
  width: number;
  height: number;
}

export const Play = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef(null);
  const [containerSize, setContainerSize] = useState<ContainerSize | undefined>(
    undefined
  );
  const [scene, setScene] = useState<Render | undefined>(undefined);
  const STATIC_DENSITY = 15;

  const fitScreen = (boxRef: RefObject<HTMLDivElement>) => {
    if (!boxRef?.current) return;
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
    setContainerSize({ width, height });
  };

  const rowsFactory = ({ width, height }: ContainerSize): Body[] => {
    return [];
  };

  const floor = Bodies.rectangle(0, 0, 0, 100, {
    isStatic: true,
    render: {
      fillStyle: "blue",
    },
  });
  const wall1 = Bodies.rectangle(100, 200, 400, 20, {
    isStatic: true,
    angle: Math.PI * 0.06,
    render: { fillStyle: "#060a19" },
  });

  useEffect(() => {
    if (boxRef.current && canvasRef.current) {
      let engine = Engine.create({});
      let render = Render.create({
        element: boxRef.current,
        engine: engine,
        canvas: canvasRef.current,
        options: {
          background: "rgba(255, 0, 0, 0.5)",
          wireframes: false,
        },
      });

      // const floor = Bodies.rectangle(0, 0, 0, 100, {
      //   isStatic: true,
      //   render: {
      //     fillStyle: "blue",
      //   },
      // });

      const ball = Bodies.circle(150, 0, 20, {
        restitution: 0.9,
        render: {
          fillStyle: "skyblue",
        },
      });
      Composite.add(engine.world, [
        wall1,
        // Bodies.rectangle(300, 560, 600, 20, {
        //   isStatic: true,
        //   angle: Math.PI * 0.04,
        //   render: { fillStyle: "#060a19" },
        // }),
        // Bodies.rectangle(500, 350, 650, 20, {
        //   isStatic: true,
        //   angle: -Math.PI * 0.06,
        //   render: { fillStyle: "#060a19" },
        // }),
      ]);

      World.add(engine.world, [floor, ball]);

      Runner.run(engine);
      Render.run(render);

      fitScreen(boxRef);
      setScene(render);
    }
    return () => {
      // cleanup here
    };
  }, []);

  useEffect(() => {
    if (containerSize && scene) {
      let { width, height } = containerSize;
      // Dynamically update canvas and bounds
      scene.bounds.max.x = width;
      scene.bounds.max.y = height;
      scene.options.width = width;
      scene.options.height = height;
      scene.canvas.width = width;
      scene.canvas.height = height;
    }
  }, [scene, containerSize]);

  useEffect(() => {
    const timer = setInterval(() => {
      console.log("1");
      // NOTE: 9度にします！最大！
      Matter.Body.rotate(wall1, 0.01);
      // Matter.Body.setAngle(wall1, deg2rad(-9));
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleResize = () => {
    fitScreen(boxRef);
  };
  return (
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
      <canvas id="mainCanvas" ref={canvasRef} />
    </div>
  );
};
