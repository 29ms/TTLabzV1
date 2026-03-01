import { ensureUserDoc } from "../services/userData";

import React, { useState } from 'react';

import { 
  auth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signInWithPopup, 
  googleProvider,
  sendEmailVerification,
  signOut
} from '../services/firebase';


interface AuthViewProps {
  onAuthSuccess: () => void;
}

type AuthMode = 'LOGIN' | 'REGISTER' | 'RESET';

const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      if (mode === 'LOGIN') {
  const cred = await signInWithEmailAndPassword(auth, email, password);

  // Google accounts are typically verified automatically; email/password must verify
  if (cred.user.providerData?.some(p => p.providerId === "password") && !cred.user.emailVerified) {
    setError("Please verify your email before logging in.");
    return;
  }

  onAuthSuccess();
await ensureUserDoc();

      } else if (mode === 'REGISTER') {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(cred.user);
  // Prevent unverified users from entering the app
  await signOut(auth);
  setMessage("Verification email sent. Please verify your email, then log in.");
  setMode('LOGIN');
  return;

      } else if (mode === 'RESET') {
        await sendPasswordResetEmail(auth, email);
        setMessage("Check your email for a reset link.");
      }
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      onAuthSuccess();
      await ensureUserDoc();

    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 animate-in fade-in duration-1000">
      <div className="w-full max-w-md space-y-10">
        <header className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="w-14 h-14 border border-white rounded-full flex items-center justify-center text-2xl font-mono">
              <span className="animate-pulse text-white">◈</span>
            </div>
          </div>
          <h1 className="text-4xl font-light tracking-tight text-white">
            {mode === 'LOGIN' ? 'Sign In' : mode === 'REGISTER' ? 'Sign Up' : 'Reset Password'}
          </h1>
          <p className="text-sm font-light text-zinc-500">
            {mode === 'LOGIN' ? 'Welcome back to TechTales Labs' : mode === 'REGISTER' ? 'Start your journey today' : 'Get back into your account'}
          </p>
        </header>

        <div className="border border-zinc-900 bg-zinc-950 p-8 md:p-10 space-y-8 shadow-2xl rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full bg-black border border-zinc-800 p-4 text-white rounded-full font-light text-sm outline-none focus:border-white transition-all placeholder:text-zinc-800"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {mode !== 'RESET' && (
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-1">Password</label>
                <input 
                  type="password" 
                  required
                  className="w-full bg-black border border-zinc-800 p-4 text-white rounded-full font-light text-sm outline-none focus:border-white transition-all placeholder:text-zinc-800"
                  placeholder="Your secret key"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}

            {error && (
              <p className="text-xs text-red-500 leading-relaxed bg-red-500/5 p-3 rounded-2xl border border-red-500/20">
                Error: {error}
              </p>
            )}

            {message && (
              <p className="text-xs text-green-500 leading-relaxed bg-green-500/5 p-3 rounded-2xl border border-green-500/20">
                {message}
              </p>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-zinc-200 transition-all disabled:opacity-20 active:scale-95 shadow-lg shadow-white/5"
            >
              {isLoading ? 'Please wait...' : mode === 'LOGIN' ? 'Login' : mode === 'REGISTER' ? 'Create Account' : 'Send Link'}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-900"></div></div>
            <div className="relative flex justify-center text-[10px]"><span className="px-4 bg-zinc-950 text-zinc-600 font-mono uppercase tracking-widest">Or continue with</span></div>
          </div>

          <button 
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full border border-zinc-800 text-white py-4 rounded-full font-light text-sm tracking-widest hover:border-white hover:bg-white/5 transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
        </div>

        <nav className="flex flex-col items-center gap-4 text-xs font-light text-zinc-500">
          {mode === 'LOGIN' ? (
            <>
              <button onClick={() => setMode('REGISTER')} className="text-zinc-300 hover:text-white transition-colors underline underline-offset-8">Create a new account</button>
              <button onClick={() => setMode('RESET')} className="hover:text-zinc-300 transition-colors">Forgot your password?</button>
            </>
          ) : (
            <button onClick={() => setMode('LOGIN')} className="text-zinc-300 hover:text-white transition-colors underline underline-offset-8">Already have an account? Login</button>
          
          )}
        </nav>
      </div>

      <footer className="fixed bottom-8 text-[10px] font-mono text-zinc-800 uppercase tracking-[0.5em]">

      </footer>
    </div>
  );
};



export default AuthView;