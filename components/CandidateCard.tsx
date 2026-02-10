
import React from 'react';
import { Heart, User, Clock, Sparkles, Tag } from 'lucide-react';
import { Candidate } from '../types';

interface CandidateCardProps {
  candidate: Candidate;
  onVote: (id: string) => void;
  hasVoted: boolean;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onVote, hasVoted }) => {
  return (
    <div className="group bg-white rounded-[2.5rem] border border-zinc-100 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-black/[0.04] transition-all duration-500 hover:-translate-y-2">
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={candidate.imageUrl} 
          alt={candidate.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        
        <div className="absolute top-6 left-6">
          <span className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest text-black uppercase shadow-sm">
            {candidate.category}
          </span>
        </div>

        <button 
          onClick={() => onVote(candidate.id)}
          className={`absolute top-6 right-6 p-3 rounded-2xl transition-all duration-300 flex items-center gap-2 ${
            hasVoted 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-white/20 backdrop-blur hover:bg-white text-white hover:text-black shadow-sm'
          }`}
        >
          <Heart className={`w-5 h-5 ${hasVoted ? 'fill-current' : ''}`} />
          <span className="text-xs font-black">{candidate.votes.toLocaleString()}</span>
        </button>

        <div className="absolute bottom-8 left-8 right-8">
          <h3 className="text-2xl font-black text-white tracking-tight leading-tight mb-2 group-hover:translate-x-1 transition-transform">
            {candidate.name}
          </h3>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <User className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">
              by @{candidate.author.toLowerCase().replace(' ', '')}
            </span>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {candidate.tags.map(tag => (
            <span key={tag} className="flex items-center gap-1.5 text-[10px] font-black text-zinc-400 bg-zinc-50 px-3 py-1 rounded-full uppercase tracking-wider border border-zinc-100">
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
        </div>

        {candidate.aiCritique && (
          <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3 h-3 text-indigo-500 fill-indigo-500" />
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">AI Perspective</span>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed italic">
              "{candidate.aiCritique}"
            </p>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between pt-6 border-t border-zinc-50">
          <div className="flex items-center gap-2 text-zinc-400">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-bold">
              {new Date(candidate.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <button className="text-xs font-black text-black uppercase tracking-widest hover:underline underline-offset-4">
            Details
          </button>
        </div>
      </div>
    </div>
  );
};
