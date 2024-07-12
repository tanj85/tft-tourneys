export default function Button({ children, onClick, active }: any) {
  return (
    <div className="flex">
      <button onClick={onClick}>
        <div
          className={`hover:text-white hover:bg-active-purple hover:border-active-purple-b text-not-white border rounded-2xl px-4 py-[.2rem] ${active ? "bg-active-purple text-white border-active-purple-b" : "bg-idle-purple border-idle-purple-b"}`}
        >
          {children}
        </div>
      </button>
    </div>
  );
}
