import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css"; // You can also use <link> for styles
// ..
// AOS.init();

export default function Home() {
  return (
    <>
      {/* hero */}
      {/* <div className="relative w-full h-[45rem]">
        <div className="flex items-center justify-center bg-fixed bg-pengu bg-center bg-cover md:bg-cover h-[45rem] w-full">
          <div
            className="z-10 uppercase font-bold text-5xl text-center md:text-8xl mix-blend-exclusion"
            // data-aos="fade-in"
            // data-aos-duration="500"
          >
            Welcome to TFTourneys
          </div>
          <div className="absolute inset-0 bg-black opacity-60 mix-blend-multiply"></div>
        </div>
      </div> */}
      <div className="h-[45rem] ">
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
                TFTourneys
              </div>
            </div>
          </div>
          <Image
            src="/section-1-img.png"
            height={400}
            width={400}
            alt="logo"
            className="m-[8rem] z-0 -order-1 md:order-1 hidden md:block"
          />
          {/* mobile image */}
          <Image
            src="/section-1-img.png"
            height={300}
            width={300}
            alt="logo"
            className="m-8 mt-[4rem] z-0 -order-1 md:order-1 md:hidden"
          />
        </div>
      </div>

      {/* section 1 */}
      {/* <div className="h-[40rem] mt-20">
        <div className="flex flex-col md:flex-row">
          <div
          // data-aos-delay="50"
          // data-aos="fade-down-left"
          // data-aos-duration="1000"
          // data-aos-offset="200"
          >
            <Image
              src="/section-1-img.png"
              height={400}
              width={400}
              alt="logo"
              className="m-[8rem] flex hidden md:block"
            />
          </div> */}
      {/* mobile version of image */}
      {/* <div
          // data-aos-delay="50"
          // data-aos="fade-down-left"
          // data-aos-duration="1000"
          // data-aos-offset="200"
          >
            <Image
              src="/section-1-img.png"
              height={200}
              width={200}
              alt="logo"
              className="ml-[8rem] mt-[3rem] md:hidden "
            />
          </div>
          <div className="flex items-center mx-10 md:mx-24">
            <div className="flex-row">
              <h1
                className="mb-3 text-3xl md:text-5xl font-greycliff font-bold"
                // data-aos="zoom-in-right"
                // data-aos-duration="1000"
              >
                EXPLORE COMPETITIVE TFT
              </h1>
              <div
              // data-aos="zoom-in-right"
              // data-aos-duration="1000"
              // data-aos-delay="100"
              >
                TFTourneys is dedicated to all things related to TFT Esports!
                Follow LIVE and upcoming tournaments or explore the results of
                past tournaments.
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* section 2 */}
      {/* <div className="h-[40rem]">
        <div className="flex md:flex-row flex-col items-center">
          <div className="mx-10 md:mx-24">
            <div className="relative h-[10rem] w-[20rem] md:h-[30rem] md:mr-[4rem]">
              <Image
                src="/section-2-img.gif"
                unoptimized={true}
                fill={true}
                alt="section2"
                className="md:hidden"
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
      </div> */}

      {/* section 2 */}
      {/* <div className="h-[40rem] md:mt-20">
        <div className="flex flex-col md:flex-row"> */}
      {/* mobile version of image */}
      {/* <div
            className="flex flex-col items-center"
            // data-aos-delay="50"
            // data-aos="fade-down-right"
            // data-aos-duration="1000"
          >
            <div className="md:hidden relative h-[10rem] w-[20rem]">
              <Image
                src="/section-2-img.gif"
                unoptimized={true}
                fill={true}
                alt="section2"
                className=""
              />
            </div>
          </div> */}

      {/* <div className="flex items-center mx-10 md:mx-24 mt-10">
            <div className="flex-row">
              <h1
                className="mb-3 text-3xl md:text-5xl font-greycliff font-bold"
                // data-aos="zoom-in-left"
                // data-aos-duration="1000"
              >
                FOLLOW YOUR FAVORITE PLAYERS
              </h1>
              <div
              // data-aos="zoom-in-left"
              // data-aos-duration="1000"
              // data-aos-delay="100"
              >
                Track the best of the best and see how their performances line
                up against their competitors.
              </div>
            </div>
            <div
              className="md:block hidden relative h-[25rem] w-[47rem]"
              // data-aos-delay="50"
              // data-aos="fade-down-right"
              // data-aos-duration="1000"
            >
              <Image
                src="/section-2-img.gif"
                unoptimized={true}
                fill={true}
                alt="section2"
                className=""
              />
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
}
