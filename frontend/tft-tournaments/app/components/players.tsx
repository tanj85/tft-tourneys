import Link from "next/link";
import { useState } from "react";
import React from "react";
import PlayerModal from "./playermodal";

interface Lobby {
  [key: string]: number;
}

const PlayerList: React.FC<{ lobby: Lobby, tournament: any }> = ({ lobby, tournament }) => {
  // Sort the players by place
  const sortedPlayers = Object.entries(lobby).sort(
    ([, placeA], [, placeB]) => placeA - placeB
  );

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<any>('');

  const openModal = (content: any) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  // Split the players into two groups
  // const firstGroup = sortedPlayers.slice(0, 4);
  // const lastGroup = sortedPlayers.slice(-4);

  return (
    <div className="sm:flex gap-2 text-sm">
      {/* First 4 players */}
      <div id="top-four" className="sm:w-1/2">
        {sortedPlayers.map(([player, place], playerIndex) => {
          const formattedPlayer = player.endsWith("#eprod")
            ? player.slice(0, -6)
            : player;
          const playerLink: string = formattedPlayer
            .replace(/\s+/g, "_")
            .toLowerCase();
          return (
            <div key={playerIndex} className="flex gap-2">
              <div className="w-1 text-left text-not-white ml-2">{place}</div>
              <div className="flex gap-2">
                <div
                  id="border"
                  className="ml-1 w-[1px] h-6 bg-active-purple-b"
                ></div>
                <button className={`${place === 1 ? "text-pris-yellow" : place > 4 ? "text-not-white" : "text-white"} truncate hover:underline`} 
                  onClick={() => openModal(formattedPlayer)}>
                  {formattedPlayer}
                </button>
                <PlayerModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  tournament={tournament}
                  player={modalContent}
                />
                {/* <Link
                  href={`/players/${playerLink}`}
                  className={`${place === 1 ? "text-pris-yellow" : place > 4 ? "text-not-white" : "text-white"} truncate`}
                  style={{ maxWidth: '300px' }} // Adjust this value based on your layout needs
                >
                  {formattedPlayer}
                </Link> */}
              </div>
            </div>
          );
        })}
      </div>

      {/* Last 4 players */}
      {/* <div id="bot-four" className=" sm:w-1/2">
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
      </div> */}
    </div>
  );
};

export default PlayerList;
