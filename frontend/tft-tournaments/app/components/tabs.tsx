import Link from "next/link";
import { formatDate } from "../data/utils";

import { getTourneys } from "../data/data";
import { TbCalendarUp, TbCalendarDown, TbCalendarClock } from "react-icons/tb";
import { FaCircle } from "react-icons/fa";
import Image from "next/image";

const TournamentTabs = async ({ tourneys }: any) => {
  return (
    <>
      <div className="flex flex-col w-full gap-2 z-0">
        {tourneys.map((tourney: any) => (
          <>
            {/* Display place header if not empty */}
            {tourney.place_header && (
              <div className="px-4 py-1 capitalize font-bold text-left text-white text-lg flex gap-2 items-center bg-active-purple rounded-md border-active-purple-b border">
                {tourney.place_header === "upcoming" && <TbCalendarUp />}
                {tourney.place_header === "current" && <TbCalendarClock />}
                {tourney.place_header === "past" && <TbCalendarDown />}
                {tourney.place_header === "live" && (
                  <FaCircle className="text-red-500 h-3 w-3" />
                )}
                <div>{tourney.place_header}</div>
              </div>
            )}
            <div
              key={tourney.tournament_id}
              className="flex items-center h-24 hover:border-slate-600 bg-darker-gray transition-colors duration-300 border border-gray-800 rounded hover:border-l-4 hover:border-l-pris-pink"
            >
              <Link
                href={
                  tourney.has_detail
                    ? `/tournaments/${tourney.tournament_id}`
                    : `${tourney.liquipedia_link}`
                }
                key={tourney.tournament_id}
                target={tourney.has_detail ? "_self" : "_blank"}
                rel={tourney.has_detail ? "" : "noopener noreferrer"}
              >
                <div className="p-4 rounded-md mx-2">
                  <div className="grid grid-cols-6 gap-8 text-center items-center">
                    <div className="md:col-span-1 col-span-2 text-left font-bold text-balance w-[100px] lg:w-[200px] truncate-lines-3">
                      {tourney.tournament_name}
                    </div>
                    <div>{tourney.tier}</div>
                    <div className="hidden md:block">{tourney.region}</div>
                    <div className="hidden lg:block">
                      {tourney.num_participants}
                    </div>
                    <div className="flex justify-center items-center col-span-2 sm:col-span-1">
                      {tourney.has_detail ? (
                        <Image
                          height={50}
                          width={50}
                          src="/new_small_logo.png"
                          alt="TFTourneys Logo"
                          className=""
                        />
                      ) : (
                        <Image
                          height={50}
                          width={50}
                          src="/liquipedia_logo.svg"
                          alt="Liquipedia Logo"
                          className=""
                        />
                      )}
                    </div>
                    <div className="hidden md:block">
                      {formatDate(tourney.start_date)}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </>
        ))}
      </div>
    </>
  );
};

export default TournamentTabs;
