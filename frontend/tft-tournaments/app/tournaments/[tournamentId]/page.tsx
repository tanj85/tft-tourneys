import TourneyNav from "@/app/components/tourneynav";
import { getTourneyData } from "@/app/data/data";

export default async function TournamentPage({ params }: any) {
  const tourneyData = await getTourneyData();
  const getTourneyById = (tourneyData: any, id: number) => {
    return tourneyData.find((tourney: any) => tourney.id === id);
  };

  const tourneyId = Number(params.tournamentId);
  const specificTourney = getTourneyById(tourneyData, tourneyId);

  // console.log(specificTourney);

  return (
    <>
      <div className="text-4xl m-4 font-bold">{specificTourney.name}</div>
      <TourneyNav />
      <div></div>
    </>
  );
}
