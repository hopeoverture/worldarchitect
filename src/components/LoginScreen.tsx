import React from 'react';
import { useState } from 'react';
import { Globe, Sparkles, Map, Users, Sword } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (email: string, password: string, isSignUp: boolean) => void;
  loading?: boolean;
  onResetPassword?: (email: string) => Promise<void>;
}

export default function LoginScreen({ onLogin, loading, onResetPassword }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await onLogin(email, password, isSignUp);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address to reset your password');
      return;
    }

    try {
      setError(null);
      if (onResetPassword) await onResetPassword(email);
      setError('Password reset email sent. Check your inbox.');
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Globe className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">World Architect</h1>
          <p className="text-purple-200 text-lg">AI-Powered World Building</p>
        </div>

        {/* Features */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Build Epic Worlds</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-purple-100">
              <Map className="w-5 h-5 text-purple-300" />
              <span>Create detailed regions and landscapes</span>
            </div>
            <div className="flex items-center space-x-3 text-purple-100">
              <Users className="w-5 h-5 text-purple-300" />
              <span>Design memorable characters and NPCs</span>
            </div>
            <div className="flex items-center space-x-3 text-purple-100">
              <Sword className="w-5 h-5 text-purple-300" />
              <span>Plan exciting adventures and quests</span>
            </div>
            <div className="flex items-center space-x-3 text-purple-100">
              <Sparkles className="w-5 h-5 text-purple-300" />
              <span>Generate content with AI assistance</span>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-gray-900 font-semibold py-4 px-6 rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-xl"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>{isSignUp ? 'Creating account...' : 'Signing in...'}</span>
              </div>
            ) : (
              <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
            )}
          </button>
        </form>

        {/* Toggle Sign Up / Sign In */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="text-purple-200 hover:text-white transition-colors"
          >
            {isSignUp 
              ? 'Already have an account? Sign in' 
              : "Don't have an account? Create one"
            }
          </button>
            {!isSignUp && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="text-sm text-purple-200 hover:text-white"
                >
                  Forgot password?
                </button>
              </div>
            )}
        </div>

        <p className="text-center text-purple-200 text-sm mt-6">
          {isSignUp 
            ? 'Create an account to start building your fantasy worlds'
            : 'Sign in to continue building your fantasy worlds'
          }
        </p>
      </div>
    </div>
  );
}