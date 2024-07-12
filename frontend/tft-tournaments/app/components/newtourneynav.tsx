"use client";
import { useEffect, useState } from "react";
import SectionLabel from "./sectionlabel";
import GamesForDay from "./games";
import Image from "next/image";
import { formatDate } from "../data/utils";

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
const tourneyTabs = ["Overview", "Results"];

const NewTourneyNav = ({ tournament }: any) => {
  const id = tournament.id;
  const name = tournament.name;
  const region = tournament.region;
  const start = tournament.start_date;
  const end = tournament.end_date;
  const patch = tournament.patch;
  const days = tournament.days;
  const tier = tournament.tier;
  // const participants = tournament.num_participants;

  const standings = tournament.standings;
  // const [activeDay, setActiveDay] = useState(dayTabs[0]);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(tourneyTabs[0]);
  // id == sessionStorage.getItem("currentTourney")
  //   ? sessionStorage.getItem("activeTab") || tourneyTabs[0]
  //   : tourneyTabs[0]
  const [tourneyDays, setTourneyDays] = useState<any[]>([]);
  const [tourneyStandings, setTourneyStandings] = useState<Map<any, any>>(
    new Map()
  );

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
    sessionStorage.setItem("activeTab", tab); // Save the current tab to sessionStorage
  };

  const handleDaysClick = (index: any) => {
    // setActiveDay(dayTabs[index]);
    setActiveDayIndex(index);
  };

  useEffect(() => {
    setTourneyDays(days);
    if (standings) {
      const standingsMap = new Map(Object.entries(standings));
      setTourneyStandings(standingsMap);
    }
    sessionStorage.setItem("currentTourney", id);
  }, [days, standings]);

  const standingsEntries = Array.from(tourneyStandings.entries());
  standingsEntries.sort((a, b) => b[1] - a[1]); // sort the entries by value (descending order)

  return (
    <div id="entire-page" className="gap-3 mx-14 mt-4 flex h-[84vh]">
      {/* NAME & INFO SECTION */}
      <div id="name-info-results" className="md:w-[70%] flex flex-col gap-2">
        <div id="name-info" className="">
          <div className="text-4xl font-bold">{name}</div>
          <div id="info" className="flex py-2 justify-between">
            <div> {region} </div>
            <div> {tier} Tier </div>
            <div> Patch {patch} </div>
            <div>
              {formatDate(start)} - {formatDate(end)}
            </div>
          </div>
        </div>
        {/* END INFO & NAME SECTION */}

        {/* RESULTS & OVERVIEW SECTION */}
        <div
          id="results-overview"
          className="h-[40rem] bg-darker-blue rounded-md bg-opacity-80 backdrop-blur"
        >
          <div
            id="results-overview-tabs"
            className="flex border-b border-idle-purple-b items-center"
          >
            {tourneyTabs.map((tab) => (
              <>
                <button
                  key={tab}
                  className={`hover:bg-active-purple my-1 mx-1 rounded ${activeTab === tab ? "text-white bg-active-purple" : ""}`}
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
                  className="w-[1px] h-6 bg-idle-purple-b"
                ></div>
              </>
            ))}

            {/* DAYS TABS */}
            {activeTab === "Results" && (
              <>
                {tourneyDays.map((day, index) => (
                  <>
                    <button
                      key={index}
                      className={`hover:bg-active-purple px-3 py-[.1rem] my-1 mx-1 rounded ${activeDayIndex === index ? "text-white bg-active-purple" : "text-not-white"}`}
                      onClick={() => handleDaysClick(index)}
                    >
                      {/* <SectionLabel
                        sourceImage={`/${tab}.png`}
                        text={tab}
                        props={`${activeTab === tab ? "text-white" : "text-not-white hover:text-white"}`}
                      /> */}
                      Day {index + 1}
                    </button>
                    <div
                      id="artificial-border"
                      className="w-[1px] h-6 bg-idle-purple-b"
                    ></div>
                  </>
                ))}
              </>
            )}
          </div>

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
        </div>
        {/* END RESULTS & OVERVIEW SECTION */}
      </div>

      {/* STANDINGS SECTION */}
      <div
        id="standings"
        className="hidden h-full md:block grow h-[84vh] bg-darker-blue bg-opacity-80 backdrop-blur rounded-md"
      >
        <div className="mt-1 flex gap-2 divide-x divide-idle-purple-b border-b border-idle-purple-b">
          <SectionLabel
            sourceImage="/crown.png"
            text="Standings"
            props="mb-1"
          />
        </div>
        <div className="flex flex-row items-center justify-center">
          <Image src="/poro.png" width={100} height={100} alt="icon" />
          <div className="text-not-white italic text-center">WIP</div>
        </div>
      </div>
      {/* END STANDINGS SECTION */}
    </div>
  );
};

export default NewTourneyNav;
