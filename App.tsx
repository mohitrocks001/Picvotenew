
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Camera, 
  LayoutGrid, 
  ArrowUpDown, 
  PlusCircle, 
  Search, 
  TrendingUp, 
  LogIn, 
  LogOut, 
  CheckCircle2, 
  Twitter, 
  Cloud,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Candidate, SortOption, VoteState, User, Category } from './types';
import { CATEGORIES } from './constants';
import { CandidateCard } from './components/CandidateCard';
import { UploadModal } from './components/UploadModal';
import { LoginModal } from './components/LoginModal';
import { UserProfile } from './components/UserProfile';
import { Button } from './components/Button';
import { cloudService } from './services/cloudService';

type View = 'home' | 'profile';

const App: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const [voteState, setVoteState] = useState<VoteState>(() => {
    const saved = localStorage.getItem('voteState_v1');
    return saved ? JSON.parse(saved) : { hasVotedFor: [] };
  });

  const [user, setUser] = useState<User | null>(null);

  const [currentView, setCurrentView] = useState<View>('home');
  const [sortOption, setSortOption] = useState<SortOption>('votes');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLoginToast, setShowLoginToast] = useState(false);

  // Load initial data from Cloud Service
  useEffect(() => {
    const initApp = async () => {
      setIsLoading(true);
      const [cloudCandidates, cloudUser] = await Promise.all([
        cloudService.getCandidates(),
        cloudService.getUserSession()
      ]);
      setCandidates(cloudCandidates);
      setUser(cloudUser);
      setIsLoading(false);
    };
    initApp();
  }, []);

  // Sync vote state locally (vote permissions are usually local until checked by DB)
  useEffect(() => {
    localStorage.setItem('voteState_v1', JSON.stringify(voteState));
  }, [voteState]);

  const handleVote = async (id: string) => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    const isUnvote = voteState.hasVotedFor.includes(id);
    const increment = isUnvote ? -1 : 1;

    // Optimistic UI Update
    setCandidates(prev => prev.map(c => 
      c.id === id ? { ...c, votes: Math.max(0, c.votes + increment) } : c
    ));

    if (isUnvote) {
      setVoteState(prev => ({
        hasVotedFor: prev.hasVotedFor.filter(vId => vId !== id)
      }));
    } else {
      setVoteState(prev => ({
        hasVotedFor: [...prev.hasVotedFor, id]
      }));
    }

    // Sync to Cloud
    setIsSyncing(true);
    await cloudService.updateVotes(id, increment);
    setIsSyncing(false);
  };

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('currentUser_v1', JSON.stringify(newUser));
    setShowLoginToast(true);
    setTimeout(() => setShowLoginToast(false), 3000);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser_v1');
    setCurrentView('home');
  };

  const handleAddCandidate = async (newCandidateData: Partial<Candidate>) => {
    if (!user) return;
    
    const newCandidate: Candidate = {
      id: Math.random().toString(36).substr(2, 9),
      name: newCandidateData.name || 'Untitled',
      author: user.name,
      authorId: user.id,
      imageUrl: newCandidateData.imageUrl || '',
      votes: 0,
      timestamp: Date.now(),
      tags: newCandidateData.tags || [],
      category: newCandidateData.category || 'Nature',
      aiCritique: newCandidateData.aiCritique
    };
    
    setIsSyncing(true);
    await cloudService.addCandidate(newCandidate);
    setCandidates(prev => [newCandidate, ...prev]);
    setIsSyncing(false);
  };

  const sortedCandidates = useMemo(() => {
    let filtered = candidates.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    return filtered.sort((a, b) => {
      if (sortOption === 'votes') return b.votes - a.votes;
      if (sortOption === 'newest') return b.timestamp - a.timestamp;
      if (sortOption === 'oldest') return a.timestamp - b.timestamp;
      return 0;
    });
  }, [candidates, sortOption, searchQuery, selectedCategory]);

  if (currentView === 'profile' && user) {
    return (
      <UserProfile 
        user={user} 
        candidates={candidates} 
        voteState={voteState} 
        onBack={() => setCurrentView('home')} 
        onVote={handleVote}
      />
    );
  }

  return (
    <div className="min-h-screen pb-20 selection:bg-black selection:text-white">
      {/* Login Toast */}
      {showLoginToast && (
        <div className="fixed top-24 right-6 z-[100] bg-zinc-900 text-white px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-500">
          <div className="bg-emerald-500 p-1 rounded-full">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold">Successfully Logged In</p>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Welcome back, @{user?.handle}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-zinc-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { setCurrentView('home'); setSelectedCategory('All'); }}>
            <div className="w-12 h-12 bg-black rounded-[1.25rem] flex items-center justify-center transition-all group-hover:rotate-12 group-hover:scale-110 shadow-xl shadow-black/10">
              <Camera className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter leading-none">PICVOTE</span>
              <div className="flex items-center gap-1.5 mt-1">
                {isSyncing ? (
                  <>
                    <RefreshCw className="w-2.5 h-2.5 text-indigo-500 animate-spin" />
                    <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">Syncing Cloud...</span>
                  </>
                ) : (
                  <>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Cloud Database Connected</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-2.5 w-96 group focus-within:border-zinc-300 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-black/[0.02] transition-all">
            <Search className="w-4 h-4 text-zinc-400 mr-3 group-focus-within:text-black transition-colors" />
            <input 
              type="text" 
              placeholder="Search visual stories..."
              className="bg-transparent border-none outline-none text-sm w-full font-medium placeholder:text-zinc-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="hidden sm:flex border-zinc-200 hover:border-black rounded-full" 
              onClick={() => {
                if (!user) setIsLoginModalOpen(true);
                else setIsUploadModalOpen(true);
              }}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Enter Showdown
            </Button>
            
            <div className="h-8 w-[1px] bg-zinc-100 mx-1 hidden sm:block" />

            {user ? (
              <div className="flex items-center gap-2 bg-zinc-50 p-1.5 pr-2 rounded-full border border-zinc-100 hover:bg-zinc-100 transition-colors cursor-pointer group">
                <button 
                  onClick={() => setCurrentView('profile')}
                  className="flex items-center gap-3 pl-1.5"
                >
                  <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full bg-white shadow-sm border border-zinc-200 transition-transform group-hover:scale-105" />
                  <div className="hidden lg:block text-left pr-2">
                    <p className="text-[10px] font-black text-zinc-900 leading-none mb-1">@{user.handle}</p>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Creator</p>
                  </div>
                </button>
                <button onClick={handleLogout} className="p-2 hover:bg-white rounded-full transition-colors text-zinc-400 hover:text-red-500">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Button 
                variant="primary" 
                size="sm" 
                className="gap-2 bg-black rounded-full px-6 py-3"
                onClick={() => setIsLoginModalOpen(true)}
              >
                <LogIn className="w-4 h-4" />
                Login
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="px-6 pt-24 pb-16 max-w-7xl mx-auto text-center relative overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-50 rounded-full blur-[100px] opacity-60 -z-10" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-emerald-50 rounded-full blur-[100px] opacity-60 -z-10" />

        <div className="flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-zinc-100 px-5 py-2 rounded-full text-[10px] font-black text-zinc-600 mb-10 tracking-widest uppercase border border-zinc-200 shadow-sm">
            <TrendingUp className="w-3.5 h-3.5 text-black" /> 
            Active Global Contest 2025
          </div>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-zinc-900 leading-[0.8] mb-10">
            Global Photo <br /> <span className="text-zinc-200">Showdown.</span>
          </h1>
          <p className="text-xl text-zinc-500 max-w-2xl leading-relaxed mb-12 font-medium">
            Join a shared database of digital visionaries. Every vote and upload is synced instantly across the globe using our cloud architecture.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-full shadow-xl shadow-black/[0.03] border border-zinc-100">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 12}`} className="w-14 h-14 rounded-full border-4 border-white shadow-sm bg-zinc-50" alt="Voter avatar" />
                ))}
                <div className="w-14 h-14 rounded-full border-4 border-white bg-zinc-900 flex items-center justify-center text-[10px] text-white font-black shadow-sm">
                  +4.2k
                </div>
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-zinc-900 leading-tight">Synced Live Gallery</p>
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Real-time DB Active</p>
              </div>
            </div>

            <Button size="lg" className="rounded-full shadow-2xl shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700 hover:scale-105 transition-all gap-3" onClick={() => setIsUploadModalOpen(true)}>
              <Camera className="w-5 h-5" />
              Join the Cloud
            </Button>
          </div>
        </div>
      </header>

      {/* Control Bar */}
      <section className="sticky top-[81px] z-30 px-6 py-8 border-y border-zinc-100 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-10 overflow-x-auto custom-scrollbar w-full md:w-auto pb-2 md:pb-0">
            <div className="flex items-center gap-3 shrink-0">
              <LayoutGrid className="w-5 h-5 text-black" />
              <span className="font-black text-xs uppercase tracking-[0.2em] text-zinc-400">Global Showcase</span>
            </div>
            <div className="h-6 w-[1px] bg-zinc-100 shrink-0" />
            <div className="flex items-center gap-8 shrink-0">
              {CATEGORIES.map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setSelectedCategory(tab)}
                  className={`text-[10px] font-black uppercase tracking-widest transition-all px-1 py-2 relative ${
                    selectedCategory === tab 
                      ? 'text-black' 
                      : 'text-zinc-400 hover:text-black'
                  }`}
                >
                  {tab}
                  {selectedCategory === tab && (
                    <div className="absolute -bottom-1 left-0 w-full h-1 bg-black rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-3 text-zinc-500 bg-zinc-50 px-5 py-3 rounded-full border border-zinc-100 flex-1 md:flex-initial justify-center">
              <ArrowUpDown className="w-4 h-4 text-zinc-400" />
              <select 
                className="bg-transparent text-[10px] font-black text-zinc-900 outline-none cursor-pointer uppercase tracking-widest"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
              >
                <option value="votes">Sort: Top Rated</option>
                <option value="newest">Sort: Latest Entries</option>
                <option value="oldest">Sort: Classic First</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <main className="px-6 py-20 max-w-7xl mx-auto min-h-[600px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="w-12 h-12 text-zinc-300 animate-spin mb-6" />
            <p className="text-zinc-400 font-black uppercase tracking-[0.3em] text-[10px]">Fetching Cloud Gallery...</p>
          </div>
        ) : sortedCandidates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {sortedCandidates.map(candidate => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                onVote={handleVote}
                hasVoted={voteState.hasVotedFor.includes(candidate.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <div className="w-32 h-32 bg-zinc-50 rounded-[4rem] flex items-center justify-center mb-10 border border-zinc-100 shadow-inner">
              <Search className="w-12 h-12 text-zinc-200" />
            </div>
            <h3 className="text-4xl font-black text-zinc-900 tracking-tighter">No masterpieces found</h3>
            <p className="text-zinc-500 mt-5 max-w-sm mx-auto font-medium leading-relaxed">
              Our cloud database couldn't find matches for this filter.
            </p>
            <Button className="mt-12 rounded-full px-10 py-5 bg-black" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSortOption('votes'); }}>
              Reset All Filters
            </Button>
          </div>
        )}
      </main>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleAddCandidate}
      />
      
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />

      {/* Mobile Floating Action Button */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 md:hidden">
        <Button 
          variant="primary" 
          size="lg" 
          className="shadow-2xl shadow-indigo-500/40 rounded-full px-10 py-6 gap-4 border-[6px] border-white bg-indigo-600"
          onClick={() => {
             if (!user) setIsLoginModalOpen(true);
             else setIsUploadModalOpen(true);
          }}
        >
          <PlusCircle className="w-6 h-6" />
          Enter Showdown
        </Button>
      </div>

      <footer className="mt-40 py-24 border-t border-zinc-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-20 items-start">
          <div className="flex flex-col items-center md:items-start text-center md:text-left md:col-span-2">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 bg-black rounded-[1.25rem] flex items-center justify-center shadow-xl">
                <Camera className="text-white w-6 h-6" />
              </div>
              <span className="text-3xl font-black tracking-tighter">PICVOTE</span>
            </div>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-md font-medium">
              The premium platform for digital creators. Showcase your vision, get AI-verified critiques, and win global recognition on our synced cloud platform.
            </p>
            <div className="flex items-center gap-6 mt-12">
              <Twitter className="w-6 h-6 text-zinc-300 hover:text-black cursor-pointer transition-colors" />
              <Cloud className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-black text-zinc-900 mb-8 uppercase tracking-[0.2em] text-xs">Navigate</h4>
            <div className="flex flex-col gap-5 text-sm font-bold text-zinc-400">
              <a href="#" className="hover:text-black transition-colors">Global Leaderboard</a>
              <a href="#" className="hover:text-black transition-colors">Contest Rules</a>
              <a href="#" className="hover:text-black transition-colors">Cloud Sync Status</a>
              <a href="#" className="hover:text-black transition-colors">Help Center</a>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-black text-zinc-900 mb-8 uppercase tracking-[0.2em] text-xs">Platform</h4>
            <div className="flex flex-col gap-5 text-sm font-bold text-zinc-400">
              <a href="#" className="hover:text-black transition-colors">Privacy Center</a>
              <a href="#" className="hover:text-black transition-colors">Creators Portal</a>
              <a href="#" className="hover:text-black transition-colors">Database Info</a>
              <a href="#" className="hover:text-black transition-colors">System Status</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-24 pt-10 border-t border-zinc-50 flex flex-col md:flex-row items-center justify-between gap-6">
           <p className="text-zinc-300 text-[10px] font-black tracking-[0.2em] uppercase">© 2025 PicVote Contest Platform • Distributed Cloud Architecture</p>
           <div className="flex items-center gap-8">
             <span className="text-zinc-300 text-[10px] font-black tracking-widest uppercase cursor-pointer hover:text-black">API Docs</span>
             <span className="text-zinc-300 text-[10px] font-black tracking-widest uppercase cursor-pointer hover:text-black">Privacy</span>
             <span className="text-zinc-300 text-[10px] font-black tracking-widest uppercase cursor-pointer hover:text-black">Terms</span>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
