'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

type SignupMode = 'create' | 'join';
type Phase = 'input' | 'confirm';

export default function SignupPage() {
  const router = useRouter();
  const [mode, setMode] = useState<SignupMode>('create');
  const [phase, setPhase] = useState<Phase>('input');
  const [isLoading, setIsLoading] = useState(false);

  // 入力値の状態
  const [email, setEmail] = useState('');
  const [familyId, setFamilyId] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  // バリデーション
  const validate = () => {
    if (!name.trim()) return 'あなたの名前を入力してください。';
    if (name.length > 10) return '名前は10文字以内で入力してください。';

    if (mode === 'create') {
      if (!email.trim()) return '代表者のメールアドレスを入力してください。';
      if (email.length > 50) return 'メールアドレスは50文字以内で入力してください。';

      const effectiveFamilyId = familyId.trim() || email.trim();
      if (effectiveFamilyId.length < 5 || effectiveFamilyId.length > 50) return '家族IDは5文字以上50文字以下で入力してください。';

      const hasAlpha = /[a-zA-Z]/.test(effectiveFamilyId);
      const hasNum = /[0-9]/.test(effectiveFamilyId);
      const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(effectiveFamilyId);
      const typesCount = [hasAlpha, hasNum, hasSymbol].filter(Boolean).length;
      if (typesCount < 2) return '家族ID（または代用されるメールアドレス）は2種類以上の文字を組み合わせてください。';
    } else {
      if (!familyId.trim()) return '家族IDまたは代表者のメールアドレスを入力してください。';
    }
    
    return null;
  };

  const handleToConfirm = () => {
    const errMsg = validate();
    if (errMsg) {
      setError(errMsg);
      return;
    }

    // 家族IDが未入力の場合は代表者のメールアドレスをセット
    if (mode === 'create' && !familyId.trim()) {
      setFamilyId(email.trim());
    }

    setError(null);
    setPhase('confirm');
  };

  const handleRegister = async () => {
    setIsLoading(true);
    // 登録処理のシミュレーション
    setTimeout(() => {
      // localStorageへの保存（既存の認証形式に合わせる）
      localStorage.setItem('closetton_auth', JSON.stringify({
        familyId: familyId,
        userName: name
      }));
      setIsLoading(false);
      router.push('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f4f1f0] pb-12">
      {/* ヘッダー */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-20 border-b border-stone-200">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center">
          <button
            onClick={() => phase === 'confirm' ? setPhase('input') : router.back()}
            className="text-stone-600 hover:text-stone-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-gray-800 mr-6">
            {phase === 'input' ? '新規アカウント登録' : '入力内容の確認'}
          </h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-8">
        {phase === 'input' ? (
          <div className="space-y-6">
            {/* モード切り替え */}
            <div className="flex bg-stone-200 p-1 rounded-2xl">
              <button
                onClick={() => setMode('create')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${mode === 'create' ? 'bg-white shadow-sm text-stone-800' : 'text-stone-500'}`}
              >
                新しく家族IDを作る
              </button>
              <button
                onClick={() => setMode('join')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${mode === 'join' ? 'bg-white shadow-sm text-stone-800' : 'text-stone-500'}`}
              >
                家族IDに参加する
              </button>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 space-y-4">
              {mode === 'create' && (
                <div>
                  <label className="block text-xs font-bold text-stone-400 mb-1 ml-1 uppercase">代表者のメールアドレス</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@closetton.com"
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-500/10 text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-400 mb-1 ml-1 uppercase">
                  {mode === 'create' ? '家族ID' : '家族IDまたは代表者のメールアドレス'}
                </label>
                <input
                  type="text"
                  value={familyId}
                  onChange={(e) => setFamilyId(e.target.value)}
                  placeholder={mode === 'create' ? "5文字以上のID" : "IDまたはメールアドレス"}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-500/10 text-sm"
                />
                {mode === 'create' && (
                  <p className="text-[10px] text-stone-400 mt-1 ml-1">※5〜50文字、2種類以上の文字種</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-400 mb-1 ml-1 uppercase">あなたの名前</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例: パパ、ママ"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-500/10 text-sm"
                />
              </div>

              {error && (
                <p className="text-xs font-bold text-red-500 bg-red-50 p-3 rounded-xl border border-red-100 italic">
                  {error}
                </p>
              )}
            </div>

            <button
              onClick={handleToConfirm}
              className="w-full py-4 bg-stone-700 text-white rounded-2xl font-bold shadow-lg shadow-stone-500/10 active:scale-[0.98] transition-all"
            >
              確認画面へ進む
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
              <div className="text-center">
                <p className="text-sm font-bold text-slate-400 mb-1">
                  {mode === 'create' ? '新規アカウント作成' : '家族IDへ参加'}
                </p>
                <h2 className="text-lg font-bold text-slate-800">以下の内容で登録しますか？</h2>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-50">
                {mode === 'create' && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">メールアドレス</span>
                    <p className="text-sm font-bold text-slate-700">{email}</p>
                  </div>
                )}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                    {mode === 'create' ? '家族ID' : '家族IDまたは代表者のメールアドレス'}
                  </span>
                  <p className="text-sm font-bold text-stone-700">{familyId}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">登録する名前</span>
                  <p className="text-sm font-bold text-slate-700">{name}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleRegister}
                disabled={isLoading}
                className="w-full py-4 bg-stone-800 text-white rounded-2xl font-bold shadow-lg shadow-stone-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {isLoading && (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                )}
                {isLoading ? '登録中...' : 'この内容で登録する'}
              </button>
              
              <button
                onClick={() => setPhase('input')}
                disabled={isLoading}
                className="w-full py-4 bg-white text-slate-500 border border-slate-200 rounded-2xl font-bold active:scale-[0.98] transition-all"
              >
                修正する
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ローディング・オーバーレイ */}
      {isLoading && (
        <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px] z-50 flex items-center justify-center">
          <div className="bg-white px-8 py-6 rounded-3xl shadow-xl flex flex-col items-center gap-4 border border-stone-50">
            <div className="animate-spin h-8 w-8 border-4 border-stone-700 border-t-transparent rounded-full" />
            <span className="font-bold text-slate-700">アカウントを作成しています...</span>
          </div>
        </div>
      )}
    </div>
  );
}