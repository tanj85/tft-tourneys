import Link from "next/link";
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
    <div className="sm:flex gap-2 text-sm">
      {/* First 4 players */}
      <div id="top-four" className="sm:w-1/2">
        {firstGroup.map(([player, place], playerIndex) => {
          const formattedPlayer = player.endsWith("#eprod")
            ? player.slice(0, -6)
            : player;
          const playerLink: string = formattedPlayer
            .replace(/\s+/g, "_")
            .toLowerCase();
          return (
            <div key={playerIndex} className="flex gap-2">
              <div className="w-2 text-center text-not-white ml-2">{place}</div>
              <div className="flex gap-2">
                <div
                  id="border"
                  className="w-[1px] h-6 bg-active-purple-b"
                ></div>
                <Link
                  href={`/players/${playerLink}`}
                  className={`${place === 1 ? "text-pris-yellow" : "text-white"}`}
                >
                  {formattedPlayer}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Last 4 players */}
      <div id="bot-four" className=" sm:w-1/2">
        {lastGroup.map(([player, place], playerIndex) => {
          const formattedPlayer = player.endsWith("#eprod")
            ? player.slice(0, -6)
            : player;
          const playerLink: string = formattedPlayer
            .replace(/\s+/g, "_")
            .toLowerCase();
          return (
            <div key={playerIndex} className="flex gap-2">
              <div className="ml-2 w-2 text-center text-not-white">
                {playerIndex + 5}
              </div>
              <div className="flex gap-2">
                <div
                  id="border"
                  className="w-[1px] h-6 bg-active-purple-b"
                ></div>
                <Link href={`/players/${playerLink}`}>
                  <div className="truncate text-whitish">{formattedPlayer}</div>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayerList;
