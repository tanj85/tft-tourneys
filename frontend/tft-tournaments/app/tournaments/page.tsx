import Heading from "../components/heading";
import TournamentTabs from "../components/tabs";
// import { tournamentsExample } from "../data/data";
import { getTourneys } from "../data/data";
import Image from "next/image";
import TabHeader from "../components/tabheader"

export default async function Tournaments({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    sortParams?: string[];
    tier?: string;
    region?: string;
    set?: string;
    dateLowerBound?: string;
    dateUpperBound?: string;
  };
}) {
  // const tourneyNames = await getTourneys();

  // console.log(searchParams?.sortParams);

  const tourneys: any[] = await getTourneys({
    sortParams: searchParams?.sortParams || ['-start_date'],
    tier: searchParams?.tier || '',
    region: searchParams?.region || '',
    set: searchParams?.set || '',
    dateLowerBound: searchParams?.dateLowerBound || '',
    dateUpperBound: searchParams?.dateUpperBound || '',
    nameSearchQuery: searchParams?.query || ''
  });

  return (
    <>
      {/* background image section
      <div className="absolute top-0 z-0 bg-gradient-to-b from-darkest-blue from-65% opacity-70 h-20 w-full"></div>
      <div className="animate-fade absolute top-0 -z-20 h-[37rem] w-full">
        <Image
          src="/inkborn_banner.jpg"
          fill={true}
          alt="logo"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-darkest-blue opacity-90 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-pris-light-pink via-pris-blue to-pris-yellow opacity-70 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-pris-light-pink via-pris-blue to-pris-yellow opacity-70 mix-blend-multiply"></div>
        <div className="absolute top-[10rem] h-[40rem] w-full bg-gradient-to-t from-darkest-blue from-40%"></div>
      </div> */}

      {/* background image section */}
      <div className="absolute top-0 z-0 bg-gradient-to-b from-darkest-blue from-65% opacity-70 h-20 w-full"></div>
      <div className="animate-fade absolute top-0 -z-20 h-[37rem] w-full">
        <Image
          src="/about_banner.jpg"
          fill={true}
          alt="logo"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-darkest-blue opacity-90 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-pris-light-pink via-pris-yellow to-pris-yellow opacity-50 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-pris-pink via-pris-blue to-pris-purple opacity-50 mix-blend-multiply"></div>
        <div className="absolute top-[10rem] h-[40rem] w-full bg-gradient-to-t from-darkest-blue from-40%"></div>
      </div>
      
      <Heading>Tournaments</Heading>
      {/* blobs */}
      <div className="relative w-full max-w-lg">
        <div className="absolute top-[2rem] w-[25rem] h-[25rem] bg-pris-blue rounded-full mix-blend-overlay filter blur-3xl animate-blob opacity-80"></div>
        <div className="absolute top-[2rem] -right-[45rem] w-[25rem] h-[25rem] bg-pris-light-pink rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000 opacity-90"></div>
      <div className="absolute top-[2rem] -right-[65rem] w-[25rem] h-[25rem] bg-pris-pink rounded-full mix-blend-overlay filter blur-3xl animate-blob opacity-90"></div>
        <div className="absolute top-[10rem] left-[12rem] w-[25rem] h-[25rem] bg-pris-yellow rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000 opacity-80"></div>
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col w-[80%] rounded">
          <TabHeader />
          <TournamentTabs tourneys = {tourneys} />
        </div>
      </div>
    </>
  );
}