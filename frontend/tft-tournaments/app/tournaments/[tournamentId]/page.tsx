import { tournamentsExample } from "@/app/data/data";

export default function TournamentPage({ params }: any) {
  // finds correct tourney from json object of all tourneys by matching IDs
  function findMapByID(idToFind: any) {
    return tournamentsExample.find(
      (tournament: any) => tournament.id === idToFind
    );
  }
  const idToFind = params.tournamentId;
  const matchingTourney = findMapByID(idToFind);

  return <div className="text-4xl m-4 font-bold">{matchingTourney?.name}</div>;
}
