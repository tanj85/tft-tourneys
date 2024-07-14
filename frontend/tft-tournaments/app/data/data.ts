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

export const getPlayers = async () => {
  const res = await fetch("http://127.0.0.1:5000/players/", {
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
    `http://127.0.0.1:5000/players/?name=${player}&tag=eprod`,
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

export const getTourneys = async () => {
  const result = await fetch("http://127.0.0.1:5000/tournaments/", {
    next: { revalidate: 300 },
    method: "GET",
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
  if (!result.ok) {
    throw new Error("failed to fetch tourneys data");
  }
  return result.json();
};

export const getTourneyData = async () => {
  // Get the list of tournaments
  const tourneys = await getTourneys();

  // Create an array of fetch promises for each tournament
  const fetchPromises = tourneys.map((tourney: any) => {
    return fetch(`http://127.0.0.1:5000/tournaments/${tourney.id}`, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
    }).then((result) => {
      if (!result.ok) {
        throw new Error("failed to fetch specific tourney data");
      }
      return result.json();
    });
  });

  // Wait for all fetch promises to resolve
  const results = await Promise.all(fetchPromises);

  return results;
};
