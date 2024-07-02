export default function Heading({ children }: any) {
  return (
    <div className="my-8 h-20 uppercase flex items-end justify-center text-4xl md:text-7xl font-bold">
      <div className="font-soleil border-b py-5">{children}</div>
    </div>
  );
}
