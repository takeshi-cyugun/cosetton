import React from 'react';

// モックデータ
const MOCK_ITEMS = [
  { id: 1, name: 'ボーダーTシャツ', size: '90cm', category: 'トップス', season: '春夏', status: '現役', owner: 'マイ', image: 'https://via.placeholder.com/150' },
  { id: 2, name: 'デニムパンツ', size: '95cm', category: 'ボトムス', season: '通年', status: '現役', owner: 'マイ', image: 'https://via.placeholder.com/150' },
  { id: 3, name: '中綿ジャケット', size: '100cm', category: 'アウター', season: '秋冬', status: '保管中', owner: 'パパ', image: 'https://via.placeholder.com/150' },
  { id: 4, name: 'チェック柄ロンパース', size: '80cm', category: '全身', season: '春夏', status: '処分予定', owner: 'ママ', image: 'https://via.placeholder.com/150' },
];

export default function ItemsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">洋服一覧</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-sm">
            ＋ 追加
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* 簡易検索・フィルタ（プレースホルダ） */}
        <div className="mb-6 flex gap-2">
          <input
            type="text"
            placeholder="名前で検索..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white">
            <option>サイズ</option>
          </select>
        </div>

        {/* グリッド表示 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {MOCK_ITEMS.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="aspect-square bg-gray-200 relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="object-cover w-full h-full"
                />
                <span className={`absolute top-2 right-2 px-2 py-1 text-[10px] font-bold rounded-full ${
                  item.status === '現役' ? 'bg-green-100 text-green-700' : 
                  item.status === '保管中' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {item.status}
                </span>
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-500">{item.category} / {item.size} / {item.season} / {item.owner}</p>
                <h2 className="text-sm font-bold text-gray-800 truncate">{item.name}</h2>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* スマートフォン向けボトムナビゲーション（プレースホルダ） */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3">
        <button className="flex flex-col items-center text-blue-600">
          <span className="text-[10px] mt-1">一覧</span>
        </button>
        <button className="flex flex-col items-center text-gray-400">
          <span className="text-[10px] mt-1">子供</span>
        </button>
        <button className="flex flex-col items-center text-gray-400">
          <span className="text-[10px] mt-1">設定</span>
        </button>
      </nav>
    </div>
  );
}