import React from "react";

interface Lobby {
  [key: string]: number;
}

const PlayerList: React.FC<{ lobby: Lobby }> = ({ lobby }) => {
  // Sort the players by place
  const sortedPlayers = Object.entries(lobby).sort(
    ([, placeA], [, placeB]) => placeA - placeB
  );

  // Split the players into two groups
  const firstGroup = sortedPlayers.slice(0, 4);
  const lastGroup = sortedPlayers.slice(-4);

  return (
    <div className="flex gap-2">
      {/* First 4 players */}
      <div id="top-four" className="w-1/2">
        {firstGroup.map(([player, place], playerIndex) => {
          const formattedPlayer = player.endsWith("#eprod")
            ? player.slice(0, -6)
            : player;
          return (
            <div key={playerIndex} className="flex gap-2">
              <div className="w-2 text-center text-not-white ml-2">{place}</div>
              <div className="flex gap-2">
                <div
                  id="border"
                  className="w-[1px] h-6 bg-active-purple-b"
                ></div>
                <div
                  className={`${place === 1 ? "text-pris-yellow" : "text-white"}`}
                >
                  {formattedPlayer}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Last 4 players */}
      <div id="bot-four" className="w-1/2">
        {lastGroup.map(([player, place], playerIndex) => {
          const formattedPlayer = player.endsWith("#eprod")
            ? player.slice(0, -6)
            : player;
          return (
            <div key={playerIndex} className="flex gap-2">
              <div className="ml-2 w-2 text-center text-not-white">{place}</div>
              <div className="flex gap-2">
                <div
                  id="border"
                  className="w-[1px] h-6 bg-active-purple-b"
                ></div>
                <div className="text-whitish">{formattedPlayer}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayerList;
