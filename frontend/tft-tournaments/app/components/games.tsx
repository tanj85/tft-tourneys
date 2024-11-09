import Image from "next/image";
import Button from "./button";
import { useEffect, useState } from "react";
import LobbiesForGame from "./lobbies";
import {Game, Tournament} from "./../interfaces";


export default function GamesForDay({ tournament, dayIndex }: any) {
  function getGamesForDay(
    tournament: Tournament,
    dayIndex: number
  ): Game[] | null {
    if (dayIndex === -1) return null;
    const day = tournament.days[dayIndex];
    return day ? day.games : null;
  }

  function isValidLobbies(game: Game, dayIndex: number) {
    if (game === undefined){
      return false;
    }
    if (game.lobbies.length === 1 && Object.keys(game.lobbies[0]).length > 8) {
      return false;
    }
    return true;
  }

  // function getLobbiesForGame(gameIndex: number) {
  //   const lobby =
  // }

  const games = getGamesForDay(tournament, dayIndex);
  const [activeGameIndex, setActiveGameIndex] = useState(0);

  useEffect(() => {
    setActiveGameIndex(0); // Reset to the first game when dayIndex changes
  }, [dayIndex]);

  const handleGameClick = (index: any) => {
    // setActiveDay(dayTabs[index]);
    setActiveGameIndex(index);
  };

  if ((!games || games.length === 0) && dayIndex === -1) {
    return (
      <div className="flex flex-row items-center m-4">
        <Image src="/sad_emote.png" width={100} height={100} alt="icon" />
        <div className="text-not-white italic text-center">
          No games found for this Tournament!
        </div>
      </div>
    );
  }

  if (!games || games.length === 0) {
    return (
      <div className="flex flex-row items-center">
        <Image src="/sad_emote.png" width={100} height={100} alt="icon" />
        <div className="text-not-white italic text-center">
          No games found for Day {dayIndex + 1}!
        </div>
      </div>
    );
  }

  if (!isValidLobbies(games[activeGameIndex], dayIndex)) {
    return (
      <div className="flex flex-row items-center m-4">
        <Image src="/sad_emote.png" width={100} height={100} alt="icon" />
        <div className="text-not-white italic text-center">
          No lobby data for Day {dayIndex + 1}. You can still check the
          standings for player scores!
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-sm gap-1 justify-center lg:justify-start flex-wrap lg:text-base flex lg:gap-2 mt-2 mx-2 -mb-1">
        {games.map((game: Game, index: number) => (
          <>
            <div>
              <Button
                active={activeGameIndex === index}
                onClick={() => handleGameClick(index)}
              >
                Game {index + 1}
              </Button>
            </div>
          </>
        ))}
      </div>
      {/* EACH GAME'S DATA */}
      <div className="max-h-[33rem] min-w-[19rem] overflow-auto overscroll-none mt-3 mx-2 rounded bg-active-purple px-3 py-2 border border-active-purple-b">
        <div className="flex justify-center mb-2 relative">
          Game {activeGameIndex + 1}
          <div className="absolute left-0 bottom-0 text-not-white italic text-sm">
            Lobbies
          </div>
        </div>
        <LobbiesForGame game={games[activeGameIndex]} tournament={tournament} />
      </div>
    </div>
  );
}
