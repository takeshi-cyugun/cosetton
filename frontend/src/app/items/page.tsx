'use client';

import React, { useState } from 'react';

interface Item {
  id: number;
  name: string;
  size: string;
  category: string;
  season: string;
  status: string;
  image: string;
  owner: string;
}

// モックデータ
const MOCK_ITEMS: Item[] = [
  { id: 1, name: 'ボーダーTシャツ', size: '90cm', category: 'トップス', season: '春夏', status: '現役', owner: 'マイ', image: 'https://via.placeholder.com/150' },
  { id: 2, name: 'デニムパンツ', size: '95cm', category: 'ボトムス', season: '通年', status: '現役', owner: 'マイ', image: 'https://via.placeholder.com/150' },
  { id: 3, name: '中綿ジャケット', size: '100cm', category: 'アウター', season: '秋冬', status: '保管中', owner: 'パパ', image: 'https://via.placeholder.com/150' },
  { id: 4, name: 'チェック柄ロンパース', size: '80cm', category: '全身', season: '春夏', status: '処分予定', owner: 'ママ', image: 'https://via.placeholder.com/150' },
  { id: 5, name: 'コットンTシャツ', size: '90cm', category: 'トップス', season: '春夏', status: '現役', owner: 'マイ', image: 'https://via.placeholder.com/150' },
  { id: 6, name: 'レギンス', size: '90cm', category: 'ボトムス', season: '通年', status: '現役', owner: 'マイ', image: 'https://via.placeholder.com/150' },
  { id: 7, name: 'パーカー', size: '100cm', category: 'トップス', season: '秋冬', status: '保管中', owner: 'パパ', image: 'https://via.placeholder.com/150' },
  { id: 8, name: 'サロペット', size: '95cm', category: '全身', season: '春夏', status: '現役', owner: 'マイ', image: 'https://via.placeholder.com/150' },
  { id: 9, name: '半袖シャツ', size: '110cm', category: 'トップス', season: '春夏', status: '現役', owner: 'マイ', image: 'https://via.placeholder.com/150' },
  { id: 10, name: 'ニットカーディガン', size: '100cm', category: 'トップス', season: '秋冬', status: '現役', owner: 'ママ', image: 'https://via.placeholder.com/150' },
  { id: 11, name: 'ショートパンツ', size: '90cm', category: 'ボトムス', season: '春夏', status: '現役', owner: 'マイ', image: 'https://via.placeholder.com/150' },
  { id: 12, name: '長袖肌着', size: '95cm', category: 'インナー', season: '通年', status: '保管中', owner: 'マイ', image: 'https://via.placeholder.com/150' },
];

const ITEMS_PER_PAGE = 10; // 2列 × 5行 = 10アイテム

export default function ItemsPage() {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ownerFilter, setOwnerFilter] = useState<string>('すべて');

  // 所有者のリストを抽出（重複排除）
  const owners = ['すべて', ...Array.from(new Set(MOCK_ITEMS.map(item => item.owner)))];

  // フィルタリング処理
  const filteredItems = MOCK_ITEMS.filter(item => 
    ownerFilter === 'すべて' || item.owner === ownerFilter
  );

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-20 border-b border-slate-200">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">洋服一覧</h1>
          <button className="bg-blue-600 active:bg-blue-700 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4">
        {/* 簡易検索・フィルタ */}
        <div className="mb-6 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="名前で検索..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm shadow-sm"
              />
              <svg className="absolute left-3 top-3 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <select className="px-3 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm shadow-sm focus:outline-none">
              <option>サイズ</option>
            </select>
          </div>

          {/* 所有者フィルタ (チップ形式) */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {owners.map(owner => (
              <button
                key={owner}
                onClick={() => {
                  setOwnerFilter(owner);
                  setCurrentPage(1); // フィルタ変更時は1ページ目に戻る
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  ownerFilter === owner 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                    : 'bg-white text-slate-500 border border-slate-200 active:bg-slate-50'
                }`}
              >
                {owner}
              </button>
            ))}
          </div>
        </div>

        {/* グリッド表示 */}
        <div className="grid grid-cols-2 gap-3">
          {displayedItems.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setSelectedItem(item)}
              className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100 active:scale-[0.98] transition-transform cursor-pointer"
            >
              <div className="aspect-[4/5] bg-slate-100 relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="object-cover w-full h-full opacity-90"
                />
                <span className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold rounded-lg shadow-sm ${
                  item.status === '現役' ? 'bg-green-500 text-white' : 
                  item.status === '保管中' ? 'bg-blue-500 text-white' : 'bg-slate-500 text-white'
                }`}>
                  {item.status}
                </span>
              </div>
              <div className="p-3">
                <p className="text-[10px] font-medium text-slate-400 mb-0.5"> {item.category} / {item.size} / {item.season} / {item.owner}</p>
                <h2 className="text-[13px] font-bold text-slate-800 truncate">{item.name}</h2>
              </div>
            </div>
          ))}
        </div>

        {/* ページネーション */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-30 disabled:bg-slate-50 transition-all active:scale-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            
            <span className="text-sm font-bold text-slate-500">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-30 disabled:bg-slate-50 transition-all active:scale-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        )}
      </main>

      {/* 拡大表示（モーダル） */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-square">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-lg text-slate-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full mb-2">
                    {selectedItem.category}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-800">{selectedItem.name}</h2>
                </div>
                <span className="text-lg font-bold text-slate-400">{selectedItem.size}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Season</p>
                  <p className="text-slate-700 font-bold">{selectedItem.season}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Status</p>
                  <p className="text-slate-700 font-bold">{selectedItem.status}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Owner</p>
                  <p className="text-slate-700 font-bold">{selectedItem.owner}</p>
                </div>
              </div>
              
              <button className="w-full mt-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-transform">
                編集する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* スマートフォン向けボトムナビゲーション */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200 flex justify-around pt-3 pb-6 px-2 z-30">
        <button className="flex flex-col items-center flex-1 text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          <span className="text-[10px] mt-1 font-bold">一覧</span>
        </button>
        <button className="flex flex-col items-center flex-1 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          <span className="text-[10px] mt-1 font-medium">子供</span>
        </button>
        <button className="flex flex-col items-center flex-1 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          <span className="text-[10px] mt-1 font-medium">設定</span>
        </button>
      </nav>
    </div>
  );
}
