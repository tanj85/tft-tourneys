export default function Home() {
  return (
    <>
      {/* hero */}
      <div className="relative w-full h-[40rem]">
        <div className="flex items-center justify-center bg-fixed bg-pengu bg-cover h-[40rem] w-full">
          <div className="z-10 uppercase font-bold text-8xl mix-blend-exclusion">
            Welcome to TFTourneys
          </div>
          <div className="absolute inset-0 bg-black opacity-60 mix-blend-multiply"></div>
        </div>
      </div>

      {/* section 1 */}
      <div className="h-[40rem]">Hello World</div>
    </>
  );
}
