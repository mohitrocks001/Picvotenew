
import React from 'react';
import { ArrowLeft, Settings, Grid, Heart, Trophy, Share2 } from 'lucide-react';
import { User, Candidate, VoteState } from '../types';
import { CandidateCard } from './CandidateCard';
import { Button } from './Button';

interface UserProfileProps {
  user: User;
  candidates: Candidate[];
  voteState: VoteState;
  onBack: () => void;
  onVote: (id: string) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, candidates, voteState, onBack, onVote }) => {
  const userEntries = candidates.filter(c => c.authorId === user.id);
  const votedEntries = candidates.filter(c => voteState.hasVotedFor.includes(c.id));

  return (
    <div className="min-h-screen bg-[#FBFBFE] pb-32">
      {/* Header */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-zinc-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 group">
            <div className="p-2 group-hover:bg-zinc-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </div>
            <span className="text-sm font-black tracking-tight uppercase">Back to Gallery</span>
          </button>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="rounded-full">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Profile Hero */}
      <header className="max-w-4xl mx-auto px-6 pt-16 pb-12">
        <div className="flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
          <div className="relative">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover bg-zinc-100" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-3 rounded-2xl border-4 border-[#FBFBFE] shadow-lg">
              <Trophy className="w-5 h-5 text-white" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase mb-4">
              Verified Creator
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-zinc-900 leading-tight mb-2">
              {user.name}
            </h1>
            <p className="text-lg text-indigo-600 font-bold tracking-tight mb-6">@{user.handle}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-8">
              <div>
                <p className="text-2xl font-black text-zinc-900 tracking-tighter">{userEntries.length}</p>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Entries</p>
              </div>
              <div className="w-[1px] bg-zinc-100 h-10" />
              <div>
                <p className="text-2xl font-black text-zinc-900 tracking-tighter">{votedEntries.length}</p>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Votes Cast</p>
              </div>
              <div className="w-[1px] bg-zinc-100 h-10" />
              <div>
                <p className="text-2xl font-black text-zinc-900 tracking-tighter">
                  {userEntries.reduce((acc, curr) => acc + curr.votes, 0).toLocaleString()}
                </p>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total Likes</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 border-b border-zinc-100">
        <div className="flex items-center gap-12 overflow-x-auto custom-scrollbar pb-1">
          <button className="flex items-center gap-3 py-6 text-sm font-black text-black border-b-2 border-black whitespace-nowrap">
            <Grid className="w-4 h-4" />
            MY SHOWCASE
          </button>
          <button className="flex items-center gap-3 py-6 text-sm font-black text-zinc-400 hover:text-black transition-colors whitespace-nowrap">
            <Heart className="w-4 h-4" />
            FAVORITES
          </button>
          <button className="flex items-center gap-3 py-6 text-sm font-black text-zinc-400 hover:text-black transition-colors whitespace-nowrap">
            <Trophy className="w-4 h-4" />
            AWARDS
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {userEntries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {userEntries.map(candidate => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                onVote={onVote}
                hasVoted={voteState.hasVotedFor.includes(candidate.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[4rem] border border-zinc-100 shadow-sm">
            <div className="w-24 h-24 bg-zinc-50 rounded-[40px] flex items-center justify-center mb-8">
              <Grid className="w-10 h-10 text-zinc-200" />
            </div>
            <h3 className="text-3xl font-black text-zinc-900 tracking-tighter">Your showcase is empty</h3>
            <p className="text-zinc-500 mt-4 max-w-sm text-center font-medium leading-relaxed">
              Start your creative journey by entering your first visual story into the global showdown.
            </p>
            <Button className="mt-10 rounded-[2rem] px-10 py-5 bg-black" onClick={onBack}>
              Explore Contest Entries
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};
