
import React, { useState, useRef } from 'react';
import { X, Upload, Sparkles, Image as ImageIcon, Camera } from 'lucide-react';
import { Button } from './Button';
import { analyzeImage } from '../services/geminiService';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    tags: [] as string[],
    category: 'Nature',
    critique: ''
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        triggerAnalysis(reader.result as string, selectedFile.type);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const triggerAnalysis = async (base64: string, mime: string) => {
    setAnalyzing(true);
    const base64Data = base64.split(',')[1];
    const analysis = await analyzeImage(base64Data, mime);
    
    if (analysis) {
      setFormData({
        title: analysis.title,
        tags: analysis.tags,
        category: analysis.category,
        critique: analysis.critique
      });
    }
    setAnalyzing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!preview) return;
    
    onSubmit({
      name: formData.title,
      imageUrl: preview,
      tags: formData.tags,
      category: formData.category,
      aiCritique: formData.critique
    });
    
    // Reset
    setFile(null);
    setPreview(null);
    setFormData({ title: '', tags: [], category: 'Nature', critique: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh]">
        
        {/* Left: Preview Area */}
        <div className="w-full md:w-1/2 bg-zinc-50 flex flex-col border-r border-zinc-100 overflow-y-auto">
          <div className="p-8 flex-1 flex flex-col justify-center items-center text-center">
            {preview ? (
              <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl group">
                <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                <button 
                  onClick={() => { setPreview(null); setFile(null); }}
                  className="absolute top-4 right-4 bg-white/80 backdrop-blur p-2 rounded-full text-black hover:bg-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                {analyzing && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white/90 px-6 py-4 rounded-3xl flex items-center gap-4 animate-pulse">
                      <Sparkles className="w-6 h-6 text-indigo-500 animate-bounce" />
                      <span className="font-black text-sm uppercase tracking-tighter">Gemini is analyzing...</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-[4/5] rounded-[2.5rem] border-4 border-dashed border-zinc-200 flex flex-col items-center justify-center cursor-pointer hover:border-zinc-400 hover:bg-zinc-100/50 transition-all group"
              >
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform">
                  <Camera className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-black text-zinc-900 tracking-tight">Drop your visual story</h3>
                <p className="text-zinc-400 text-sm mt-2 font-bold uppercase tracking-widest">Select Image or Drag & Drop</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right: Form Area */}
        <div className="w-full md:w-1/2 flex flex-col bg-white overflow-y-auto custom-scrollbar">
          <div className="p-8 flex justify-between items-center border-b border-zinc-50">
            <div>
              <h2 className="text-2xl font-black tracking-tighter">Contest Entry</h2>
              <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Submission Details</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Artwork Title</label>
              <input 
                type="text"
                required
                placeholder="Name your masterpiece..."
                className="w-full bg-zinc-50 border border-zinc-100 px-6 py-4 rounded-2xl font-bold focus:ring-2 focus:ring-black outline-none transition-all"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Category</label>
              <select 
                className="w-full bg-zinc-50 border border-zinc-100 px-6 py-4 rounded-2xl font-bold focus:ring-2 focus:ring-black outline-none appearance-none"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                {['Nature', 'Urban', 'Minimalist', 'Portrait', 'Cozy'].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Visual Tags</label>
              <div className="flex flex-wrap gap-2 p-2 min-h-[50px] bg-zinc-50 border border-zinc-100 rounded-2xl">
                {formData.tags.map(tag => (
                  <span key={tag} className="bg-white border border-zinc-200 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2">
                    {tag}
                    <button type="button" onClick={() => setFormData({...formData, tags: formData.tags.filter(t => t !== tag)})}>
                      <X className="w-3 h-3 text-zinc-400" />
                    </button>
                  </span>
                ))}
                <input 
                  type="text"
                  placeholder="Add tags..."
                  className="bg-transparent border-none outline-none text-xs font-bold px-4 py-2 flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = (e.currentTarget as HTMLInputElement).value.trim();
                      if (val && !formData.tags.includes(val)) {
                        setFormData({...formData, tags: [...formData.tags, val]});
                        (e.currentTarget as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
              </div>
            </div>

            {formData.critique && (
              <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-[2rem]">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Gemini's Critique</span>
                </div>
                <p className="text-sm text-indigo-900 italic font-medium leading-relaxed">
                  "{formData.critique}"
                </p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full py-5 rounded-[2rem] bg-black text-white hover:bg-zinc-800 shadow-xl shadow-black/10 disabled:opacity-30"
              disabled={!preview || analyzing}
            >
              {analyzing ? 'Analysis in progress...' : 'Launch into Contest'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
