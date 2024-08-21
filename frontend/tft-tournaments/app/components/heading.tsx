export default function Heading({ children }: any) {
  return (
    <>
      <div className="relative animate-slidein">
        <div className="mt-[10rem] mb-2 h-24 flex items-end mx-[10vw] font-bold">
          <div className="font-soleil py-4 shrink">
            <h1>{children}</h1>
          </div>
        </div>
      </div>
    </>
  );
}
