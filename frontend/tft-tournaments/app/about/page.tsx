import Link from "next/link";
import Button from "../components/button";
import Heading from "../components/heading";
import Image from "next/image";
import { FaDiscord } from "react-icons/fa";
import { FlyIn, FlyInBot, FlyInRight } from "../components/animations";

export default function About() {
  return (
    <>
      {/* background image section */}
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
      </div>

      {/* content */}

      <div className="flex flex-col gap-10 items-center justify-center">
        <div className="text-7xl">
          <Heading>About</Heading>
        </div>

        <div className="text-center -mt-8 mx-[10vw]">
          <FlyInBot delay={0.3}>
            TFTourneys offers a centralized place to view all TFT tournaments -
            past, present, and future.
          </FlyInBot>
        </div>

        {/* <div className="w-[80%] text-not-white"></div> */}
        <div className="mx-[10vw] flex gap-4 flex-col mt-20">
          <div className="flex gap-12 items-center justify-between flex-wrap lg:flex-nowrap">
            <div className="flex gap-6 flex-col">
              <div className="text-5xl font-bold">Live Tournament Scores</div>
              <div
                id="live tournament scores"
                className="gap-4 flex flex-col max-w-[40rem]"
              >
                <div>
                  While a tournament is being played, TFTourneys will update
                  live to present the scores in real time. No more scrounging
                  for a spreadsheet link: all the data you want is in one place.
                </div>
                <div>
                  In a tournament page, you can view the lobby placements for
                  each played game, see standings split by day, and track your
                  favorite players&apos; progress by clicking on their names. We
                  use the official scoresheets to update our databases, so
                  credit goes to the tournament admins for their hard work.
                </div>
              </div>
            </div>
            <div className="lg:flex-shrink-0">
              <FlyInRight>
                <Image
                  src="/aboutimg2.png"
                  height={500}
                  width={500}
                  alt="logo"
                  className="rounded-lg"
                />
              </FlyInRight>
            </div>
          </div>

          <div
            id="tourney finder"
            className="flex gap-6 items-center justify-between flex-wrap-reverse lg:flex-nowrap mt-24"
          >
            <div className="lg:flex-shrink-0">
              <FlyIn>
                <Image
                  src="/aboutimg1.png"
                  height={500}
                  width={500}
                  alt="logo"
                  className="rounded-lg"
                />
              </FlyIn>
            </div>

            <div className="flex flex-col gap-4 max-w-[40rem]">
              <div className="text-5xl font-bold">Tournaments Page</div>
              <div>
                In our tournaments page, tournaments can be searched, filtered,
                and sorted by region, date, or set. For some entries, specific
                game data is not available. Instead, links lead directly to
                Liquipedia pages with full information.
              </div>
            </div>
          </div>

          <div
            id="meet the team"
            className="mt-20 text-6xl text-center font-bold"
          >
            <div>Meet The Team</div>
          </div>
        </div>

        <div className="flex gap-10 mt-4 flex-wrap justify-center">
          <div className="flex flex-col items-center gap-4">
            <FlyInBot delay={0.2}>
              <Image
                src="/tean_pfp.png"
                height={300}
                width={300}
                alt="logo"
                className="rounded-lg min-w-[20rem]"
              />
            </FlyInBot>
            <div className=" font-bold text-lg">Tean</div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <FlyInBot delay={0.3}>
              <Image
                src="/rachel_pfp1.png"
                height={300}
                width={300}
                alt="logo"
                className="rounded-lg min-w-[20rem]"
              />
            </FlyInBot>
            <div className="font-bold text-lg">Rachel</div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <FlyInBot delay={0.4}>
              <Image
                src="/jeffrey_pfp.png"
                height={300}
                width={300}
                alt="logo"
                className="rounded-lg min-w-[20rem]"
              />
            </FlyInBot>
            <div className="font-bold text-lg">Jeffrey</div>
          </div>
          <div className="mx-[10vw] flex gap-4 flex-col">
            <div>
              We are a group of students who created TFTourneys to improve the
              competitive TFT viewing experience. Everyone is familiar with the
              inconvenience that arises from trying to follow official
              competitions. We love the game - everything we do is in support of
              its players and fanbase.
            </div>
            <div>
              TFT has endless potential as the largest competitive strategy game
              in the world, and this is only a step towards making competitive
              TFT fully accessible. Drop by our discord to leave your feedback
              to help us continue to provide the best experience.
            </div>
          </div>
          <Link
            href="https://discord.gg/gPvXy4Nxt4"
            rel="noopener noreferrer"
            target="_blank"
            className="transition ease-in-out delay-50 hover:scale-110 duration-200"
          >
            <FaDiscord className="w-12 h-12 -mt-4" />
          </Link>
        </div>
      </div>

      {/* testing */}
      {/* <div className="flex h-[100vh] w-[100vw] flex-col items-center justify-center">
        <div className="card-wrapper h-[5rem] w-[6rem]">
          <div className="card-content flex items-center justify-center text-xl">
            <div className="max-w-[60%] text-center">Rachel</div>
          </div>
        </div>
      </div> */}
    </>
  );
}
