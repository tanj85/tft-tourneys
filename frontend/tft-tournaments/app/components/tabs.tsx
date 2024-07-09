import Link from "next/link";

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
          <div className="hidden md:block">PATCH</div>
        </div>
        <div className="flex flex-col w-full ">
          {tourneys.map((tourney: any) => (
            <div
              key={tourney.id}
              className="hover:bg-pris-yellow hover:bg-opacity-20 transition-colors duration-300 border rounded"
            >
              <Link href={`/tournaments/${tourney.id}`} key={tourney.id}>
                <div className="p-4 rounded-md mx-2">
                  <div className="grid grid-cols-5 gap-8 text-center items-center hover:text-pris-yellow">
                    <div className="md:col-span-1 col-span-2 text-left font-bold text-balance">
                      {tourney.name}
                    </div>
                    <div>{tourney.tier}</div>
                    <div>{tourney.region}</div>
                    <div className="hidden md:block">
                      {tourney.num_participants}
                    </div>
                    <div className="hidden md:block">{tourney.patch}</div>
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
