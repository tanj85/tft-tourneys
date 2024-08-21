import { FaCircle } from "react-icons/fa6";
import { getTourneys } from "../data/data";
import Link from "next/link";

export default async function LiveTourneyInfo() {
  const liveTourneys = await getTourneys({
    sortParams: undefined,
    tier: undefined,
    region: undefined,
    set: undefined,
    dateUpperBound: undefined,
    dateLowerBound: undefined,
    hasDetail: undefined,
    live: true,
  });

  console.log("please work");

  return (
    <>
      {liveTourneys.length !== 0 && (
        <>
          <div className="text-xl font-bold flex gap-2 items-center -mb-3">
            <FaCircle className="text-red-500 h-3 w-3" />
            LIVE
          </div>
          <div className="flex gap-2 flex-wrap justify-between">
            {liveTourneys.map((liveTourney) => (
              <>
                <Link
                  href={`/tournaments/${liveTourney.tournament_id}`}
                  className="hover:underline w-[18rem] border-idle-purple-b border bg-idle-purple rounded-md py-2 px-4 "
                >
                  <div className="line-clamp-2">
                    {liveTourney.tournament_name}
                  </div>
                </Link>
              </>
            ))}
          </div>
        </>
      )}
    </>
  );
}
