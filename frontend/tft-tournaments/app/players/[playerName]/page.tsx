import { usePathname } from "next/navigation";
import Image from "next/image";
import NewTourneyNav from "@/app/components/newtourneynav";
import { useEffect, useState } from "react";
import { getPlayerData } from "@/app/data/data";
import SectionLabel from "@/app/components/sectionlabel";
import Link from "next/link";

export default async function PlayerPage({ params }: any) {
  const playerName = params.playerName;
  const playerLink: string = playerName.replace(/_/g, "+").toLowerCase();
  const playerData = await getPlayerData(playerLink);
  const formattedName = playerData.name.endsWith("#eprod")
    ? playerData.name.slice(0, -6)
    : playerData.name;
  const tournamentHistory = playerData["tournament history"];
  console.log(playerData);

  return (
    <>
      <div className="h-screen">
        <div className="absolute top-0 z-0 bg-gradient-to-b from-darkest-blue from-65% opacity-70 h-20 w-full"></div>
        <div className="animate-fade absolute top-0 -z-20 h-[37rem] w-full">
          <Image
            src="/player_bg.jpeg"
            fill={true}
            alt="logo"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-darkest-blue opacity-90 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-pris-light-pink via-pris-yellow to-pris-yellow opacity-50 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-pris-pink via-pris-blue to-pris-purple opacity-50 mix-blend-multiply"></div>
          <div className="absolute bottom-0 h-[40rem] w-full bg-gradient-to-t from-darkest-blue from-20%"></div>
          {/* <div className="absolute bottom-0 h-[22rem] w-full bg-gradient-to-t from-darkest-blue from-90%"></div> */}
        </div>
        {/* {playerData.name} */}
        <div id="content" className="mx-14">
          <div
            id="name-pfp-section"
            className="flex items-center gap-8 mt-8 ml-20"
          >
            <div
              id="pfp"
              className="h-40 w-40 rounded-full overflow-hidden border border-idle-purple"
            >
              <Image
                src="/pfpstandin.png"
                height={160}
                width={160}
                alt="pfp"
                className="object-cover h-full w-full"
              />
            </div>
            <div id="name" className="text-3xl font-bold">
              {formattedName}
            </div>
          </div>
          <div id="boxes-section" className="flex gap-4 mt-8 h-[30rem]  ">
            <div
              id="info"
              className="rounded-lg min-w-[20rem] bg-darker-blue bg-opacity-80 backdrop-blur border border-idle-purple"
            >
              <div id="info-text" className="py-2 border-b border-idle-purple">
                <SectionLabel
                  sourceImage="/Overview.png"
                  text="Info"
                  props="ml-1"
                />
              </div>
            </div>
            <div
              id="prev-tourneys"
              className="rounded-lg bg-darker-blue w-full bg-opacity-80 backdrop-blur border border-idle-purple"
            >
              <div
                id="prev-tourneys-text"
                className="py-2 border-b border-idle-purple"
              >
                <SectionLabel
                  sourceImage="/PrevTourneys.png"
                  text="Previous Tournaments"
                  props="ml-1"
                />
              </div>
              <div className=" max-h-[83%] bg-opacity-60 overflow-auto overscroll-none break-all max-h-[34rem] bg-active-purple sm:m-4 m-2 rounded border-active-purple-b border">
                <div className="flex flex-col">
                  {tournamentHistory.map((tourney: string, index: number) => (
                    <>
                      <Link href="/tournaments">
                        <div
                          key={index}
                          className={`p-4 border-b border-lightest-purple ${index % 2 === 0 ? "bg-active-purple text-white" : "bg-none text-whitish"}`}
                        >
                          {tourney}
                        </div>
                      </Link>
                    </>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
