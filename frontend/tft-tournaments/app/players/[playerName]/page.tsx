import { usePathname } from "next/navigation";
import Image from "next/image";
import NewTourneyNav from "@/app/components/newtourneynav";
import { useEffect, useState } from "react";
import { getPlayerData } from "@/app/data/data";

export default async function PlayerPage({ params }: any) {
  // const [playerInfo, setPlayerInfo] = useState("");
  const playerName = params.playerName;
  // console.log(params.playerName);
  // const playerLink: string = playerName.replace(/\s+/g, "+").toLowerCase();
  const playerLink: string = playerName.replace(/_/g, "+").toLowerCase();
  const playerData = await getPlayerData(playerLink);
  // console.log(playerData);
  // const pathname = usePathname();

  // console.log(pathname);

  // useEffect(() => {
  //   setPlayerInfo(player);
  // });

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
        </div>
        {playerData.name}
        <div></div>
      </div>
    </>
  );
}
