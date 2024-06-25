import Heading from "../components/heading";
import TournamentTabs from "../components/tabs";
import { tournamentsExample } from "../data/data";

export default function Tournaments() {
  return (
    <>
      <Heading>Tournaments</Heading>
      <div className="flex justify-center">
        <TournamentTabs tournaments={tournamentsExample} />
      </div>
    </>
  );
}
