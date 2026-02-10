
import { Candidate, VoteState, User } from '../types';
import { INITIAL_CANDIDATES } from '../constants';

/**
 * MOCK CLOUD SERVICE
 * In a real production app, you would replace these localStorage calls 
 * with calls to a real database SDK like Supabase or Firebase.
 * 
 * Example (Supabase):
 * const { data } = await supabase.from('candidates').select('*');
 */

const DELAY = 800; // Simulate network latency

export const cloudService = {
  // Fetch the global gallery
  async getCandidates(): Promise<Candidate[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const saved = localStorage.getItem('candidates_v1');
        resolve(saved ? JSON.parse(saved) : INITIAL_CANDIDATES);
      }, DELAY);
    });
  },

  // Save a new entry to the cloud
  async addCandidate(candidate: Candidate): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const saved = localStorage.getItem('candidates_v1');
        const current = saved ? JSON.parse(saved) : INITIAL_CANDIDATES;
        localStorage.setItem('candidates_v1', JSON.stringify([candidate, ...current]));
        resolve();
      }, DELAY);
    });
  },

  // Update votes in the cloud
  async updateVotes(candidateId: string, increment: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const saved = localStorage.getItem('candidates_v1');
        if (saved) {
          const current: Candidate[] = JSON.parse(saved);
          const updated = current.map(c => 
            c.id === candidateId ? { ...c, votes: Math.max(0, c.votes + increment) } : c
          );
          localStorage.setItem('candidates_v1', JSON.stringify(updated));
        }
        resolve();
      }, 300); // Votes should feel slightly faster
    });
  },

  // Sync user session
  async getUserSession(): Promise<User | null> {
    return new Promise((resolve) => {
      const saved = localStorage.getItem('currentUser_v1');
      resolve(saved ? JSON.parse(saved) : null);
    });
  }
};
