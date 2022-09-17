import Matter, { Engine, Render, World, Bodies, Composite } from "matter-js";
import React, { useEffect, useRef, useState } from "react";

export const Play = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef(null);
  const [constraints, setContraints] = useState<any>();
  const [scene, setScene] = useState();
  const STATIC_DENSITY = 15;

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

    setContraints(boxRef.current.getBoundingClientRect());
    setScene(render);

    window.addEventListener("resize", handleResize);
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

      // Matter.Body.setPosition(floor, {
      //   x: width / 2,
      //   y: height + STATIC_DENSITY / 2,
      // });

      // Matter.Body.setVertices(floor, [
      //   { x: 0, y: height },
      //   { x: width, y: height },
      //   { x: width, y: height + STATIC_DENSITY },
      //   { x: 0, y: height + STATIC_DENSITY },
      // ]);
    }
  }, [scene, constraints]);

  useEffect(() => {
    const timer = setInterval(() => {
      console.log("1");
      // wall1.setAngle(2)
      console.log(wall1);
      // wall1.rotate
      Matter.Body.rotate(wall1, 0.01)
      // Matter.Body.setAngle(wall1, 0.01)
    }, 100);

    //クリーンアップ
    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleResize = () => {
    console.log(boxRef?.current?.getBoundingClientRect());
    setContraints(boxRef?.current?.getBoundingClientRect());
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
      }}
    >
      <canvas
        id="mainCanvas"
        ref={canvasRef}
        // style={{
        //   position: "absolute",
        //   top: 0,
        //   left: 0,
        //   height: "100vh",
        //   width: "100vw",
        //   zIndex: 0, // TODO: 吟味の余地あり
        //   border: "2px solid blue",
        // }}
      ></canvas>
    </div>
  );
};
