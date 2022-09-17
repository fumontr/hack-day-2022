import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { NotFound } from "./pages/NotFound";
import { Start } from "./pages/Start";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
