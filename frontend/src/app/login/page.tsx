'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [familyId, setFamilyId] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyId.trim() || !userName.trim()) {
      setError('家族IDと名前を入力してください。');
      return;
    }

    localStorage.setItem('closetton_auth', JSON.stringify({
      familyId: familyId.trim(),
      userName: userName.trim()
    }));
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#f4f1f0] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-sm border border-stone-100 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-stone-100 rounded-3xl mb-4 text-stone-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </div>
          <h1 className="text-2xl font-bold text-stone-800 mb-2">クローゼットン</h1>
          <p className="text-sm font-medium text-stone-500">家族のクローゼットへようこそ</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-400 uppercase ml-1 tracking-wider">家族ID</label>
            <input
              type="text"
              value={familyId}
              onChange={(e) => setFamilyId(e.target.value)}
              placeholder="family-id"
              className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-500/10 text-stone-800 transition-all placeholder:text-stone-300"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-400 uppercase ml-1 tracking-wider">あなたの名前</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="パパ、ママ など"
              className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-500/10 text-stone-800 transition-all placeholder:text-stone-300"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 p-3 rounded-xl">
              <p className="text-xs font-bold text-red-500 italic">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-stone-800 text-white rounded-2xl font-bold shadow-lg shadow-stone-900/10 active:scale-[0.98] transition-all hover:bg-stone-900 mt-2"
          >
            ログイン
          </button>
        </form>

        <div className="mt-10 text-center">
          <button
            onClick={() => router.push('/signup')}
            className="text-xs font-bold text-stone-400 hover:text-stone-600 transition-colors uppercase tracking-widest"
          >
            新規アカウント作成はこちら
          </button>
        </div>
      </div>
    </div>
  );
}