export default function Heading({ children }: any) {
  return (
    <>
      <div className="relative animate-slidein">
        <div className="mt-[13rem] mb-2 h-24 flex items-end mx-auto ml-[1rem] md:ml-[8rem] text-4xl md:text-7xl font-bold">
          <div className=" font-soleil p-5">{children}</div>
        </div>
      </div>
    </>
  );
}
