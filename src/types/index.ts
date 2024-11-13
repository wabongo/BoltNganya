export interface Category {
  id: string;
  name: string;
  description: string;
  order: number;
  isVotingOpen: boolean;
  winnerNomineeId?: string;
}

export interface Nominee {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  image: string;
  votes: number;
  isWinner?: boolean;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  description: string;
  image: string;
  categoryId?: string;
}

export interface Vote {
  id: string;
  nomineeId: string;
  categoryId: string;
  timestamp: number;
  userId: string;
}