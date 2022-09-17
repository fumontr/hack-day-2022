import Matter, { Engine, Render, World, Bodies, Composite } from "matter-js";
import React, { Ref, RefObject, useEffect, useRef, useState } from "react";

export const Play = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef(null);
  const [constraints, setConstraints] = useState<any>();
  const [scene, setScene] = useState();
  const STATIC_DENSITY = 15;

  const fitScreen = (boxRef: RefObject<HTMLDivElement>) => {
    if (!boxRef?.current) return;
    const clientWidth = boxRef.current.clientWidth;
    const clientHeight = boxRef.current.clientHeight;
    let width;
    let height;
    if (clientHeight > (clientWidth * 9) / 16) {
      width = clientWidth;
      height = clientWidth * (9 / 16);
    } else {
      height = clientHeight;
      width = clientHeight * (16 / 9);
    }
    setConstraints({ width, height });
  };

  const floor = Bodies.rectangle(0, 0, 0, 100, {
    isStatic: true,
    render: {
      fillStyle: "blue",
    },
  });
  const wall1 = Bodies.rectangle(200, 50, 400, 20, {
    isStatic: true,
    angle: Math.PI * 0.06,
    render: { fillStyle: "#060a19" },
  });

  useEffect(() => {
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
    // Composite.add(engine.world, [
    //   // walls
    //   Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
    //   Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
    //   Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
    //   Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
    // ]);
    Composite.add(engine.world, [
      wall1,
      Bodies.rectangle(300, 560, 600, 20, {
        isStatic: true,
        angle: Math.PI * 0.04,
        render: { fillStyle: "#060a19" },
      }),
      Bodies.rectangle(500, 350, 650, 20, {
        isStatic: true,
        angle: -Math.PI * 0.06,
        render: { fillStyle: "#060a19" },
      }),
    ]);

    World.add(engine.world, [floor, ball]);

    Engine.run(engine);
    Render.run(render);

    fitScreen(boxRef);
    setScene(render);

    // window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (constraints) {
      let { width, height } = constraints;

      // Dynamically update canvas and bounds
      scene.bounds.max.x = width;
      scene.bounds.max.y = height;
      scene.options.width = width;
      scene.options.height = height;
      scene.canvas.width = width;
      scene.canvas.height = height;

      // Dynamically update floor
      const floor = scene.engine.world.bodies[0];
    }
  }, [scene, constraints]);

  useEffect(() => {
    const timer = setInterval(() => {
      console.log("1");
      // wall1.setAngle(2)
      console.log(wall1);
      // wall1.rotate
      Matter.Body.rotate(wall1, 0.01);
      // Matter.Body.setAngle(wall1, 0.01)
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
