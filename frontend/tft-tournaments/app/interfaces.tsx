export interface Standings {
    [key: string]: number;
}

export interface Lobby {
    [key: string]: number;
}

export interface Game {
    lobbies: Lobby[];
}

export interface Day {
    standings: Standings;
    num_participants: number;
    day: number;
    sheet_index: number;
    games: Game[];
}

export interface Tournament {
    name: string;
    tier: string;
    region: string;
    start_date: string;
    end_date: string;
    link: string;
    patch: string;
    id: number;
    days: (Day | null)[];
    rules: string[];
}

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    tournament: any;
    player: string;
  }
  
export interface GameInfo {
    player: string;
    day: number;
    game: number;
    lobby: number;
    placement: number;
}

export interface Stats {
    [key: string]: number;
}

export interface PlayerStanding {
    player: string;
    dayPlacement: number;
    points: number;
    num_players: number;
    avp: number;
}

export interface ScrollManagerProps {
    searchParams?: {
      query?: string;
      page?: string;
      sortParams?: string[];
      tier?: string;
      region?: string;
      set?: string;
      dateLowerBound?: string;
      dateUpperBound?: string;
      hasDetail?: string;
    };
  }


export interface GetTourneysParams {
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

  