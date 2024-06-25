"use client";
import { useState } from "react";

const tourneyTabs = ["Info", "Games", "Standings"];

const TourneyNav = () => {
  const [activeTab, setActiveTab] = useState(tourneyTabs[0]);

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="flex space-x-4 bg-white text-black p-4 ">
        {tourneyTabs.map((tab) => (
          <button
            key={tab}
            className={` uppercase py-2 px-4 rounded font-bold border ${
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
              <div> Tournament Info - date</div>
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
              downs into lobbies 1-8{" "}
            </div>
          </>
        )}

        {/* STANDINGS SECTION */}
        {activeTab === "Standings" && (
          <>
            <div className="absolute justify-end right-0 mr-40 -mt-20 text-black text-7xl uppercase font-bold">
              STANDINGS
            </div>
            <div>
              This is the content for standings - list out all players and their
              placement{" "}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TourneyNav;
