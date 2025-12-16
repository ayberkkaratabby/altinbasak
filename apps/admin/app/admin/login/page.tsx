'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, AlertCircle, Shield, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Kullanıcı adı veya şifre hatalı');
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(0 0 0) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Floating Orbs - Decorative Elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-[440px] px-6 py-8">
        {/* Logo/Brand Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl shadow-slate-900/20">
            <Shield className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
            Admin Paneli
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Yönetim paneline güvenli erişim
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-200/60 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-10 space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <div className="relative group">
                <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                  focusedField === 'username' 
                    ? 'bg-gradient-to-r from-slate-900/5 to-slate-800/5' 
                    : 'bg-transparent'
                }`} />
                <div className="relative">
                  <label className="block text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wider">
                    Kullanıcı Adı
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 z-10">
                      <User className={`w-5 h-5 ${focusedField === 'username' ? 'text-slate-900' : ''}`} strokeWidth={2} />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onFocus={() => setFocusedField('username')}
                      onBlur={() => setFocusedField(null)}
                      required
                      disabled={isLoading}
                      autoComplete="username"
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 rounded-xl bg-white/50 focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all duration-200 text-slate-900 placeholder:text-slate-400 font-medium outline-none"
                      placeholder="Kullanıcı adınızı girin"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="relative group">
                <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                  focusedField === 'password' 
                    ? 'bg-gradient-to-r from-slate-900/5 to-slate-800/5' 
                    : 'bg-transparent'
                }`} />
                <div className="relative">
                  <label className="block text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wider">
                    Şifre
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 z-10">
                      <Lock className={`w-5 h-5 ${focusedField === 'password' ? 'text-slate-900' : ''}`} strokeWidth={2} />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      required
                      disabled={isLoading}
                      autoComplete="current-password"
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 rounded-xl bg-white/50 focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all duration-200 text-slate-900 placeholder:text-slate-400 font-medium outline-none"
                      placeholder="Şifrenizi girin"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/60 rounded-xl opacity-0 animate-[fadeIn_0.3s_ease-in-out_forwards]">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-900">Giriş Hatası</p>
                  <p className="text-sm text-red-700 mt-1 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !username || !password}
              className="w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg group"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Giriş yapılıyor...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <Lock className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" strokeWidth={2.5} />
                  <span>Giriş Yap</span>
                </span>
              )}
            </button>

            {/* Login Info Card - Elegant Design */}
            <div className="mt-8 p-5 bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200/60 rounded-xl backdrop-blur-sm">
              <div className="flex items-start gap-3 mb-3">
                <Sparkles className="w-4 h-4 text-slate-600 mt-0.5 flex-shrink-0" strokeWidth={2} />
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Giriş Bilgileri</p>
              </div>
              <div className="space-y-2.5 pl-7">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold text-slate-600 min-w-[100px]">Kullanıcı:</span>
                  <code className="text-xs font-mono bg-white px-2.5 py-1 rounded-md border border-slate-200 text-slate-900 font-semibold shadow-sm">
                    admin
                  </code>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold text-slate-600 min-w-[100px]">Şifre:</span>
                  <code className="text-xs font-mono bg-white px-2.5 py-1 rounded-md border border-slate-200 text-slate-900 font-semibold shadow-sm">
                    admin123456789
                  </code>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-slate-400 font-medium">
          <span className="inline-flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" strokeWidth={2.5} />
            Güvenli ve şifrelenmiş bağlantı
          </span>
        </p>
      </div>
    </div>
  );
}
