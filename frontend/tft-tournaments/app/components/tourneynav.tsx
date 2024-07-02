"use client";
import { useEffect, useState } from "react";

const tourneyTabs = ["Info", "Games", "Standings"];

const TourneyNav = ({
  days,
  tier,
  region,
  num_participants,
  patch,
  standings,
  start_date,
  end_date,
}: any) => {
  const [activeTab, setActiveTab] = useState(tourneyTabs[0]);
  const [tourneyDays, setTourneyDays] = useState<any[]>([]);
  const [tourneyStandings, setTourneyStandings] = useState<Map<any, any>>(
    new Map()
  );

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    setTourneyDays(days);
    const standingsMap = new Map(Object.entries(standings));
    setTourneyStandings(standingsMap);
  }, [days, standings]);

  // access entries
  const standingsEntries = Array.from(tourneyStandings.entries());
  // sort the entries by value (descending order)
  standingsEntries.sort((a, b) => b[1] - a[1]);

  return (
    <div>
      <div className="flex space-x-4 bg-white text-black p-4">
        {tourneyTabs.map((tab) => (
          <button
            key={tab}
            className={`hover:border-black uppercase py-2 px-4 rounded font-bold border ${
              activeTab === tab ? "border-black" : "cursor-pointer border-white"
            }`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="p-4">
        {/* INFO SECTION */}
        {activeTab === "Info" && (
          <>
            <div className="absolute justify-end right-0 mr-40 -mt-20 text-black text-7xl uppercase font-bold">
              INFO
            </div>
            <div className="flex flex-col space-y-4">
              <div> Tournament Info</div>
              <div> Region: {region} </div>
              <div> Number of Competitors: {num_participants} </div>
              <div> Tier: {tier} </div>
              <div> Patch: {patch} </div>
            </div>
          </>
        )}

        {/* LOBBIES SECTION */}
        {activeTab === "Games" && (
          <>
            <div className="absolute justify-end right-0 mr-40 -mt-20 text-black text-7xl uppercase font-bold">
              GAMES
            </div>
            <div>
              This is the content for Games - list out games as clickable drop
              downs into lobbies 1-8
              {tourneyDays.map((day, index) => (
                <div key={index}>
                  <div className="bg-gray-500 p-4 text-center uppercase font-bold text-xl">
                    Day {index + 1}
                  </div>
                  {day.games.length > 0 ? (
                    <div>
                      {day.games.map((game: any, gameIndex: number) => (
                        <div key={gameIndex} className="mb-4">
                          <h2 className="font-bold">Game {gameIndex + 1}</h2>
                          {game.lobbies.length > 0 ? (
                            <ul>
                              <div className="grid grid-cols-4 bg-white text-black">
                                {game.lobbies.map(
                                  (lobby: any, lobbyIndex: number) => (
                                    <div key={lobbyIndex}>
                                      <div className="font-bold">
                                        Lobby {lobbyIndex + 1}
                                      </div>
                                      <li key={lobbyIndex} className="">
                                        {Object.entries(lobby).map(
                                          ([player, points]: [any, any]) => (
                                            <li key={player} className="py-1">
                                              {player}: {points}
                                            </li>
                                          )
                                        )}
                                      </li>
                                    </div>
                                  )
                                )}
                              </div>
                            </ul>
                          ) : (
                            <div>No Lobbies</div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>No Games</div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* STANDINGS SECTION */}
        {activeTab === "Standings" && (
          <>
            <div className="absolute justify-end right-0 mr-40 -mt-20 text-black text-7xl uppercase font-bold">
              STANDINGS
            </div>
            <div className="sticky top-[5rem] bg-black text-lg border p-4 grid grid-cols-2 font-bold">
              <div>PLAYER</div>
              <div>POINTS</div>
            </div>
            <div className="border flex flex-col bg-white text-black">
              {standingsEntries.map(([player, points]) => (
                <div
                  key={player}
                  className="grid grid-cols-2 p-4 hover:text-gray-500 hover:bg-gray-300 transition-colors duration-300"
                >
                  <span className="font-bold">{player}</span> {points}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TourneyNav;
