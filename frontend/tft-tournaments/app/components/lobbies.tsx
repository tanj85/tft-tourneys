import Image from "next/image";
import Button from "./button";
import { useState } from "react";
import { DiVim } from "react-icons/di";

export default function LobbiesForGame({ game }: any) {
  interface Lobby {
    [key: string]: number;
  }

  //   function getLobbiesForGame(gameIndex: number) {
  //     const lobby =
  //   }

  //   const games = getGamesForDay(tournament, dayIndex);
  // const lobbies = getLobbiesForGame();
  // const [activeGameIndex, setActiveGameIndex] = useState(0);

  //   const handleGameClick = (index: any) => {
  //     // setActiveDay(dayTabs[index]);
  //     setActiveGameIndex(index);
  //   };

  //   if (!lobbies) {
  //     return (
  //       <div className="flex flex-row items-center">
  //         <Image src="/sad_emote.png" width={100} height={100} alt="icon" />
  //         <div className="text-not-white italic text-center">
  //           No games found for Day {dayIndex + 1}
  //         </div>
  //       </div>
  //     );
  //   }

  return (
    <div>
      {/* {game.lobbies.map((lobby: Lobby, lobbyIndex: number) => (
        <div key={lobbyIndex}>
          <h3>Lobby {lobbyIndex + 1}</h3>
          <ul>
            {Object.entries(lobby).map(([player, score], playerIndex) => (
              <li key={playerIndex}>
                {player}: {score}
              </li>
            ))}
          </ul>
        </div>
      ))} */}
      <div id="inner-boxes" className=" flex flex-col gap-2">
        {game.lobbies.map((lobby: Lobby, lobbyIndex: number) => (
          <div
            key={lobbyIndex}
            className="bg-lightest-purple shadow-xl py-2 px-2 relative"
          >
            <div className="absolute bottom-2 right-4 italic text-not-white">
              {lobbyIndex + 1}
            </div>
            {Object.entries(lobby)
              .sort(([, placeA], [, placeB]) => placeA - placeB)
              .map(([player, place]: [string, number], playerIndex: number) => (
                <>
                  <div key={playerIndex}>
                    {player}: {place}
                  </div>
                </>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
