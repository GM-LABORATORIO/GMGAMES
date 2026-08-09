import React, { useState, useEffect } from "react";
import GameHub from "./components/GameHub";
import Lobby from "./components/Lobby";
import GameRoom from "./components/GameRoom";

export default function App() {
  const [activeGame, setActiveGame] = useState(null); // null = GameHub JUNTOS JUGAMOS
  const [session, setSession] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("room")) {
      setActiveGame("bingo");
    }
  }, []);

  const handleJoinRoom = (sessionData) => {
    setSession(sessionData);
  };

  const handleLeaveRoom = () => {
    setSession(null);
  };

  const handleBackToHub = () => {
    setSession(null);
    setActiveGame(null);
  };

  if (!activeGame) {
    return <GameHub onSelectBingo={() => setActiveGame("bingo")} />;
  }

  return (
    <div className="app-container">
      {session ? (
        <GameRoom session={session} onLeaveRoom={handleLeaveRoom} onBackToHub={handleBackToHub} />
      ) : (
        <Lobby onJoinRoom={handleJoinRoom} onBackToHub={handleBackToHub} />
      )}
    </div>
  );
}
