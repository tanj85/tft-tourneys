import Link from "next/link";

import { getTourneyData, getTourneys } from "../data/data";

const TournamentTabs = async () => {
  const tourneys = await getTourneys();
  // console.log(tourneys);

  return (
    <>
      <div className="flex flex-col">
        <div className="grid grid-cols-5 px-6 gap-8 border text-center p-4 font-bold">
          <div>NAME</div>
          <div>TIER</div>
          <div>REGION</div>
          <div>PARTICIPANTS</div>
          <div>PATCH</div>
        </div>
        <div className="flex w-full bg-white  hover:bg-gray-300 transition-colors duration-300">
          {tourneys.map((tourney: any) => (
            <Link href={`/tournaments/${tourney.id}`} key={tourney.id}>
              <div className="p-4 rounded-md mx-2 text-black">
                <div className="grid grid-cols-5 gap-8 text-center items-center hover:text-gray-500">
                  <div className="text-left font-bold ">{tourney.name}</div>
                  <div>{tourney.tier}</div>
                  <div>{tourney.region}</div>
                  <div>{tourney.num_participants}</div>
                  <div>{tourney.patch}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default TournamentTabs;
