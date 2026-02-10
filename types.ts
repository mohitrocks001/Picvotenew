
export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
}

export interface Candidate {
  id: string;
  name: string;
  author: string;
  authorId: string;
  imageUrl: string;
  votes: number;
  timestamp: number;
  tags: string[];
  aiCritique?: string;
  category: string;
}

export interface VoteState {
  hasVotedFor: string[];
}

export type SortOption = 'votes' | 'newest' | 'oldest';
export type Category = 'All' | 'Nature' | 'Urban' | 'Minimalist' | 'Portrait' | 'Cozy';
