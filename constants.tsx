
import { Candidate, Category } from './types';

export const CATEGORIES: Category[] = ['All', 'Nature', 'Urban', 'Minimalist', 'Portrait', 'Cozy'];

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: '1',
    name: 'Neon Solitude',
    author: 'Elena Vance',
    authorId: 'user1',
    imageUrl: 'https://picsum.photos/seed/neon/800/1000',
    votes: 1242,
    timestamp: Date.now() - 86400000 * 2,
    tags: ['Urban', 'Neon', 'Cyberpunk'],
    category: 'Urban',
    aiCritique: "A masterclass in high-contrast urban photography. The neon highlights guide the eye through the composition effectively."
  },
  {
    id: '2',
    name: 'Quiet Peak',
    author: 'Marcus Aurel',
    authorId: 'user2',
    imageUrl: 'https://picsum.photos/seed/mountain/800/1000',
    votes: 954,
    timestamp: Date.now() - 86400000 * 5,
    tags: ['Nature', 'Landscape', 'Minimal'],
    category: 'Nature',
    aiCritique: "Excellent use of negative space. The mountain ridge creates a dramatic silhouette against the soft sky."
  },
  {
    id: '3',
    name: 'Soft Morning',
    author: 'Sarah Jenkins',
    authorId: 'user3',
    imageUrl: 'https://picsum.photos/seed/coffee/800/1000',
    votes: 2105,
    timestamp: Date.now() - 3600000,
    tags: ['Cozy', 'Home', 'Warm'],
    category: 'Cozy',
    aiCritique: "The warm color palette evokes an immediate emotional response of comfort and peace."
  },
  {
    id: '4',
    name: 'Concrete Jungle',
    author: 'David Chen',
    authorId: 'user4',
    imageUrl: 'https://picsum.photos/seed/city/800/1000',
    votes: 432,
    timestamp: Date.now() - 86400000,
    tags: ['Urban', 'Architecture', 'Geometric'],
    category: 'Urban'
  }
];
