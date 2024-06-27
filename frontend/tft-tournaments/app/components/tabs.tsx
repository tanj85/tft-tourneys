import Link from "next/link";

import { getTourneyData, getTourneys } from "../data/data";

const TournamentTabs = async () => {
  const tourneys = await getTourneys();
  const tourneyData = await getTourneyData();
  console.log(tourneys);

  return (
    <div className="font-bold flex w-full bg-white hover:text-gray-500 hover:bg-gray-300 transition-colors duration-300">
      {tourneys.map((tourney: any) => (
        <Link href={`/tournaments/${tourney.id}`} key={tourney.id}>
          <div className="p-4 rounded-md mx-2 text-black ">
            <div className="">{tourney.name}</div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default TournamentTabs;
