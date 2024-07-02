import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* hero */}
      <div className="relative w-full h-[40rem]">
        <div className="flex items-center justify-center bg-fixed bg-pengu bg-center bg-cover md:bg-cover h-[40rem] w-full">
          <div className="z-10 uppercase font-bold text-5xl text-center md:text-left md:text-8xl mix-blend-exclusion">
            Welcome to TFTourneys
          </div>
          <div className="absolute inset-0 bg-black opacity-60 mix-blend-multiply"></div>
        </div>
      </div>

      {/* section 1 */}
      <div className="h-[43rem]">
        <div className="flex flex-col md:flex-row">
          <Image
            src="/section-1-img.png"
            height={400}
            width={400}
            alt="logo"
            className="m-[8rem] flex hidden md:block"
          />

          {/* mobile version of image */}
          <Image
            src="/section-1-img.png"
            height={200}
            width={200}
            alt="logo"
            className="ml-[8rem] mt-[3rem] md:hidden "
          />
          <div className="flex items-center mx-10 md:mx-24">
            <div className="flex-row">
              <h1 className="mb-3 text-3xl md:text-5xl font-greycliff font-bold">
                EXPLORE COMPETITIVE TFT
              </h1>
              TFTourneys is dedicated to all things related to TFT Esports!
              Follow LIVE and upcoming tournaments or explore the results of
              past tournaments.
            </div>
          </div>
        </div>
      </div>

      {/* section 2 */}
      <div className="h-[40rem]">
        <div className="flex md:flex-row flex-col items-center">
          <div className="mx-10 md:mx-24">
            <div className="relative h-[10rem] w-[20rem] md:h-[30rem] md:mr-[4rem]">
              <Image
                src="/section-2-img.gif"
                unoptimized={true}
                fill={true}
                alt="section2"
                className="mt-20 md:hidden"
              />
            </div>
            <h1 className="mt-28 md:-mt-[29rem] mb-3 text-3xl md:text-5xl font-greycliff font-bold">
              FOLLOW YOUR FAVORITE PLAYERS
            </h1>
            <div>
              <div className="w-[40rem]">
                Follow your favorite players and see how their performances line
                up against their competitors.
              </div>
            </div>
          </div>
          <div className="relative h-[20rem] w-[38rem] mr-[4rem]">
            <Image
              src="/section-2-img.gif"
              unoptimized={true}
              fill={true}
              alt="section2"
              className="hidden md:block"
            />
          </div>
        </div>
      </div>
    </>
  );
}
