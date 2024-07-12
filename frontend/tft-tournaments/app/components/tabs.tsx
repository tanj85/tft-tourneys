import Link from "next/link";
import { formatDate } from "../data/utils";

import { getTourneyData, getTourneys } from "../data/data";

const TournamentTabs = async () => {
  const tourneys = await getTourneys();
  // console.log(tourneys);

  return (
    <>
      <div className="flex flex-col w-[80%] rounded">
        <div className="grid grid-cols-5 px-6 gap-8 text-center p-4 font-bold">
          <div className="md:col-span-1 col-span-2 text-left">NAME</div>
          <div>TIER</div>
          <div>REGION</div>
          <div className="hidden md:block">PARTICIPANTS</div>
          <div className="hidden md:block">DATE</div>
        </div>
        <div className="flex flex-col w-full gap-2 z-0">
          {tourneys.map((tourney: any) => (
            <div
              key={tourney.id}
              className="hover:border-slate-600 bg-darker-gray transition-colors duration-300 border border-gray-800 rounded hover:border-l-4 hover:border-l-pris-pink"
            >
              <Link href={`/tournaments/${tourney.id}`} key={tourney.id}>
                <div className="p-4 rounded-md mx-2">
                  <div className="grid grid-cols-5 gap-8 text-center items-center">
                    <div className="md:col-span-1 col-span-2 text-left font-bold text-balance">
                      {tourney.name}
                    </div>
                    <div>{tourney.tier}</div>
                    <div>{tourney.region}</div>
                    <div className="hidden md:block">
                      {tourney.num_participants}
                    </div>
                    <div className="hidden md:block">
                      {formatDate(tourney.start_date)}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TournamentTabs;
