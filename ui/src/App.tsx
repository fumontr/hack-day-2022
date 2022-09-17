import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { NotFound } from "./pages/NotFound";
import { Start } from "./pages/Start";
import { Play } from "./pages/Play";
import { VideoSample } from "./pages/VideoSample";

import { ChakraProvider } from "@chakra-ui/react";

function App() {
  const [myId, setMyId] = useState<string | null>(null);
  // const [firentId, setFriendId] = useState<String|null>(null)
  const [roomId, setRoomId] = useState<string | null>(null);
  return (
    <ChakraProvider>
      <div
        className="root"
        style={{ position: "relative", height: "100%", width: "100%" }}
      >
        <Routes>
          <Route
            path="/"
            element={<Start setMyId={setMyId} setRoomId={setRoomId} />}
          />
          <Route path="/play" element={<Play roomId={roomId} myId={myId} />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/video" element={<VideoSample />} />
        </Routes>
      </div>
    </ChakraProvider>
  );
}

export default App;
