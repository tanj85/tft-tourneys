import { useEffect } from "react";
import ReactDOM from "react-dom";
import { tournamentsExample } from "../data/data";
import { kMaxLength } from "buffer";
import Image from "next/image";
import { FaRegThumbsUp } from "react-icons/fa6";

import { FaRegThumbsDown } from "react-icons/fa6";
import { FaSortAmountUp } from "react-icons/fa";

import { TbSwords } from "react-icons/tb";

import { PiSword } from "react-icons/pi";

import { IoPodium } from "react-icons/io5";
import { FaStar } from "react-icons/fa6";

interface Standings {
  [key: string]: number;
}

interface Stats {
  [key: string]: number;
}

interface PlayerStanding {
  player: string;
  dayPlacement: number;
  points: number;
  num_players: number;
  avp: number;
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

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournament: any;
  player: string;
}

interface GameInfo {
  player: string;
  day: number;
  game: number;
  lobby: number;
  placement: number;
}

const PlayerModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  tournament,
  player,
}) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  const stats: Stats = {
    wins: 0,
    eighths: 0,
    top_fours: 0,
    total_games: 0,
    total_points: 0,
    total_avp: 0,
  };

  const games: GameInfo[] = [];
  tournament.days.forEach((day: Day, dayIndex: number) => {
    day.games.forEach((game: Game, gameIndex: number) => {
      game.lobbies.forEach((lobby: Lobby, lobbyIndex: number) => {
        if (player in lobby) {
          stats["total_games"] += 1;
          stats["total_points"] += 9 - lobby[player];
          stats["total_avp"] =
            (stats["total_games"] * 9 - stats["total_points"]) /
            stats["total_games"];
          if (lobby[player] <= 4) {
            stats["top_fours"] += 1;
            if (lobby[player] <= 1) {
              stats["wins"] += 1;
            }
          }
          if (lobby[player] == 8) {
            stats["eighths"] += 1;
          }
          games.push({
            player: player,
            day: dayIndex + 1,
            game: gameIndex + 1,
            lobby: lobbyIndex + 1,
            placement: lobby[player],
          });
        }
      });
    });
  });

  const standings: PlayerStanding[] = [];
  tournament.days.forEach((day: Day, dayIndex: number) => {
    const num_games = day.games.length;
    // Extracting player names and sorting by points to determine placement
    Object.entries(day.standings)
      .sort((a, b) => b[1] - a[1]) // Sort players by points in descending order
      .forEach(([p, points], index) => {
        if (p === player) {
          const playerStanding: PlayerStanding = {
            player: player,
            dayPlacement: index + 1,
            points: points,
            num_players: Object.keys(day.standings).length,
            avp: (9 * num_games - points) / num_games,
          };
          standings.push(playerStanding);
        }
      });
  });

  console.log(games);
  console.log(standings);
  console.log(stats);

  const groupedByDay = games.reduce((acc, current) => {
    const { day } = current;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(current);
    return acc;
  }, {});

  const daysArray = Object.keys(groupedByDay).map((day) => ({
    day: Number(day),
    entries: groupedByDay[day],
  }));

  return ReactDOM.createPortal(
    <>
      <div className="fixed inset-0 bg-idle-purple bg-opacity-10 backdrop-blur-sm z-10"></div>
      <div className="fixed top-20 inset-0 flex items-center justify-center z-30">
        <div className="bg-darker-blue h-[70vh] w-[90vw] sm:w-[60vw] px-12 py-6 rounded-lg relative font-soleil overflow-y-auto">
          {/* <Image
            src="/poro.png"
            height={200}
            width={200}
            alt="logo"
            className="absolute right-24 -top-20"
          /> */}
          <span
            className="absolute top-3 right-6 text-2xl cursor-pointer"
            onClick={onClose}
          >
            &times;
          </span>
          <div className="text-xl text-bold">{player}</div>
          <div className="flex gap-4 mt-4 flex-wrap justify-between">
            <div className="flex gap-4 flex-col">
              {/* leaderboard position */}
              <div className="border border-lightest-purple bg-idle-purple w-[24rem] min-w-[12rem] h-full rounded-lg px-4 py-2">
                Leaderboard Position
                <div className="border border-lightest-purple bg-active-purple w-full h-3/4 mt-2 rounded-md px-4 py-2 flex flex-col gap-1">
                  {standings
                    .slice()
                    .reverse()
                    .map((day, index) => {
                      const isLastDay = index === 0;
                      return (
                        <>
                          <div className="flex justify-between">
                            <div
                              className={`flex gap-2 items-center ${isLastDay ? "text-pris-yellow" : "text-white"}`}
                            >
                              <FaStar />
                              {day.dayPlacement} out of {day.num_players}
                            </div>
                            <div>Day {standings.length - index}</div>
                          </div>
                        </>
                      );
                    })}
                  {/* <div className="text-xs break-all">
                    {JSON.stringify(standings)}
                  </div> */}
                </div>
              </div>
              <div className="border border-lightest-purple bg-idle-purple w-[24rem] h-full rounded-lg px-4 py-2">
                Tournament stats
                <div className=" border border-lightest-purple bg-active-purple w-full h-3/4 mt-2 rounded-md px-4 py-2 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div className="flex gap-2 items-center">
                      <FaRegThumbsUp />
                      Wins
                    </div>
                    {stats.wins}
                  </div>
                  <div className="flex justify-between">
                    <div className="flex gap-2 items-center">
                      <FaRegThumbsDown />
                      Eighths
                    </div>
                    {stats.eighths}
                  </div>

                  <div className="flex justify-between">
                    <div className="flex gap-2 items-center">
                      <FaSortAmountUp />
                      Top 4s
                    </div>
                    {stats.top_fours}
                  </div>
                  <div className="flex justify-between">
                    <div className="flex gap-2 items-center">
                      <TbSwords />
                      Total games
                    </div>
                    {stats.total_games}
                  </div>

                  <div className="flex justify-between">
                    <div className="flex gap-2 items-center">
                      <IoPodium />
                      Total AVP
                    </div>
                    {stats.total_avp.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* daily placements */}
            <div className="border border-lightest-purple bg-idle-purple w-[24rem] h-[27rem] rounded-lg px-4 py-2">
              Daily Standings
              <div className="border border-lightest-purple bg-active-purple w-full h-[88%] mt-2 rounded-md px-4 py-2 flex flex-col gap-4">
                {daysArray.map((day) => (
                  <>
                    <div>Day {day.day}</div>
                    <div className="flex flex-wrap gap-2 ">
                      {day.entries.map((game: any) => (
                        <div
                          className={`
                          rounded-md 
                          ${game.placement === 1 ? "text-pris-yellow border-pris-yellow border" : ""}
                          ${game.placement === 2 ? "text-pris-blue border-pris-blue border" : ""}
                          ${game.placement === 3 ? "text-pris-light-pink border-pris-light-pink border" : ""}
                          ${game.placement === 4 ? "text-white border-white border" : ""}
                          
                          ${game.placement > 4 ? "border border-whitish text-whitish" : ""}
                        `}
                        >
                          <div className="w-8 h-8 flex items-center justify-center">
                            {game.placement}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body // This targets the body element as the mount point
  );
};

export default PlayerModal;
