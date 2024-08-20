import { FaLessThanEqual } from "react-icons/fa6";

const changeBusterInterval = 120;

export const tournamentsExample = [
  {
    id: "1",
    name: "2024 Americas TFT Inkborn Fables Tactician's Cup III",
    days: [
      {
        games: [
          {
            lobbies: [
              {
                "So bio#eprod": 1,
                "prestivent#eprod": 8,
                "seihunkim#eprod": 7,
                "ISG FRITZ#eprod": 6,
                "wilf#eprod": 4,
                "Sealkun Mbappe#eprod": 2,
                "Liquid ego#eprod": 5,
                "Ayy Rick#eprod": 3,
              },
              {
                "thybeaster#eprod": 2,
                "Cambulee#eprod": 5,
                "LilTop#eprod": 3,
                "Lab018biribiri#eprod": 1,
                "Altenahue TFT#eprod": 7,
                "CookiesOP#eprod": 6,
                "Ciulla#eprod": 4,
                "GK Bapzera#eprod": 8,
              },
            ],
          },
          {
            lobbies: [
              {
                "So bio#eprod": 8,
                "prestivent#eprod": 7,
                "seihunkim#eprod": 5,
                "ISG FRITZ#eprod": 4,
                "wilf#eprod": 3,
                "Sealkun Mbappe#eprod": 1,
                "Liquid ego#eprod": 2,
                "Ayy Rick#eprod": 6,
              },
              {
                "thybeaster#eprod": 4,
                "Cambulee#eprod": 2,
                "LilTop#eprod": 1,
                "Lab018biribiri#eprod": 7,
                "Altenahue TFT#eprod": 6,
                "CookiesOP#eprod": 3,
                "Ciulla#eprod": 5,
                "GK Bapzera#eprod": 8,
              },
            ],
          },
        ],
        standings: [
          {
            placement: 1,
            player: "socks#eprod",
            region: "NA",
            "games points": [8, 3, 7, 6, 6, 7, 5],
            total: 42,
            "cumulative total": 98,
            "top 4+1": 7,
            "placement counts": [1, 2, 2, 1, 0, 1, 0, 8],
            "eod placement": 5,
            "game placements": [8, 3, 7, 6, 6, 7],
          },
          {
            placement: 2,
            player: "prestivent#eprod",
            region: "NA",
            "games points": [8, 7, 6, 8, 2, 4, 6],
            total: 41,
            "cumulative total": 105,
            "top 4+1": 7,
            "placement counts": [7, 2, 1, 2, 0, 1, 0, 1, 0],
            "eod placement": 6,
            "game placements": [8, 7, 6, 8, 2, 4],
          },
        ],
      },
    ],
  },
];

function generateCacheBuster(interval: number) {
  const now = new Date();
  const millisecondsPerInterval = interval * 1000; // convert interval from minutes to milliseconds
  const roundedTime = Math.floor(now.getTime() / millisecondsPerInterval) * millisecondsPerInterval;
  // console.log(roundedTime);
  return roundedTime;
}

