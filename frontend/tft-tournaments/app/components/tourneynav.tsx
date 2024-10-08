"use client";
import { useEffect, useState } from "react";

const tourneyTabs = ["Games", "Standings"];

const TourneyNav = ({
  id,
  days,
  tier,
  region,
  num_participants,
  patch,
  standings,
  start_date,
  end_date,
}: any) => {
  const [activeTab, setActiveTab] = useState(
    id == sessionStorage.getItem("currentTourney")
      ? sessionStorage.getItem("activeTab") || tourneyTabs[0]
      : tourneyTabs[0]
  );
  const [tourneyDays, setTourneyDays] = useState<any[]>([]);
  const [tourneyStandings, setTourneyStandings] = useState<Map<any, any>>(
    new Map()
  );

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
    sessionStorage.setItem("activeTab", tab); // Save the current tab to sessionStorage
  };

  useEffect(() => {
    setTourneyDays(days);
    if (standings) {
      const standingsMap = new Map(Object.entries(standings));
      setTourneyStandings(standingsMap);
    }
    sessionStorage.setItem("currentTourney", id);
  }, [days, standings, id]);

  const standingsEntries = Array.from(tourneyStandings.entries());
  standingsEntries.sort((a, b) => b[1] - a[1]); // sort the entries by value (descending order)

  return (
    <div className="">
      {/* INFO SECTION */}

      <div className="flex p-4">
        {/* <div> Tournament Info</div> */}
        <div> Region: {region} </div>
        <div> Number of Competitors: {num_participants} </div>
        <div> Tier: {tier} </div>
        <div> Patch: {patch} </div>
        <div> Start Date: {start_date} </div>
        <div> End Date: {end_date} </div>
      </div>
      <div className="w-[20rem] rounded border border-lighter-gray z-20 sticky border-gray-400 grid grid-flow-col gap-2 p-2 bg-darkest-blue bg-opacity-40 backdrop-blur ml-8">
        {tourneyTabs.map((tab) => (
          <button
            key={tab}
            className={`bg-opacity-50 border p-1 rounded  text-gray-600 ${activeTab === tab ? "bg-slate-700 border-slate-500 text-white" : "border-lighter-gray bg-lighter-gray cursor-pointer"}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="p-4">
        {/* LOBBIES SECTION */}
        {activeTab === "Games" && (
          <>
            {/* <div className="hidden md:block absolute justify-end right-0 mr-40 -mt-20 text-black text-7xl uppercase font-bold">
              GAMES
            </div> */}
            <div>
              {tourneyDays.map((day, index) =>
                day !== null ? (
                  <div key={index}>
                    <div
                      // onClick={() => handleDropdown(index)}
                      className="sticky top-[9.68rem] z-10 bg-gray-500 p-2 text-center uppercase font-bold text-xl border"
                    >
                      Day {index + 1}
                    </div>

                    {/* Each day */}
                    {/* {daysOpen === index && (
                    
                  )} */}
                    {day.games.length > 0 ? (
                      <div>
                        {day.games.map((game: any, gameIndex: number) => (
                          <div key={gameIndex} className="my-4">
                            <h2 className="sticky top-[12.55rem] text-lg z-9 bg-black font-bold border p-3 uppercase rounded-t-md">
                              Game {gameIndex + 1}
                            </h2>

                            {/* Each game */}
                            {game.lobbies.length > 0 ? (
                              <ul>
                                <div className="grid md:grid-cols-4 bg-gray-100 border text-black p-4 gap-4">
                                  {game.lobbies.map(
                                    (lobby: any, lobbyIndex: number) => (
                                      <div key={lobbyIndex}>
                                        <div className="grid grid-cols-3 p-2 font-bold border-b border-black uppercase bg-gray-300 rounded-t-md">
                                          <div className="col-span-2">
                                            Lobby {lobbyIndex + 1}
                                          </div>
                                          <div className="text-gray-500 text-center">
                                            place
                                          </div>
                                        </div>

                                        {/* Each lobby */}
                                        <li
                                          key={lobbyIndex}
                                          className="bg-white mb-3"
                                        >
                                          {Object.entries(lobby)
                                            .sort(
                                              (
                                                [, pointsA]: [string, any],
                                                [, pointsB]: [string, any]
                                              ) => pointsA - pointsB
                                            )
                                            .map(
                                              ([player, points]: [
                                                any,
                                                any,
                                              ]) => {
                                                // Remove "#eprod" from the end of the player string if it exists
                                                const formattedPlayer =
                                                  player.endsWith("#eprod")
                                                    ? player.slice(0, -6)
                                                    : player;
                                                return (
                                                  <li
                                                    key={player}
                                                    className="pt-2"
                                                  >
                                                    <div className="grid grid-cols-3 break-words p-2 border-b">
                                                      <span className="col-span-2">
                                                        {formattedPlayer}
                                                      </span>
                                                      <span className="text-center">
                                                        {points}
                                                      </span>
                                                    </div>
                                                  </li>
                                                );
                                              }
                                            )}
                                        </li>
                                      </div>
                                    )
                                  )}
                                </div>
                              </ul>
                            ) : (
                              <div className="p-4 border rounded-b mb-4 italic">
                                No lobbies
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 border rounded-b mb-4 italic">
                        No games
                      </div>
                    )}
                  </div>
                ) : (
                  // dont render anything if null
                  <div key=""></div>
                )
              )}
            </div>
          </>
        )}

        {/* STANDINGS SECTION */}
        {activeTab === "Standings" && (
          <>
            {/* <div className="hidden md:block absolute justify-end right-0 mr-40 -mt-10 text-black text-7xl uppercase font-bold z-10">
              STANDINGS
            </div> */}
            <div className="sticky top-[9.68rem] bg-black text-lg border p-4 grid grid-cols-4 md:grid-cols-2 font-bold rounded-t-md bg-gray-500 z-20">
              <div className="col-span-3 md:col-span-1">PLAYER</div>
              <div className="text-center">POINTS</div>
            </div>
            <div
              className="relative z-10 overflow-hidden"
              style={{ paddingTop: "50px" }}
            >
              <div
                className="border flex flex-col bg-white text-black"
                style={{ marginTop: "-50px" }}
              >
                {standingsEntries.map(([player, points]) => {
                  const formattedPlayer = player.endsWith("#eprod")
                    ? player.slice(0, -6)
                    : player;
                  return (
                    <div
                      key={player}
                      className="grid grid-cols-4 md:grid-cols-2 p-4 hover:text-gray-500 hover:bg-gray-300 transition-colors duration-300"
                    >
                      <span className="font-bold col-span-3 md:col-span-1">
                        {formattedPlayer}
                      </span>
                      <span className="text-center">{points}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TourneyNav;
