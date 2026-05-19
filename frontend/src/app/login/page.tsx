import React from 'react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 py-12">
      <div className="max-w-md w-full space-y-10 bg-white p-10 rounded-[2.5rem] shadow-xl shadow-blue-500/5 border border-slate-100">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-blue-600 tracking-tight">Closetton</h1>
          <p className="mt-3 text-[15px] text-slate-500 font-medium">お子様の成長を記録するクローゼット</p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">メールアドレス</label>
              <input
                id="email"
                type="email"
                required
                className="appearance-none relative block w-full px-4 py-3.5 border border-slate-200 bg-slate-50/50 placeholder-slate-400 text-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:z-10 text-[16px] transition-all"
                placeholder="mail@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" title="password" className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">パスワード</label>
              <input
                id="password"
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3.5 border border-slate-200 bg-slate-50/50 placeholder-slate-400 text-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:z-10 text-[16px] transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
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
        </div>
      </div>
    </div>
  );
}
