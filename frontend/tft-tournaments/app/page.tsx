import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css"; // You can also use <link> for styles
// ..
// AOS.init();

export default function Home() {
  return (
    <>
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

        <div className="bg-white">Hello</div>
      </div>
    </>
  );
}
