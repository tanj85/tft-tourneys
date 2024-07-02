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
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati
              quam asperiores, laborum porro fuga repellat illum animi nobis
              voluptatibus voluptates quidem maxime eum unde vel officia dicta
              iste! Deserunt, maiores et. Eius illum, quidem modi quibusdam
              voluptatibus provident doloribus, ex impedit alias, nihil
              excepturi. Fugit incidunt optio architecto! Voluptatibus fugit
              incidunt rem a magni illo consequatur doloribus natus laudantium
              minus. Officiis dolorum et qui eum officia ad illo voluptate
              quibusdam?
            </div>
          </div>
        </div>
      </div>

      {/* section 2 */}
      <div className="h-[40rem]">
        <div className="flex md:flex-row flex-col items-center">
          <div className="flex items-center mx-10 md:mx-24">
            <div className="flex-row">
              <div className="relative h-[10rem] w-[20rem] md:h-[30rem] md:w-[400rem] md:mr-[4rem]">
                <Image
                  src="/section-2-img.gif"
                  unoptimized={true}
                  fill={true}
                  alt="section2"
                  className="mt-20 md:hidden"
                />
              </div>
              <h1 className="mt-28 mb-3 text-3xl md:text-5xl font-greycliff font-bold">
                FOLLOW YOUR FAVORITE PLAYERS
              </h1>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati
              quam asperiores, laborum porro fuga repellat illum animi nobis
              voluptatibus voluptates quidem maxime eum unde vel officia dicta
              iste! Deserunt, maiores et. Eius illum, quidem modi quibusdam
              voluptatibus provident doloribus, ex impedit alias, nihil
              excepturi.
            </div>
          </div>
          <div className="relative h-[30rem] w-[400rem] mr-[4rem]">
            <Image
              src="/section-2-img.gif"
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
