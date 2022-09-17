import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { NotFound } from "./pages/NotFound";
import { Start } from "./pages/Start";
import { Play } from "./pages/Play";

function App() {
  return (
    <div
      className="root"
      style={{ position: "relative", height: "100%", width: "100%" }}
    >
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/play" element={<Play />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
