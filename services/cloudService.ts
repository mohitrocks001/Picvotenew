const isBrowser = typeof window !== "undefined";

export const cloudService = {
  async getCandidates() {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!isBrowser) {
          resolve(INITIAL_CANDIDATES);
          return;
        }

        const saved = localStorage.getItem('candidates_v1');
        resolve(saved ? JSON.parse(saved) : INITIAL_CANDIDATES);
      }, DELAY);
    });
  },

  async addCandidate(candidate) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!isBrowser) return resolve();

        const saved = localStorage.getItem('candidates_v1');
        const current = saved ? JSON.parse(saved) : INITIAL_CANDIDATES;
        localStorage.setItem('candidates_v1', JSON.stringify([candidate, ...current]));
        resolve();
      }, DELAY);
    });
  },

  async updateVotes(candidateId, increment) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!isBrowser) return resolve();

        const saved = localStorage.getItem('candidates_v1');
        if (saved) {
          const current = JSON.parse(saved);
          const updated = current.map(c =>
            c.id === candidateId
              ? { ...c, votes: Math.max(0, c.votes + increment) }
              : c
          );
          localStorage.setItem('candidates_v1', JSON.stringify(updated));
        }
        resolve();
      }, 300);
    });
  },

  async getUserSession() {
    return new Promise((resolve) => {
      if (!isBrowser) return resolve(null);

      const saved = localStorage.getItem('currentUser_v1');
      resolve(saved ? JSON.parse(saved) : null);
    });
  }
};
