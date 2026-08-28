'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Layout, Button } from '@/components/Shell';
import { loginUser, getAuthUser } from '@/lib/api';
import { ShieldCheck, LogIn, AlertCircle, CheckCircle2, User, Lock, Info } from 'lucide-react';

export default function LoginPage() {
  const router = Router();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const active = getAuthUser();
    if (active) {
      setCurrentUser(active);
    }
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your email or username.');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    loginUser(identifier, password)
      .then((res) => {
        setSuccess(res.message);
        setTimeout(() => {
          router.push('/check');
        }, 1000);
      })
      .catch((err) => {
        setError(err.message || 'Login failed. Please check your credentials.');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleDemoLogin() {
    setLoading(true);
    setError('');
    setSuccess('');

    loginUser('rahul@example.com', 'demo123', true)
      .then((res) => {
        setSuccess('Logged in successfully as Demo User (Rahul K. Kumar)');
        setTimeout(() => {
          router.push('/check');
        }, 1000);
      })
      .catch((err) => {
        setError('Could not initialize demo login.');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <Layout>
      <main className="mx-auto max-w-md px-4 py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="text-center">
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-ink text-white">
              <ShieldCheck size={28} />
            </div>
            <h1 className="text-2xl font-bold text-ink">Sign In to PF Saathi</h1>
            <p className="mt-1 text-xs text-slate-600">
              Access your saved readiness checks and personalized guidance.
            </p>
          </div>

          {currentUser ? (
            <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
              <CheckCircle2 className="mx-auto mb-2 text-emerald-600" size={28} />
              <p className="text-sm font-semibold text-emerald-900">
                You are currently logged in as <b>{currentUser.name}</b>
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Button href="/check">Proceed to PF Check</Button>
                <Button href="/" secondary>
                  Back to Home
                </Button>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="mt-5 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
                  <AlertCircle size={16} className="shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="mt-5 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
                  <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Email or Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 text-slate-400" size={16} />
                    <input
                      type="text"
                      placeholder="e.g. rahul@example.com"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-slate-400" size={16} />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-ink px-4 text-sm font-bold text-white shadow transition hover:bg-[#0d2949] disabled:opacity-60"
                >
                  <LogIn size={16} />
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="relative my-6 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative bg-white px-3 text-xs font-medium text-slate-500">
                  OR QUICK ACCESS
                </span>
              </div>

              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full rounded-lg border border-amber-300 bg-amber-50 py-2.5 px-4 text-xs font-bold text-amber-950 transition hover:bg-amber-100"
              >
                ⚡ Quick Login as Demo User (Rahul K. Kumar)
              </button>

              <div className="mt-6 flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-[11px] leading-4 text-slate-600">
                <Info size={14} className="mt-0.5 shrink-0 text-slate-500" />
                <span>
                  <b>Security Notice:</b> PF Saathi is an independent prototype. Never enter real EPFO passwords, OTPs, Aadhaar, or PAN numbers.
                </span>
              </div>
            </>
          )}
        </div>
      </main>
    </Layout>
  );
}

function Router() {
  return useRouter();
}
