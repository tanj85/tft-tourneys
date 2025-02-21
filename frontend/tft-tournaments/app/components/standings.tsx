import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PlayerModal from "./playermodal";
import { Tournament, Standings } from "./../interfaces";

export default function StandingsForDay({ tournament, dayIndex }: any) {
  const standings = getStandingsForDay(tournament, dayIndex);

  const sortedStandings = standings
    ? sortStandings(standings, dayIndex, tournament)
    : null;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<any>("");

  const openModal = (content: any) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

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
    <div className="flex flex-col h-full">
      <div className="bg-opacity-60 overflow-auto overscroll-none break-all h-full bg-lightest-purple sm:m-4 m-2 rounded border-active-purple-b border">
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

export function sortStandings(
  standings: Record<string, any>,
  dayIndex: number,
  tournament: any
): [string, any][] {
  return Object.entries(standings).sort(
    ([playerA, standingA], [playerB, standingB]) =>
      compareStandings(
        playerA,
        standingA,
        playerB,
        standingB,
        dayIndex,
        tournament,
        standings
      )
  );
}

export function getStandingsForDay(
  tournament: Tournament,
  dayIndex: number
): Standings {
  if (dayIndex === -1) {
    return {};
  }

  const day = tournament.days[dayIndex];
  if (!day) {
    return {};
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

export function compareStandings(
  playerA: string,
  standingA: any,
  playerB: string,
  standingB: any,
  dayIndex: number,
  tournament: any,
  standings: any
): number {
  // Handle "day_three_checkmate" rule
  if (tournament.rules.includes("day_three_checkmate") && dayIndex === 2) {
    const checkmate_val =
      tournament.rules
        .find((rule: string) => rule.startsWith("checkmate_val-"))
        ?.split("-")[1] ?? "20";

    const lastWinner = getLastCheckmateWinner(
      tournament,
      2,
      parseInt(checkmate_val, 10)
    );

    if (playerA === lastWinner) return -1; // Player A gets first
    if (playerB === lastWinner) return 1; // Player B gets first
  }

  // First compare by score
  if (standingB !== standingA) {
    return standingB - standingA;
  }

  // Compare by cumulative scores if tied
  const cumulativeDiff =
    getPlayerCumulativeScore(playerB, dayIndex, tournament) -
    getPlayerCumulativeScore(playerA, dayIndex, tournament);

  if (cumulativeDiff !== 0) {
    return cumulativeDiff;
  }

  // Compare by games played
  return compareGamesPlayed(playerA, playerB, dayIndex, tournament);
}

export function getLastCheckmateWinner(
  tournament: Tournament,
  dayIndex: any,
  checkmateThreshold: number
): string | null {
  const dayResults = getPlayerResultsMapForDay(tournament, dayIndex);

  if (!dayResults) return null;

  for (const [player, results] of Array.from(dayResults.entries())) {
    let cumulativeScore = 0;

    for (const placement of results) {
      if (cumulativeScore > checkmateThreshold && placement === 1) {
        return player;
      }

      cumulativeScore += 9 - placement;
    }
  }

  return null;
}

export function getPlayerResultsMapForDay(
  tournament: Tournament,
  dayIndex: number
): Map<string, number[]> | null {
  // Validate the day index
  const day = tournament.days[dayIndex];
  if (!day) return null; // If the day is null or undefined, return null

  const resultsMap = new Map<string, number[]>();

  // Iterate through the games and lobbies for the day
  for (const game of day.games) {
    for (const lobby of game.lobbies) {
      for (const [player, placement] of Object.entries(lobby)) {
        // Add the placement to the player's result list in the map
        if (!resultsMap.has(player)) {
          resultsMap.set(player, []);
        }
        resultsMap.get(player)!.push(placement);
      }
    }
  }

  return resultsMap;
}

export function getPlayerResultsForDay(
  tournament: Tournament,
  dayIndex: number,
  player: string
): number[] | null {
  // Validate the day index
  const day = tournament.days[dayIndex];
  if (!day) return null; // If the day is null or undefined, return null

  const results: number[] = [];

  // Iterate through the games and lobbies for the day
  for (const game of day.games) {
    for (const lobby of game.lobbies) {
      // Check if the player is in this lobby
      if (lobby.hasOwnProperty(player)) {
        results.push(lobby[player]); // Add the player's placement to the results
      }
    }
  }

  return results;
}

export function compareGamesPlayed(
  playerA: string,
  playerB: string,
  dayIndex: number,
  tournament: any
): number {
  const placeNumDiff = getNumPerPlace(playerB, dayIndex, tournament).map(
    (item, index) => item - getNumPerPlace(playerA, dayIndex, tournament)[index]
  );

  for (let i = 0; i < 7; i++) {
    if (placeNumDiff[i] !== 0) {
      return placeNumDiff[i];
    }
  }

  return 0;
}

export function getPlayerCumulativeScore(
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

export function getNumPerPlace(
  player: string,
  dayIndex: number,
  tournament: Tournament
): number[] {
  let ret = [0, 0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < dayIndex + 1; i++) {
    for (let j = 0; j < 8; j++) {
      for (let k = 0; k < (tournament.days[i]?.games.length || 0); k++) {
        for (
          let l = 0;
          l < (tournament.days[i]?.games[k].lobbies.length || 0);
          l++
        ) {
          let val = tournament.days[i]?.games[k].lobbies[l][player];
          if (val) {
            ret[val - 1]++;
          }
        }
      }
    }
  }
  return ret;
}
