import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { NotFound } from "./pages/NotFound";
import { Start } from "./pages/Start";
import { Play } from "./pages/Play";

import { ChakraProvider } from "@chakra-ui/react";

export type Mode = "None" | "Alone" | "Together";

function App() {
  const [myId, setMyId] = useState<string | null>(null);
  // const [firentId, setFriendId] = useState<String|null>(null)
  const [roomId, setRoomId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("None");
  return (
    <ChakraProvider>
      <div
        className="root"
        style={{ position: "relative", height: "100%", width: "100%" }}
      >
        <Routes>
          <Route
            path="/"
            element={
              <Start
                setMyId={setMyId}
                setRoomId={setRoomId}
                setMode={setMode}
              />
            }
          />
          <Route
            path="/play"
            element={
              <Play roomId={roomId} myId={myId} mode={mode} setMode={setMode} />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </ChakraProvider>
  );
}

export default App;
