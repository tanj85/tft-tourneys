import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bob2, BobAnimation, FlyIn } from "./components/animations";
import { getTourneys } from "./data/data";
import { FaCircle } from "react-icons/fa6";
// import { LiveWrapper } from "./components/livewrapper";
import LiveTourneyInfo from "./components/livetourneys";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export default async function Home() {
  // console.log(liveTourneys.length);
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

  return (
    <>
      {/* blobs */}
      <div className="relative w-full max-w-lg">
        <div className="absolute top-[18rem] md:top-[6rem] -left-[4rem] md:left-[5rem] w-[25rem] h-[25rem] bg-pris-blue rounded-full mix-blend-overlay filter blur-2xl animate-blob opacity-80"></div>
        <div className="absolute top-[18rem] md:top-[6rem] -right-[10rem] md:-right-[15rem] w-[20rem] h-[20rem] md:w-[25rem] md:h-[25rem] bg-pris-light-pink rounded-full mix-blend-overlay filter blur-3xl md:blur-2xl animate-blob animation-delay-2000 opacity-90"></div>
        <div className="absolute top-[22rem] md:top-[14rem] left-[6rem] md:left-[12rem] w-[25rem] h-[25rem] bg-pris-yellow rounded-full mix-blend-overlay filter blur-2xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="mt-4 md:text-left text-center flex justify-center items-center flex-wrap mx-auto">
        <div className="text-5xl md:text-7xl font-bold w-[30rem] z-0">
          <div className="mb-2">Welcome to</div>
          <div className="text-6xl md:text-8xl md:-mr-8">
            <div className="animate-gradient gradient-text text-transparent">
              <h1>TFTourneys</h1>
            </div>
          </div>
        </div>
        <BobAnimation>
          <Image
            src="/section-1-img.png"
            height={400}
            width={400}
            alt="logo"
            className="m-[8rem] z-0 -order-1 md:order-1 hidden md:block"
            priority
          />
        </BobAnimation>
        {/* mobile image */}
        <BobAnimation>
          <Image
            src="/section-1-img.png"
            height={300}
            width={300}
            alt="logo"
            className="m-8 mt-[4rem] z-0 -order-1 md:order-1 md:hidden"
            priority
          />
        </BobAnimation>
      </div>

      {/* section 1 banner */}
      <div className="mt-[25vh] relative">
        <div className="flex">
          <Image
            src="/section1banner.png"
            height={1000}
            width={1000}
            alt="logo"
            className="w-full min-h-[20rem] object-cover"
          />
        </div>
        <div className="absolute -inset-[.5px] bg-gradient-to-t from-darkest-blue mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-pris-light-pink via-pris-yellow to-pris-yellow opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-pris-pink via-pris-blue to-pris-purple opacity-20 mix-blend-multiply"></div>
        <div className="absolute top-[10rem] h-[40rem] w-full bg-gradient-to-t from-darkest-blue from-40%"></div>
      </div>

      <div className="flex justify-center items-center flex-wrap mx-auto">
        <div className="relative w-[35rem] h-[25rem]">
          <Bob2>
            <Image
              src="/poro1.png"
              height={800}
              width={800}
              alt="logo"
              className="absolute -top-24 left-0 sm:-left-20"
            />
          </Bob2>
        </div>

        <div className="flex w-[20rem] sm:w-[40vw] flex-col gap-6 relative z-20">
          <div className="text-5xl font-bold">
            <h2>Explore All Tournaments</h2>
          </div>
          <div className="text-xl">
            From qualifiers to Worlds, find all you need to know here.
          </div>

          {/* <LiveWrapper slot={<LiveTourneyInfo />} /> */}
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
          <Link
            href="/tournaments"
            className="text-xl font-bold bg-button-blue py-2 px-2 text-center rounded-xl"
          >
            Let&apos;s go!
          </Link>
        </div>
      </div>

      {/* section 2 banner */}
      <div className="mt-20 relative">
        <div className="flex">
          <Image
            src="/section2banner.png"
            height={1000}
            width={1000}
            alt="logo"
            className="w-full min-h-[20rem] object-cover"
          />
        </div>
        <div className="absolute -inset-[.5px] bg-gradient-to-t from-darkest-blue mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-pris-light-pink via-pris-yellow to-pris-yellow opacity-80 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-pris-pink via-pris-blue to-pris-purple opacity-80 mix-blend-multiply"></div>
        <div className="absolute top-[10rem] h-[40rem] w-full bg-gradient-to-t from-darkest-blue from-40%"></div>
      </div>

      <div className="flex justify-center items-center flex-wrap-reverse mx-auto mb-24">
        <div className="flex w-[20rem] sm:w-[40vw] flex-col gap-6 relative z-20">
          <div className="text-5xl font-bold">
            <h2>Track Your Favorite Players</h2>
          </div>
          <div className="text-xl">
            Check standings from each day of the tournament!
          </div>
        </div>

        <div className="relative w-[35rem] h-[20rem]">
          <Bob2>
            <Image
              src="/penguclean.png"
              height={800}
              width={800}
              alt="logo"
              className="absolute -top-24 left-0 sm:-left-20"
            />
          </Bob2>
        </div>
      </div>
    </>
  );
}
