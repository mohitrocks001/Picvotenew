import React, { useState } from "react";
import { X, Twitter, Instagram, Mail } from "lucide-react";
import { Button } from "./Button";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { User } from "../types";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin
}) => {
  if (!isOpen) return null;

  // ✅ STATES
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");

  // ✅ REAL FIREBASE AUTH
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

  // ✅ JSX MUST BE INSIDE COMPONENT
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 relative overflow-hidden">

        <button onClick={onClose} className="absolute top-8 right-8 p-2">
          <X />
        </button>

        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-xl px-4 py-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-xl px-4 py-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500">{error}</p>}

          <Button onClick={handleAuth}>
            {isSignup ? "Sign Up" : "Login"}
          </Button>

          <p
            className="text-sm text-center cursor-pointer text-indigo-600"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Already have an account? Login" : "New user? Create account"}
          </p>

        </div>
      </div>
    </div>
  );
};
