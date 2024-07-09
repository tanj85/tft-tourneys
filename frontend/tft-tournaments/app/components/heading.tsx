export default function Heading({ children }: any) {
  return (
    <>
      <div className="relative">
        <div className="mt-[12rem] mb-3 h-24 flex items-end mx-auto ml-[8rem] text-4xl md:text-7xl font-bold">
          <div className=" font-soleil p-5">{children}</div>
        </div>
      </div>
    </>
  );
}
