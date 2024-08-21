import Heading from "../components/heading";
import TournamentTabs from "../components/tabs";
import ScrollManager from "../components/scrollmanager";
// import { tournamentsExample } from "../data/data";
import { fetchFilteredTournaments, getTourneys } from "../data/data";
import Image from "next/image";
import TabHeader from "../components/tabheader";
import Pagination from "../components/pagination";
// import internal from "stream";
import dynamic from "next/dynamic";

import type { Metadata } from "next";

const TournamentTabsLazy = dynamic(() => import("../components/tabs"), {
  loading: () => <p>Loading...</p>,
});

export const metadata: Metadata = {
  title: "Tournaments",
  description: "Explore all TFT tournaments, live or past.",
};

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
    hasDetail?: string;
  };
}) {
  // const tourneyNames = await getTourneys();

  // console.log(searchParams?.sortParams);

  // const tourneys: any[] = await getTourneys({
  //   sortParams: searchParams?.sortParams || [],
  //   tier: searchParams?.tier || "",
  //   region: searchParams?.region || "",
  //   set: searchParams?.set || "",
  //   dateLowerBound: searchParams?.dateLowerBound || "",
  //   dateUpperBound: searchParams?.dateUpperBound || "",
  //   nameSearchQuery: searchParams?.query || "",
  //   hasDetail: searchParams?.hasDetail || 0,
  // });

  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  console.log("truoanw");
  const { tournaments, totalPages } = await fetchFilteredTournaments({
    query: searchParams?.query,
    page: searchParams?.page,
    sortParams: searchParams?.sortParams || undefined,
    tier: searchParams?.tier || undefined,
    region: searchParams?.region || undefined,
    set: searchParams?.set || undefined,
    dateUpperBound: searchParams?.dateUpperBound || undefined,
    dateLowerBound: searchParams?.dateLowerBound || undefined,
    hasDetail: searchParams?.hasDetail || undefined,
  });

  // console.log("tourneypage working");

  return (
    <>
      <ScrollManager searchParams={searchParams} />

      {/* background image section */}
      <div className="absolute top-0 z-0 bg-gradient-to-b from-darkest-blue from-65% opacity-70 h-20 w-full"></div>
      <div className="animate-fade absolute top-0 -z-20 h-[37rem] w-full">
        <Image
          src="/about_banner.jpg"
          fill={true}
          alt="logo"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-darkest-blue opacity-90 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-pris-light-pink via-pris-yellow to-pris-yellow opacity-50 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-pris-pink via-pris-blue to-pris-purple opacity-50 mix-blend-multiply"></div>
        <div className="absolute top-[10rem] h-[40rem] w-full bg-gradient-to-t from-darkest-blue from-40%"></div>
      </div>

      <div className="text-5xl md:text-7xl">
        <Heading>Tournaments</Heading>
      </div>
      {/* blobs */}
      <div className="relative w-full max-w-lg">
        <div className="absolute top-[2rem] w-[25rem] h-[25rem] bg-pris-blue rounded-full mix-blend-overlay filter blur-3xl animate-blob opacity-80"></div>
        <div className="absolute top-[2rem] -right-[45rem] w-[25rem] h-[25rem] bg-pris-light-pink rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000 opacity-90"></div>
        <div className="absolute top-[2rem] -right-[65rem] w-[25rem] h-[25rem] bg-pris-pink rounded-full mix-blend-overlay filter blur-3xl animate-blob opacity-90"></div>
        <div className="absolute top-[10rem] left-[12rem] w-[25rem] h-[25rem] bg-pris-yellow rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000 opacity-80"></div>
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col w-[80%] rounded">
          <TabHeader totalPages={totalPages} />
          <TournamentTabsLazy tourneys={tournaments} />
        </div>
      </div>
    </>
  );
}
