"use client";
import { useEffect, useState } from "react";
import SectionLabel from "./sectionlabel";
import GamesForDay from "./games";
import Image from "next/image";
import { formatDate } from "../data/utils";
import Button from "./button";
import StandingsForDay from "./standings";
// import { Console } from "console";

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

// const dayTabs = ["Day 1", "Day 2", "Day 3"];
var tourneyTabs = ["Overview", "Results", "Standings"];

const NewTourneyNav = ({ tournament }: any) => {
  const id = tournament.tournament_id;
  const name = tournament.tournament_name;
  const region = tournament.region;
  const start = tournament.start_date;
  const end = tournament.end_date;
  const patch = tournament.patch;
  const days = tournament.days;
  const tier = tournament.tier;
  const overview_info =
    tournament.overview_info !== undefined ? tournament.overview_info : "";
  // const participants = tournament.num_participants;

  if (!overview_info) {
    tourneyTabs = tourneyTabs.filter((item) => item !== "Overview");
  }

  const standings = tournament.standings;
  // const [activeDay, setActiveDay] = useState(dayTabs[0]);

  const [activeTab, setActiveTab] = useState("Results");
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  // console.log("AH");
  useEffect(() => {
    // console.log("afwaf");
    if (typeof window !== "undefined") {
      // Now safe to use sessionStorage
      const storedTourney = sessionStorage.getItem("currentTourney");
      const storedActiveTab = sessionStorage.getItem("activeTab") || "Results";
      const storedActiveDay = parseInt(
        sessionStorage.getItem("activeDay") || "0"
      );

      if (id == storedTourney) {
        setActiveTab(storedActiveTab);
        setActiveDayIndex(storedActiveDay);
      }
    }
  }, [id]);

  const [tourneyDays, setTourneyDays] = useState<any[]>([]);
  // const [tourneyStandings, setTourneyStandings] = useState<Map<any, any>>(
  //   new Map()
  // );

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
    sessionStorage.setItem("activeTab", tab); // Save the current tab to sessionStorage
  };

  const handleDaysClick = (index: any) => {
    setActiveDayIndex(index);
    sessionStorage.setItem("activeDay", index); // Save the current tab to sessionStorage
  };

  // const handleStandingsDaysClick = (index: any) => {
  //   setActiveStandingsDay(index);
  // };

  useEffect(() => {
    setTourneyDays(days);
    // if (standings) {
    //   const standingsMap = new Map(Object.entries(standings));
    //   setTourneyStandings(standingsMap);
    // }
    
    if (days.length === 0) {
      setActiveDayIndex(-1);
    }

    sessionStorage.setItem("currentTourney", id);
  }, [days, standings, id]);

  // const standingsEntries = Array.from(tourneyStandings.entries());
  // standingsEntries.sort((a, b) => b[1] - a[1]); // sort the entries by value (descending order)

  return (
    <div
      id="entire-page"
      className="gap-3 mx-8 lg:mx-14 mt-4 flex sm:h-[84vh] text-center sm:text-start"
    >
      {/* NAME & INFO SECTION */}
      <div id="name-info-results" className="md:w-[70%] flex flex-col gap-2">
        <div id="name-info" className="">
          <div className="text-3xl text-balance lg:text-4xl font-bold">
            <h1>{name}</h1>
          </div>
          <div id="info" className="hidden lg:flex mt-2 gap-4">
            <div> Region: {region}</div>
            <div> Tier: {tier} </div>
            <div> Patch: {patch} </div>
            <div>
              Date: {formatDate(start)} - {formatDate(end)}
            </div>
          </div>
        </div>
        {/* END INFO & NAME SECTION */}

        {/* RESULTS & OVERVIEW SECTION */}
        <div
          id="results-overview"
          className="max-w-full h-[40rem] bg-darker-blue rounded-md bg-opacity-80 backdrop-blur"
        >
          <div
            id="results-overview-tabs"
            className="flex border-b border-idle-purple-b items-center text-sm sm:text-base"
          >
            {tourneyTabs.map((tab) => {
              if (tab === "Standings") {
                return (
                  <>
                    <button
                      key={tab}
                      className={`sm:hidden hover:bg-active-purple my-1 mx-1 rounded ${activeTab === tab ? "text-white bg-active-purple" : ""}`}
                      onClick={() => handleTabClick(tab)}
                    >
                      <SectionLabel
                        sourceImage={`/${tab}.png`}
                        text={tab}
                        props={`${activeTab === tab ? "text-white" : "text-not-white hover:text-white"}`}
                      />
                    </button>
                    <div
                      id="artificial-border"
                      className="sm: hidden w-[1px] h-6 bg-idle-purple-b"
                    ></div>
                  </>
                );
              }
              return (
                <>
                  <button
                    key={tab}
                    className={`sm:hidden hover:bg-active-purple my-1 mx-1 rounded ${activeTab === tab ? "text-white bg-active-purple" : ""}`}
                    onClick={() => {
                      handleTabClick(tab);
                    }}
                  >
                    <SectionLabel
                      sourceImage={`/${tab}.png`}
                      text={tab}
                      props={`${activeTab === tab ? "text-white" : "text-not-white hover:text-white"}`}
                    />
                  </button>
                  <div
                    id="artificial-border"
                    className="sm:hidden w-[1px] h-6 bg-idle-purple-b"
                  ></div>

                  <button
                    key={tab}
                    className={`hidden sm:block cursor-default my-1 mx-1 rounded ${activeTab === tab ? "text-white" : ""}`}
                    onClick={() => {
                      handleTabClick(tab);
                    }}
                  >
                    <SectionLabel
                      sourceImage={`/${tab}.png`}
                      text={tab}
                      props={`${activeTab === tab ? "text-white" : "text-not-white hover:text-white"}`}
                    />
                  </button>
                  <div
                    id="artificial-border"
                    className="hidden sm:block w-[1px] h-6 bg-idle-purple-b"
                  ></div>
                </>
              );
            })}

            {/* DAYS TABS DESKTOP */}
            {activeTab === "Results" && (
              <>
                {tourneyDays.map((day, index) => (
                  <>
                    <button
                      key={index}
                      className={`hidden md:block hover:bg-active-purple lg:px-3 px-2 py-[.1rem] my-1 mx-1 rounded ${activeDayIndex === index ? "text-white bg-active-purple" : "text-not-white"}`}
                      onClick={() => handleDaysClick(index)}
                    >
                      Day {index + 1}
                    </button>
                    <div
                      id="artificial-border"
                      className="hidden md:block w-[1px] h-6 bg-idle-purple-b"
                    ></div>
                  </>
                ))}
              </>
            )}
          </div>

          {/* DAYS TABS MOBILE */}
          {activeTab === "Results" && (
            <div className="flex items-center justify-center">
              {tourneyDays.map((day, index) => (
                <>
                  <button
                    key={index}
                    className={`md:hidden hover:bg-active-purple px-3 py-[.1rem] my-1 mx-1 rounded ${activeDayIndex === index ? "text-white bg-active-purple" : "text-not-white"}`}
                    onClick={() => handleDaysClick(index)}
                  >
                    Day {index + 1}
                  </button>
                  <div
                    id="artificial-border"
                    className="md:hidden w-[1px] h-6 bg-idle-purple-b"
                  ></div>
                </>
              ))}
            </div>
          )}

          {/* OVERVIEW SECTION */}
          {activeTab === "Overview" && (
            <>
              <div className="flex flex-row items-center justify-center mt-40">
                <Image src="/teemo.png" width={100} height={100} alt="icon" />
                <div className="text-not-white italic text-center">WIP</div>
              </div>
            </>
          )}

          {/* RESULTS SECTION */}

          {/* EACH DAY'S DATA */}
          {activeTab === "Results" && (
            <div className="">
              <GamesForDay tournament={tournament} dayIndex={activeDayIndex} />
            </div>
          )}

          {/* STANDINGS SECTION MOBILE */}
          {activeTab === "Standings" && (
            <div id="standings" className="h-[39rem] sm:hidden">
              <div className="flex items-center justify-center gap-2">
                <div id="standings-days-buttons" className="flex items-center">
                  {tourneyDays.map((day, index) => (
                    <>
                      <button
                        key={index}
                        className={`hover:bg-active-purple px-3 py-[.1rem] my-1 mx-1 rounded ${activeDayIndex === index ? "text-white bg-active-purple" : "text-not-white"}`}
                        onClick={() => handleDaysClick(index)}
                      >
                        Day {index + 1}
                      </button>
                      <div
                        id="artificial-border"
                        className="w-[1px] h-6 bg-idle-purple-b"
                      ></div>
                    </>
                  ))}
                </div>
              </div>
              <div className="sm:mx-12">
                <StandingsForDay
                  tournament={tournament}
                  dayIndex={activeDayIndex}
                />
              </div>
            </div>
          )}
          {/* END STANDINGS SECTION MOBILE */}
        </div>
        {/* END RESULTS & OVERVIEW SECTION */}
      </div>

      {/* STANDINGS SECTION DESKTOP */}
      <div
        id="standings"
        className="text-sm lg:text-base hidden h-full sm:block grow max-w-[25rem] min-w-[17rem] h-[84vh] bg-darker-blue bg-opacity-80 backdrop-blur rounded-md"
      >
        <div className="flex items-center gap-2 border-b border-idle-purple-b">
          <SectionLabel
            sourceImage="/crown.png"
            text="Standings"
            props="mr-3 lg:mr-0"
          />
          <div
            id="artificial-border"
            className=" w-[1px] h-6 bg-idle-purple-b"
          ></div>

          <div id="standings-days-buttons" className="flex items-center -ml-2">
            {tourneyDays.map((day, index) => (
              <>
                <button
                  key={index}
                  className={`hover:bg-active-purple min-w-12 py-[.1rem] my-1 mx-1 rounded ${activeDayIndex === index ? "text-white bg-active-purple" : "text-not-white"}`}
                  onClick={() => handleDaysClick(index)}
                >
                  Day {index + 1}
                </button>
                <div
                  id="artificial-border"
                  className="w-[1px] h-6 bg-idle-purple-b"
                ></div>
              </>
            ))}
          </div>
        </div>
        {/* WIP */}
        {/* <div className="flex flex-row items-center justify-center">
          <Image src="/poro.png" width={100} height={100} alt="icon" />
          <div className="text-not-white italic text-center">WIP</div>
        </div> */}

        <StandingsForDay tournament={tournament} dayIndex={activeDayIndex} />
      </div>
      {/* END STANDINGS SECTION */}
    </div>
  );
};

export default NewTourneyNav;
