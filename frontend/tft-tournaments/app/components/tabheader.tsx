"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import Pagination from "./pagination";
import SortArrow from "./sortingarrow";

type SortOrder = "asc" | "desc" | undefined;
type SortState = { [key: string]: SortOrder };

export default function TabHeader({ totalPages }: { totalPages: number }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [sortState, setSortState] = useState<SortState>({});
  const [dropdownValues, setDropdownValues] = useState({
    set: searchParams.get("set") || "",
    tier: searchParams.get("tier") || "",
    region: searchParams.get("region") || "",
    hasDetail: searchParams.get("hasDetail") || "",
  });

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleSort = useDebouncedCallback((field: string) => {
    const params = new URLSearchParams(searchParams);
    let sortOrder = "";

    // Toggle between ascending, descending, and clear
    if (sortState[field] === "asc") {
      setSortState({ ...sortState, [field]: undefined });
    } else if (sortState[field] === "desc") {
      sortOrder = field;
      setSortState({ ...sortState, [field]: "asc" });
    } else {
      sortOrder = `-${field}`;
      setSortState({ ...sortState, [field]: "desc" });
    }

    // Remove other sort params
    Object.keys(sortState).forEach((key) => {
      if (key !== field) params.delete("sortParams");
    });

    // Set new sort order in URL
    if (sortOrder) {
      params.set("sortParams", sortOrder);
    } else {
      params.delete("sortParams");
    }

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleDropdownChange = useDebouncedCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      setDropdownValues((prevValues) => ({ ...prevValues, [name]: value }));

      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      replace(`${pathname}?${params.toString()}`);
    },
    300
  );

  return (
    <>
      <div className="flex flex-wrap items-start gap-6 relative z-50 lg:justify-start justify-center mb-2">
        <div className="relative w-full">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <input
            className="block text-black bg-white w-full min-w-[80px] rounded-md border border-gray-200 py-[9px] pl-2 outline-2 placeholder:text-gray-500"
            placeholder={"Search Tournament..."}
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={searchParams.get("query")?.toString()}
          />
        </div>

        <label htmlFor="tier" className="sr-only">
          Tier:
        </label>
        <select
          id="tier"
          className="border text-black bg-white border-gray-200 rounded-md p-2 hover:cursor-pointer"
          value={dropdownValues.tier}
          onChange={(e) => handleDropdownChange("tier", e.target.value)}
        >
          <option value="">Tier: All</option>
          <option value="S">Tier: S</option>
          <option value="A">Tier: A</option>
          <option value="B">Tier: B</option>
          <option value="qual">Tier: Q</option>
        </select>

        <label htmlFor="region" className="sr-only">
          Region:
        </label>

        <select
          id="region"
          className="border text-black bg-white border-gray-200 rounded-md p-2 hover:cursor-pointer"
          value={dropdownValues.region}
          onChange={(e) => handleDropdownChange("region", e.target.value)}
        >
          <option value="">Region: All</option>
          <option value="World">Region: World</option>
          <option value="Americas">Region: Americas</option>
          <option value="Latin America">Region: Latin America</option>
          <option value="Asia-Pacific">Region: Asia-Pacific</option>
          <option value="China">Region: China</option>
          <option value="Brazil">Region: Brazil</option>
          <option value="Korea">Region: South Korea</option>
          <option value="North America">Region: North America</option>
          <option value="Asia">Region: Asia</option>
          <option value="Europe">Region: Europe</option>
          <option value="Oceania">Region: Oceania</option>
          <option value="Middle East">Region: Middle East</option>
          <option value="Africa">Region: Africa</option>
        </select>

        <label htmlFor="tier" className="sr-only">
          Set:
        </label>
        <select
          id="set"
          className="border text-black bg-white border-gray-200 rounded-md p-2 hover:cursor-pointer"
          value={dropdownValues.set}
          onChange={(e) => handleDropdownChange("set", e.target.value)}
        >
          <option value="">Set: All</option>
          <option value="12">Set 12: Magic n&apos; Mayhem</option>
          <option value="11">Set 11: Inkborn Fables</option>
          <option value="10">Set 10: Remix Rumble</option>
          <option value="9">Set 9: Runeterra Reforged</option>
          <option value="8">Set 8: Monster Attack!</option>
          <option value="7">Set 7: Dragonlands</option>
          <option value="6">Set 6: Gizmos & Gadgets</option>
          <option value="5">Set 5: Reckoning</option>
          <option value="4">Set 4: Fates</option>
          <option value="3">Set 3: Galaxies</option>
          <option value="2">Set 2: Faction Wars</option>
          <option value="13">Set 13: Unannounced</option>
        </select>

        <label htmlFor="data-host" className="sr-only">
          Data Host:
        </label>
        <select
          id="data-host"
          className="border text-black bg-white border-gray-200 rounded-md p-2 hover:cursor-pointer"
          value={dropdownValues.hasDetail}
          onChange={(e) => handleDropdownChange("hasDetail", e.target.value)}
        >
          <option value="">Data Host: All</option>
          <option value="TFTourneys">Data Host: TFTourneys</option>
          <option value="Liquipedia">Data Host: Liquipedia</option>
        </select>

        <Pagination totalPages={totalPages} />
      </div>

      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-8 text-center p-4 font-bold relative z-50">
        <div
          className="text-left cursor-pointer flex items-center"
          onClick={() => handleSort("tournament_name")}
        >
          NAME
          <SortArrow sortOrder={sortState["tournament_name"]} />
        </div>
        <div
          className="cursor-pointer flex items-center justify-center"
          onClick={() => handleSort("tier")}
        >
          TIER
          <SortArrow sortOrder={sortState["tier"]} />
        </div>
        <div
          className="cursor-pointer hidden md:flex items-center justify-center"
          onClick={() => handleSort("region")}
        >
          REGION
          <SortArrow sortOrder={sortState["region"]} />
        </div>
        <div
          className="cursor-pointer hidden lg:flex items-center justify-center"
          onClick={() => handleSort("num_participants")}
        >
          PARTICIPANTS
          <SortArrow sortOrder={sortState["num_participants"]} />
        </div>
        <div>DATA</div>
        <div
          className="cursor-pointer hidden md:flex items-center justify-center"
          onClick={() => handleSort("start_date")}
        >
          DATE
          <SortArrow sortOrder={sortState["start_date"]} />
        </div>
      </div>
    </>
  );
}
