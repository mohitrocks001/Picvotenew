import React, { useState } from "react";
import { X } from "lucide-react";
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
  onLogin,
}) => {
  if (!isOpen) return null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");

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

        <button onClick={onClose} className="absolute top-4 right-4">
          <X />
        </button>

        <h2 className="text-2xl font-bold text-center mb-6">Lo
