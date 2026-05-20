'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [category, setCategory] = useState('');
  const [season, setSeason] = useState('');
  const [status, setStatus] = useState('現役'); // Default status
  const [owner, setOwner] = useState('');
  const [description, setDescription] = useState(''); // Assuming description is also a text input

  const handleRegister = () => {
    // For now, just log the data. Server registration will be in the next step.
    console.log('登録データ:', {
      name,
      size,
      category,
      season,
      status,
      owner,
      description,
    });
    alert('登録データをコンソールに出力しました。');
    // Optionally, clear the form or navigate back
    // setName('');
    // setSize('');
    // setCategory('');
    // setSeason('');
    // setStatus('現役');
    // setOwner('');
    // setDescription('');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-20 border-b border-slate-200">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="text-slate-600 hover:text-slate-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <h1 className="text-xl font-bold text-gray-800">洋服登録</h1>
          <div className="w-6"></div> {/* Spacer */}
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4">
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="flex items-center text-sm font-medium text-slate-700 mb-1">
              名前
              <span className="ml-2 px-1.5 py-0.5 bg-red-50 text-red-500 text-[10px] font-bold rounded border border-red-100">必須</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="洋服の名前"
            />
          </div>

          <div>
            <label htmlFor="size" className="flex items-center text-sm font-medium text-slate-700 mb-1">
              サイズ
              <span className="ml-2 px-1.5 py-0.5 bg-red-50 text-red-500 text-[10px] font-bold rounded border border-red-100">必須</span>
            </label>
            <input
              type="text"
              id="size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="例: M, L, 28, Free"
            />
          </div>

          <div>
            <label htmlFor="category" className="flex items-center text-sm font-medium text-slate-700 mb-1">
              カテゴリー
              <span className="ml-2 px-1.5 py-0.5 bg-red-50 text-red-500 text-[10px] font-bold rounded border border-red-100">必須</span>
            </label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="例: トップス, ボトムス, アウター"
            />
          </div>

          <div>
            <label htmlFor="season" className="flex items-center text-sm font-medium text-slate-700 mb-1">
              シーズン
            </label>
            <input
              type="text"
              id="season"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="例: 春夏, 秋冬, 通年"
            />
          </div>

          <div>
            <label htmlFor="status" className="flex items-center text-sm font-medium text-slate-700 mb-1">
              ステータス
              <span className="ml-2 px-1.5 py-0.5 bg-red-50 text-red-500 text-[10px] font-bold rounded border border-red-100">必須</span>
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white"
            >
              <option value="現役">現役</option>
              <option value="保管中">保管中</option>
              <option value="処分予定">処分予定</option>
              <option value="処分済">処分済</option>
            </select>
          </div>

          <div>
            <label htmlFor="owner" className="flex items-center text-sm font-medium text-slate-700 mb-1">
              所有者
              <span className="ml-2 px-1.5 py-0.5 bg-red-50 text-red-500 text-[10px] font-bold rounded border border-red-100">必須</span>
            </label>
            <input
              type="text"
              id="owner"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="例: 自分, 夫, 息子"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
              説明 (任意)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-y"
              placeholder="洋服に関するメモなど"
            ></textarea>
          </div>

          <button
            onClick={handleRegister}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-transform"
          >
            登録
          </button>
        </div>
      </main>
    </div>
  );
}