import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PlayerModal from "./playermodal";
import {Tournament} from "./../interfaces";

export default function StandingsForDay({ tournament, dayIndex }: any) {
  const standings = getStandingsForDay(tournament, dayIndex);

  const sortedStandings = standings
    ? Object.entries(standings).sort(
        (
          [playerA, standingA]: [string, any],
          [playerB, standingB]: [string, any]
        ) => {
          // First compare by score
          if (standingB !== standingA) {
            return standingB - standingA;
          }
          // if (dayIndex === 1){
          //   console.log("A", playerA,getPlayerCumulativeScore(playerA, dayIndex, tournament), standingA, dayIndex);
          //   console.log("B", playerB,getPlayerCumulativeScore(playerB, dayIndex, tournament), standingB, dayIndex);
          // }
          // If scores are tied, compare by games played
          const cumulativeDiff = getPlayerCumulativeScore(playerB, dayIndex, tournament) -
                                  getPlayerCumulativeScore(playerA, dayIndex, tournament)
          
          if (cumulativeDiff !== 0){
            return (
              getPlayerCumulativeScore(playerB, dayIndex, tournament) -
              getPlayerCumulativeScore(playerA, dayIndex, tournament)
            );
          }

          let placeNumDiff = getNumPerPlace(playerB, dayIndex, tournament).map((item, index) => 
                              item - getNumPerPlace(playerA, dayIndex, tournament)[index]);

          for (let i = 0; i < 7; i++){
            if (placeNumDiff[i] !== 0){
              return placeNumDiff[i];
            }
          }
          return 0;
        }
      )
    : null;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<any>("");

  const openModal = (content: any) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  function getPlayerCumulativeScore(
    player: string,
    dayIndex: number,
    tournament: Tournament
  ): number {
    let total = 0;
    for (let i = 0; i < dayIndex + 1; i++) {
      const standings = getStandingsForDay(tournament, i);
      total += standings ? standings[player] : 0;
    }
    return total;
  }

  function getNumPerPlace(
    player: string,
    dayIndex: number,
    tournament: Tournament
  ): number[] {
    let ret = [0,0,0,0,0,0,0,0];
    for (let i = 0; i < dayIndex + 1; i++) {
      for (let j = 0; j < 8; j++) {
        for (let k = 0; k < (tournament.days[i]?.games.length || 0); k++){
          for (let l = 0; l < (tournament.days[i]?.games[k].lobbies.length || 0); l++){
            let val = tournament.days[i]?.games[k].lobbies[l][player];
            if (val){
              ret[val-1]++;
            }
          }
        }
      }
    }
    return ret;
  }

  if ((!standings || standings.length === 0) && dayIndex === -1) {
    return (
      <div className="flex flex-row items-center m-4">
        <Image src="/sadyuumi.png" width={100} height={100} alt="icon" />
        <div className="text-not-white italic text-center">
          No standings found for this Tournament!
        </div>
      </div>
    );
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
    <div className="h-[89%]">
      <div className="bg-opacity-60 overflow-auto overscroll-none break-all max-h-[34rem] bg-lightest-purple sm:m-4 m-2 rounded border-active-purple-b border">
        {/* {JSON.stringify(standings)} */}

        {sortedStandings?.map(([player, points]: any, index) => {
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
              <button
                onClick={() => openModal(formattedPlayer)}
                className="hover:underline mx-2"
              >
                {formattedPlayer}
              </button>
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


export function getStandingsForDay(tournament: Tournament, dayIndex: number): any {
  if (dayIndex === -1) {
    return null;
  }

  const day = tournament.days[dayIndex];
  if (!day) {
    return null;
  }

  let standings = { ...day.standings };

  if (tournament.rules.includes("day_one_two_combined") && dayIndex === 1) {
    const dayOneStandings = tournament.days[0]?.standings || {};
    for (const player in dayOneStandings) {
      standings[player] = (standings[player] || 0) + dayOneStandings[player];
    }
  }

  return standings;
}