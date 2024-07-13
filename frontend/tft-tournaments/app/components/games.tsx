import Image from "next/image";
import Button from "./button";
import { useState } from "react";
import LobbiesForGame from "./lobbies";

export default function GamesForDay({ tournament, dayIndex }: any) {
  interface Standings {
    [key: string]: number;
  }

  interface Lobby {
    [key: string]: number;
  }

  interface Game {
    lobbies: Lobby[];
  }

  interface Day {
    standings: Standings;
    num_participants: number;
    day: number;
    sheet_index: number;
    games: Game[];
  }

  interface Tournament {
    name: string;
    tier: string;
    region: string;
    start_date: string;
    end_date: string;
    link: string;
    patch: string;
    id: number;
    days: (Day | null)[];
  }

  function getGamesForDay(
    tournament: Tournament,
    dayIndex: number
  ): Game[] | null {
    const day = tournament.days[dayIndex];
    return day ? day.games : null;
  }

  // function getLobbiesForGame(gameIndex: number) {
  //   const lobby =
  // }

  const games = getGamesForDay(tournament, dayIndex);
  const [activeGameIndex, setActiveGameIndex] = useState(0);

  const handleGameClick = (index: any) => {
    // setActiveDay(dayTabs[index]);
    setActiveGameIndex(index);
  };

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

  return (
    <div>
      <div className="flex gap-2 mt-2 ml-2">
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
      <div className="h-[27rem] overflow-auto overscroll-none mt-3 mx-2 rounded bg-active-purple px-3 py-2 border border-active-purple-b">
        <div className="flex justify-center mb-2 relative">
          Game {activeGameIndex + 1}
          <div className="absolute left-0 bottom-0 text-not-white italic text-sm">
            Lobbies
          </div>
        </div>
        <LobbiesForGame game={games[activeGameIndex]} />
      </div>
    </div>
  );
}
