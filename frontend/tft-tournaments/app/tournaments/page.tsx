import Heading from "../components/heading";
import TournamentTabs from "../components/tabs";
// import { tournamentsExample } from "../data/data";
import { getTourneys } from "../data/data";

export default async function Tournaments() {
  // const tourneyNames = await getTourneys();

  return (
    <>
      <Heading>Tournaments</Heading>
      <div className="flex justify-center">
        <TournamentTabs />
      </div>
    </>
  );
}
