import Button from "../components/button";
import Heading from "../components/heading";
import Image from "next/image";

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

      {/* background image section
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
        <div className="absolute inset-0 bg-gradient-to-r from-pris-pink via-pris-blue to-pris-purple opacity-70 mix-blend-multiply"></div>
        <div className="absolute top-[10rem] h-[40rem] w-full bg-gradient-to-t from-darkest-blue from-40%"></div>
      </div> */}

      {/* content */}

      <div className="flex flex-col gap-10 items-center justify-center">
        <div className="-ml-[8rem]">
          <Heading>Meet the Team</Heading>
        </div>

        <div className="flex">
          <div className="flex flex-col items-center">
            <Image
              src="/standin_pfp.png"
              height={300}
              width={300}
              alt="logo"
              className=""
            />
            <div className=" font-bold">Jeffrey</div>
          </div>
          <div className="flex flex-col items-center">
            <Image
              src="/standin_pfp.png"
              height={300}
              width={300}
              alt="logo"
              className=""
            />
            <div className="font-bold">Tean</div>
          </div>
          <div className="flex flex-col items-center">
            <Image
              src="/standin_pfp.png"
              height={300}
              width={300}
              alt="logo"
              className=""
            />
            <div className=" font-bold">Rachel</div>
          </div>
        </div>
        <div className="w-[80%] text-not-white">
        TFTourneys was created under Riot Games&apos; &quot;Legal Jibber Jabber&quot; policy using assets owned by Riot Games.  Riot Games does not endorse or sponsor this project.
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
