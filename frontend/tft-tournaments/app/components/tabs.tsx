import Link from "next/link";

const TournamentTabs = ({ tournaments }: any) => {
  return (
    <div className="flex">
      {tournaments.map((tournament: any) => (
        <Link href={`/tournaments/${tournament.id}`} key={tournament.id}>
          <div className="flex flex-col justify-end p-4 h-[14rem] w-[14rem] rounded-md mx-2 text-black hover:text-gray-500 bg-white hover:bg-gray-300 transition-colors duration-300">
            <div className="text-end text-balance">{tournament.name}</div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default TournamentTabs;
