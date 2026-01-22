
export enum Difficulty {
  EASY = 'Easy',
  MODERATE = 'Moderate',
  CHALLENGING = 'Challenging',
  EXPERT = 'Expert'
}

export interface Trek {
  id: string;
  title: string;
  location: string;
  description: string;
  difficulty: Difficulty;
  date: string;
  members: number;
  maxMembers: number;
  organizer: {
    name: string;
    avatar?: string;
    id: string;
  };
  image: string;
  cost?: string;
}

export interface Ad {
  id: string;
  brand: string;
  title: string;
  description: string;
  image: string;
  logoLetter: string;
  logoBg: string;
  rating?: number;
  tag?: string;
}
