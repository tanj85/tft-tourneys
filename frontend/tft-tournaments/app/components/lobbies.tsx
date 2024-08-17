import Image from "next/image";
import Button from "./button";
import { useState } from "react";
import { DiVim } from "react-icons/di";
import PlayerList from "./players";

export default function LobbiesForGame({ game }: any) {
  interface Lobby {
    [key: string]: number;
  }

  return (
    <div>
      <div
        id="inner-boxes"
        className="flex flex-col gap-2 max-h-[27rem] sm:max-h-[18rem] md:max-h-[24rem]"
      >
        {game?.lobbies?.map((lobby: Lobby, lobbyIndex: number) => (
          <div
            key={lobbyIndex}
            className="bg-lightest-purple shadow-md shadow-darkest-purple py-2 px-2 relative rounded"
          >
            <div className="text-xs absolute bottom-2 right-4 italic text-not-white">
              {lobbyIndex + 1}
            </div>
            <PlayerList lobby={lobby} />
          </div>
        ))}
      </div>
    </div>
  );
}
