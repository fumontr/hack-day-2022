import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { NotFound } from "./pages/NotFound";
import { Start } from "./pages/Start";
import { Play } from "./pages/Play";
import { VideoSample } from "./pages/VideoSample";

function App() {
  const [myId, setMyId] = useState<String|null>(null)
  const [firentId, setFriendId] = useState<String|null>(null)
  return (
    <div
      className="root"
      style={{ position: "relative", height: "100%", width: "100%" }}
    >
      <Routes>
        <Route path="/" element={<Start setMyId={setMyId} setFriendId={setFriendId}/>} />
        <Route path="/play" element={<Play userId={myId} friendId={firentId}/>} />
        <Route path="*" element={<NotFound />} />
        <Route path="/video" element={<VideoSample />} />
      </Routes>
    </div>
  );
}

export default App;
