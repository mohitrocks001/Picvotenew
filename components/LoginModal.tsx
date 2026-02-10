import React, { useState } from "react";
import { X, Twitter, Instagram, Mail } from "lucide-react";
import { Button } from "./Button";
import { User } from "../types";

import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";


interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

const handleAuth = async () => {
  try {
    setError("");

    const cred = isSignup
      ? await createUserWithEmailAndPassword(auth, email, password)
      : await signInWithEmailAndPassword(auth, email, password);

    const user = cred.user;

    onLogin({
      id: user.uid,
      name: user.email || "User",
      handle: user.email?.split("@")[0] || "user",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`
    });

    onClose();
  } catch (err: any) {
    setError(err.message);
  }
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        
        <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-zinc-100 rounded-full transition-colors">
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-black rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Twitter className="text-white w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-zinc-900">Join PicVote</h2>
          <p className="text-zinc-500 text-sm mt-3 font-medium">Verify your identity to start voting and entering contests.</p>
        </div>

        <div className="space-y-4">
          <input
  type="email"
  placeholder="Email"
  className="w-full border rounded-xl px-4 py-3 outline-none"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

<input
  type="password"
  placeholder="Password"
  className="w-full border rounded-xl px-4 py-3 outline-none"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>

{error && <p className="text-red-500 text-sm">{error}</p>}

          <Button variant="outline" className="w-full py-4 border-zinc-100 hover:bg-zinc-50 gap-3" onClick={handleMockLogin}>
            <Twitter className="w-5 h-5 text-[#1DA1F2] fill-current" />
            Continue with Twitter (X)
          </Button>
          <Button variant="outline" className="w-full py-4 border-zinc-100 hover:bg-zinc-50 gap-3" onClick={handleMockLogin}>
            <Instagram className="w-5 h-5 text-[#E4405F]" />
            Continue with Instagram
          </Button>
          <div className="flex items-center gap-4 py-4">
            <div className="h-[1px] bg-zinc-100 flex-1" />
            <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">or</span>
            <div className="h-[1px] bg-zinc-100 flex-1" />
          </div>
         <Button
  variant="ghost"
  className="w-full py-4 text-zinc-500 hover:text-black gap-3"
  onClick={handleAuth}
>
  {isSignup ? "Sign Up" : "Login"}
</Button>

        </div>

        <p className="mt-10 text-[10px] text-zinc-400 text-center font-bold uppercase tracking-widest leading-loose">
          By continuing, you agree to our <br />
          <span className="text-black cursor-pointer hover:underline underline-offset-4">Terms of Service</span> & <span className="text-black cursor-pointer hover:underline underline-offset-4">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};
