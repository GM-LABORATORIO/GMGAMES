import React, { useState } from "react";
import Lobby from "./components/Lobby";
import GameRoom from "./components/GameRoom";

export default function App() {
  const [session, setSession] = useState(null);

  const handleJoinRoom = (sessionData) => {
    setSession(sessionData);
  };

  const handleLeaveRoom = () => {
    setSession(null);
  };

  return (
    <div className="app-container">
      {session ? (
        <GameRoom session={session} onLeaveRoom={handleLeaveRoom} />
      ) : (
        <Lobby onJoinRoom={handleJoinRoom} />
      )}
    </div>
  );
}
