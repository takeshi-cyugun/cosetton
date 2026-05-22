'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [familyId, setFamilyId] = useState('');
  const [userName, setUserName] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const router = useRouter();

  // エラー通知を自動で消す
  useEffect(() => {
    if (toast && toast.type === 'error') {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // ログイン可能なアカウントリスト
  const VALID_USERS = [
    { familyId: 'mai', userName: 'マイ' },
    { familyId: 'mai', userName: 'パパ' },
    { familyId: 'mai', userName: 'ママ' },
    { familyId: 'demo', userName: 'demo' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = VALID_USERS.some(
      (user) => user.familyId === familyId && user.userName === userName
    );

    if (isValid) {
      // 認証情報の保持（フロントエンドのみの簡易実装）
      const authData = {
        familyId,
        userName,
        token: `mock-token-${Date.now()}` // 擬似的なトークンを作成
      };
      localStorage.setItem('closetton_auth', JSON.stringify(authData));

      // 認証成功：トップページへ遷移
      router.push('/');
    } else {
      setToast({ message: '家族IDまたはお名前が正しくありません。', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 py-12">
      <div className="max-w-md w-full space-y-10 bg-white p-10 rounded-[2.5rem] shadow-xl shadow-blue-500/5 border border-slate-100">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-blue-600 tracking-tight">Closetton</h1>
          <p className="mt-3 text-[15px] text-slate-500 font-medium">お子様の成長を記録するクローゼット</p>
        </div>
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="familyId" className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">家族ID</label>
              <input
                id="familyId"
                type="text"
                required
                value={familyId}
                onChange={(e) => setFamilyId(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3.5 border border-slate-200 bg-slate-50/50 placeholder-slate-400 text-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:z-10 text-[16px] transition-all"
                placeholder="例: yamada-family"
              />
            </div>
            <div>
              <label htmlFor="userName" className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">お名前</label>
              <input
                id="userName"
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3.5 border border-slate-200 bg-slate-50/50 placeholder-slate-400 text-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:z-10 text-[16px] transition-all"
                placeholder="例: たろう"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-md font-bold rounded-2xl text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              ログイン
            </button>
          </div>

          <div className="text-center text-sm font-bold">
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              新規登録はこちら
            </a>
          </div>
        </form>
      </div>

      {/* トースト通知 */}
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className={`px-6 py-3 rounded-2xl shadow-xl font-bold text-white flex items-center gap-2 ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {toast.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            )}
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}
