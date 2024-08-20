import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PlayerModal from "./playermodal";

export default function StandingsForDay({ tournament, dayIndex }: any) {
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

  const standings = getStandingsForDay(tournament, dayIndex);

  const sortedStandings = Object.entries(standings).sort(
    ([, placeA]: any, [, placeB]: any) => placeB - placeA
  );

  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<any>('');

  const openModal = (content: any) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  function getStandingsForDay(tournament: Tournament, dayIndex: number): any {
    const day = tournament.days[dayIndex];
    return day ? day.standings : null;
  }

  if (!standings || standings.length === 0) {
    return (
      <div className="flex flex-row items-center">
        <Image src="/sadyuumi.png" width={100} height={100} alt="icon" />
        <div className="text-not-white italic text-center">
          No standings found for Day {dayIndex + 1}!
        </div>
      </div>
    );
  }

  return (
    
    <div className="h-[89%] max-w-[25rem]">
      <div className="bg-opacity-60 overflow-auto overscroll-none break-all max-h-[34rem] bg-lightest-purple sm:m-4 m-2 rounded border-active-purple-b border">
        {/* {JSON.stringify(standings)} */}

        {sortedStandings.map(([player, points]: any, index) => {
          const formattedPlayer = player.endsWith("#eprod")
            ? player.slice(0, -6)
            : player;
          const playerLink: string = formattedPlayer
            .replace(/\s+/g, "_")
            .toLowerCase();
          return (
            <div
              key={index}
              className={`flex justify-between p-2 border-b border-lightest-purple ${index % 2 === 0 ? `bg-idle-purple-b bg-opacity-60 ${index === 0 ? "text-pris-yellow" : ""} ${index === 2 ? "text-pris-light-pink" : ""}` : `${index === 1 ? "text-pris-blue" : " text-whitish"}`}`}
            >
              {/* <div className="">{index}</div> */}
              <div className="flex">
                <div className="w-10 text-center text-not-white">
                  {index + 1}
                </div>
                <div
                  id="border"
                  className="w-[1px] h-6 bg-active-purple-b"
                ></div>
              </div>
              <button onClick={() => openModal(formattedPlayer)} className="hover:underline">{formattedPlayer}</button>
              <div className="text-not-white">
                {points} <span className="text-xs">pts</span>
              </div>
            </div>
          );
        })}
      </div>
      <PlayerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          tournament={tournament}
          player={modalContent}
        />
    </div>
  );
}