export const getPlayers = async () => {
  const res = await fetch("http://127.0.0.1:8080/players/", {
    next: { revalidate: 300 },
    method: "GET",
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
  if (!res.ok) {
    throw new Error("failed to fetch data ):");
  }
  return res.json();
};

export const getPlayerData = async (player: string) => {
  const res = await fetch(
    `http://127.0.0.1:8080/players/?name=${player}&tag=eprod`,
    {
      next: { revalidate: 300 },
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
  if (!res.ok) {
    throw new Error("failed to fetch player data");
  }
  return res.json();
};

// data.ts

export async function fetchFilteredTournaments({
  query = "",
  page = "1",
  sortParams = [],
  tier = "",
  region = "",
  set = "",
  dateLowerBound = "",
  dateUpperBound = "",
  hasDetail = "",
  live = undefined,
}: {
  query?: string;
  page?: string;
  sortParams?: string[];
  tier?: string;
  region?: string;
  set?: string;
  dateLowerBound?: string;
  dateUpperBound?: string;
  hasDetail?: string;
  live?: boolean;
}): Promise<{ tournaments: any[]; totalPages: number }> {
  const currentPage = Number(page) || 1;
  const tournamentsPerPage = 10;

  const tourneys = await getTourneys({
    sortParams,
    tier,
    region,
    set,
    dateLowerBound,
    dateUpperBound,
    nameSearchQuery: query,
    hasDetail: hasDetail,
    live,
  });

  // console.log(tourneys.slice(0,10));

  const totalTournaments = tourneys.length;
  const totalPages = Math.ceil(totalTournaments / tournamentsPerPage);
  // Calculate the start and end index for pagination
  const startIndex = (currentPage - 1) * tournamentsPerPage;
  const endIndex = Math.min(startIndex + tournamentsPerPage, totalTournaments);

  // Slice the array to get the tournaments for the current page
  const paginatedTournaments = tourneys.slice(startIndex, endIndex);

  return {
    tournaments: paginatedTournaments,
    totalPages,
  };
}

interface GetTourneysParams {
  sortParams?: string[];
  tier?: string;
  region?: string;
  set?: string;
  dateLowerBound?: string;
  dateUpperBound?: string;
  nameSearchQuery?: string;
  hasDetail?: string;
  live?: boolean;
}

export interface FilterState {
  region: string;
  tier: string;
  startDate: string;
  endDate: string;
  searchQuery: string;
}

export interface Tournament {
  tournament_name: string;
  tournament_id: number;
  start_date: string;
  end_date: string;
  num_participants: number;
  patch: string;
  region: string;
  tier: string;
  liquipedia_link: string;
  has_detail: boolean;
}

export interface TournamentResponse {
  tournaments: Tournament[];
}

export const getTourneys = async ({
  sortParams = [],
  tier = "",
  region = "",
  set = "",
  dateLowerBound = "",
  dateUpperBound = "",
  nameSearchQuery = "",
  hasDetail = "",
  live = undefined,
}: GetTourneysParams = {}): Promise<any[]> => {
  // Construct the query string based on input parameters
  let queryParams = new URLSearchParams();

  // Add sort parameters if any
  if (typeof sortParams === "string") {
    queryParams.set("sort", sortParams);
  } else {
    sortParams.forEach((param) => {
      queryParams.append("sort", param);
    });
  }

  // Add other filters
  if (tier) queryParams.set("tier", tier);
  if (region) queryParams.set("region", region);
  if (set) queryParams.set("set", set);
  if (dateLowerBound) queryParams.set("date_lower_bound", dateLowerBound);
  if (dateUpperBound) queryParams.set("date_upper_bound", dateUpperBound);
  if (nameSearchQuery) queryParams.set("name_search_query", nameSearchQuery);
  if (hasDetail) queryParams.set("has_detail", hasDetail);
  if (live !== undefined) queryParams.set("live", live ? "true" : "false");
  // Construct the final URL
  const url = `http://127.0.0.1:8080/tournaments/?${queryParams.toString()}&cb=${generateCacheBuster(changeBusterInterval)}`;

  const result = await fetch(url, {
    method: "GET",
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    },
  });

  if (!result.ok) {
    throw new Error("Failed to fetch tourneys data");
  }

  return result.json();
};

// export const getTourneyData = async () => {
//   // Get the list of tournaments
//   const tourneys = await getTourneys();
//   console.log(tourneys[0]);

//   // Create an array of fetch promises for each tournament
//   const fetchPromises = tourneys
//     .filter(
//       (tourney: any) =>
//         tourney.tournament_id &&
//         Number.isInteger(tourney.tournament_id) &&
//         tourney.tournament_id > 0
//     )
//     .map((tourney: any) => {
//       return fetch(
//         `http://127.0.0.1:8080/tournaments/?id=${tourney.tournament_id}`,
//         {
//           method: "GET",
//           headers: {
//             "Cache-Control": "no-cache",
//             Pragma: "no-cache",
//             Expires: "0",
//           },
//         }
//       ).then((result) => {
//         if (!result.ok) {
//           throw new Error("Failed to fetch specific tourney data");
//         }
//         return result.json();
//       });
//     });

//   // Wait for all fetch promises to resolve
//   const results = await Promise.all(fetchPromises);

//   return results;
// };

export const getOneTourneyData = async (tournament_id: number) => {
  if (!Number.isInteger(tournament_id) || tournament_id <= 0) {
    throw new Error("Invalid tournament ID provided");
  }

  try {
    const response = await fetch(
      `http://127.0.0.1:8080/tournaments/?id=${tournament_id}&cb=${generateCacheBuster(changeBusterInterval)}`,
      {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch tournament data");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching tournament data: ${error.message}`);
  }
};
