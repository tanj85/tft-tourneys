import { getTourneyData } from "@/app/data/data";
import Image from "next/image";
import NewTourneyNav from "@/app/components/newtourneynav";

export default async function TournamentPage({ params }: any) {
  const tourneyData = await getTourneyData();
  const getTourneyById = (tourneyData: any, id: number) => {
    return tourneyData.find((tourney: any) => tourney.id === id);
  };

  const tourneyId = Number(params.tournamentId);
  const specificTourney = getTourneyById(tourneyData, tourneyId);
  // console.log(specificTourney.days);
  // console.log(specificTourney.days[2]);

  console.log(specificTourney);

  return (
    <>
      <div className="h-screen">
        <div className="absolute top-0 z-0 bg-gradient-to-b from-darkest-blue from-65% opacity-70 h-20 w-full"></div>
        <div className="animate-fade absolute top-0 -z-20 h-[37rem] w-full">
          <Image
            src="/dragonlands_banner.jpg"
            fill={true}
            alt="logo"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-darkest-blue opacity-90 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-pris-light-pink via-pris-yellow to-pris-yellow opacity-50 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-pris-pink via-pris-blue to-pris-purple opacity-50 mix-blend-multiply"></div>
          <div className="absolute bottom-0 h-[40rem] w-full bg-gradient-to-t from-darkest-blue from-20%"></div>
        </div>

        <NewTourneyNav tournament={specificTourney} />
        {/* <NewTourneyNav /> */}
        <div></div>
      </div>
    </>
  );
}
