'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Item {
  id: number;
  name: string;
  size: string;
  category: string;
  season: string;
  status: string;
  owner: string;
  image: string;
  description?: string;
}

const ITEMS_PER_PAGE = 10;
import { useRouter } from 'next/navigation';

export default function ItemsPage() {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedStatus, setEditedStatus] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('処分済以外');
  const [ownerFilter, setOwnerFilter] = useState<string>('すべて');
  const [isOwnerFilterExpanded, setIsOwnerFilterExpanded] = useState(false);
  const [seasonFilter, setSeasonFilter] = useState<string>('通年');
  const [isSeasonFilterExpanded, setIsSeasonFilterExpanded] = useState(false);
  const [isStatusFilterExpanded, setIsStatusFilterExpanded] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [userName, setUserName] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // スワイプ操作のための状態
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || !selectedItem) return;
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50; // スワイプと判定する最小距離

    if (Math.abs(distance) > minSwipeDistance) {
      const currentIndex = filteredItems.findIndex(item => item.id === selectedItem.id);
      if (currentIndex !== -1) {
        let nextIndex;
        if (distance > 0) {
          // 左スワイプ（次へ）
          nextIndex = (currentIndex + 1) % filteredItems.length;
        } else {
          // 右スワイプ（前へ）
          nextIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
        }
        setSelectedItem(filteredItems[nextIndex]);
        setIsEditing(false); // 切り替え時に編集モードをリセット
      }
    }
  };

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const auth = localStorage.getItem('closetton_auth');
    if (!auth) {
      router.push('/login');
      return;
    }
    const { familyId, userName: storedName } = JSON.parse(auth);
    setUserName(storedName);

    const fetchItems = async () => {
      try {
        // console.log("Fetching items from API...");
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/items?familyId=${familyId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Item[] = await response.json();
        // console.log("Fetched data:", data);
        setItems(data);
      } catch (e) {
        console.error("Fetch error details:", e);
        // e が Error オブジェクトかどうかを確認して安全にメッセージを取り出す
        setError(e instanceof Error ? e.message : '予期せぬエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [router]);

  // 通知を自動で消す
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // メニューの外側をクリックした時に閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 保存処理
  const handleSave = async () => {
    if (!selectedItem) return;
    try {
      const response = await fetch(`${API_BASE_URL}/items/${selectedItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editedName, status: editedStatus, description: editedDescription }),
      });

      if (!response.ok) {
        throw new Error('Update failed');
      }

      const updatedItem = await response.json();
      
      // ローカルの状態を更新
      setItems(items.map(item => item.id === updatedItem.id ? updatedItem : item));
      setSelectedItem(updatedItem);
      setIsEditing(false);
      setToast({ message: '変更を保存しました', type: 'success' });
    } catch (e) {
      console.error("Update error:", e);
      setToast({ message: '保存に失敗しました', type: 'error' });
    }
  };

  // ログアウト処理
  const handleLogout = () => {
    localStorage.removeItem('closetton_auth');
    router.push('/login');
  };

  // 所有者のリストを抽出（重複排除）
  const owners = ['すべて', ...Array.from(new Set(items.map(item => item.owner).filter(Boolean).filter(o => o !== 'すべて')))];
  // シーズンのリスト（固定）
  const seasons = ['通年', '春', '夏', '秋', '冬'];

  // フィルタリング処理
  const searchWords = searchQuery.trim().toLowerCase().split(/[\s　]+/).filter(Boolean);
  const filteredItems = items.filter(item => 
    (ownerFilter === 'すべて' || item.owner === ownerFilter) &&
    (seasonFilter === '通年' || item.season === '通年' || item.season?.includes(seasonFilter)) &&
    searchWords.every(word =>
      item.name.toLowerCase().includes(word) ||
      item.category.toLowerCase().includes(word) ||
      item.description?.toLowerCase().includes(word)
    ) &&
    (
      statusFilter === 'すべて' 
        ? true 
        : statusFilter === '処分済以外' 
          ? item.status !== '処分済' 
          : item.status === statusFilter
    )
  );

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-[#f4f1f0] pb-24">
      {/* ヘッダー */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-20 border-b border-stone-200">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">クローゼット一覧</h1>
          
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-9 h-9 rounded-full bg-stone-200 border border-stone-300 flex items-center justify-center text-stone-700 font-bold text-sm shadow-sm active:scale-90 transition-transform"
            >
              {userName ? userName.charAt(0) : 'U'}
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-stone-100 py-2 animate-in fade-in zoom-in-95 duration-200 z-50">
                <div className="px-4 py-2 border-b border-stone-50">
                  <p className="text-[10px] font-bold text-stone-400 uppercase">ログイン中</p>
                  <p className="text-sm font-bold text-stone-700 truncate">{userName} さん</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  ログアウト
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4">
        {/* 簡易検索・フィルタ */}
        <div className="mb-6 space-y-3">
          <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // 検索ワードが変わったら1ページ目に戻す
                }}
                placeholder="名前やカテゴリで検索..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-500/20 focus:border-stone-500 text-sm shadow-sm"
              />
              <svg className="absolute left-3 top-3 text-stone-400" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>

          {/* フィルタエリア (プルダウン形式) */}
          <div className="flex flex-wrap gap-x-3 gap-y-4 items-end min-h-[40px] relative z-10">
            {/* 所有者フィルタ */}
            {owners.length > 2 && (
            <div className="flex flex-col gap-1 shrink-0">
              <span className="text-[10px] font-bold text-stone-400 ml-1">所有者</span>
              <div className="relative">
              <button
                onClick={() => {
                  setIsOwnerFilterExpanded(!isOwnerFilterExpanded);
                  setIsSeasonFilterExpanded(false);
                  setIsStatusFilterExpanded(false);
                }}
                className="px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all bg-stone-600 text-white shadow-md shadow-stone-500/10 flex items-center gap-1.5 shrink-0 active:scale-95"
              >
                {ownerFilter}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="14" height="14" 
                  viewBox="0 0 24 24" fill="none" 
                  stroke="currentColor" strokeWidth="3" 
                  strokeLinecap="round" strokeLinejoin="round"
                  className={`transition-transform duration-200 ${isOwnerFilterExpanded ? 'rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {isOwnerFilterExpanded && (
                <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-stone-200 rounded-2xl shadow-xl py-1 animate-in slide-in-from-top-2 fade-in duration-200 z-50">
                  {owners.map(owner => (
                    <button
                      key={owner}
                      onClick={() => {
                        setOwnerFilter(owner);
                        setCurrentPage(1);
                        setIsOwnerFilterExpanded(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors ${
                        ownerFilter === owner ? 'text-stone-800 bg-stone-100' : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {owner}
                    </button>
                  ))}
                </div>
              )}
              </div>
            </div>
            )}

            {/* シーズンフィルタ */}
            <div className="flex flex-col gap-1 shrink-0">
              <span className="text-[10px] font-bold text-stone-400 ml-1">シーズン</span>
              <div className="relative">
              <button
                onClick={() => {
                  setIsSeasonFilterExpanded(!isSeasonFilterExpanded);
                  setIsOwnerFilterExpanded(false);
                  setIsStatusFilterExpanded(false);
                }}
                className="px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all bg-stone-700 text-white shadow-md shadow-stone-500/10 flex items-center gap-1.5 shrink-0 active:scale-95"
              >
                {seasonFilter}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="14" height="14" 
                  viewBox="0 0 24 24" fill="none" 
                  stroke="currentColor" strokeWidth="3" 
                  strokeLinecap="round" strokeLinejoin="round"
                  className={`transition-transform duration-200 ${isSeasonFilterExpanded ? 'rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {isSeasonFilterExpanded && (
                <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-stone-200 rounded-2xl shadow-xl py-1 animate-in slide-in-from-top-2 fade-in duration-200 z-50">
                  {seasons.map(season => (
                    <button
                      key={season}
                      onClick={() => {
                        setSeasonFilter(season);
                        setCurrentPage(1);
                        setIsSeasonFilterExpanded(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors ${
                        seasonFilter === season ? 'text-stone-800 bg-stone-100' : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {season}
                    </button>
                  ))}
                </div>
              )}
              </div>
            </div>

            {/* ステータスフィルタ */}
            <div className="flex flex-col gap-1 shrink-0">
              <span className="text-[10px] font-bold text-stone-400 ml-1">ステータス</span>
              <div className="relative">
              <button
                onClick={() => {
                  setIsStatusFilterExpanded(!isStatusFilterExpanded);
                  setIsOwnerFilterExpanded(false);
                  setIsSeasonFilterExpanded(false);
                }}
                className="px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all bg-stone-800 text-white shadow-md shadow-stone-500/20 flex items-center gap-1.5 shrink-0 active:scale-95"
              >
                {statusFilter}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="14" height="14" 
                  viewBox="0 0 24 24" fill="none" 
                  stroke="currentColor" strokeWidth="3" 
                  strokeLinecap="round" strokeLinejoin="round"
                  className={`transition-transform duration-200 ${isStatusFilterExpanded ? 'rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {isStatusFilterExpanded && (
                <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-stone-200 rounded-2xl shadow-xl py-1 animate-in slide-in-from-top-2 fade-in duration-200 z-50">
                  {['すべて', '処分済以外', '現役', '保管中', '処分予定', '処分済'].map(status => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setCurrentPage(1);
                        setIsStatusFilterExpanded(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors ${
                        statusFilter === status ? 'text-stone-800 bg-stone-100' : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
              </div>
            </div>
          </div>
        </div>

        {/* 状態表示 */}
        {loading && <div className="text-center py-8 text-stone-500">データを読み込み中...</div>}
        {error && <div className="text-center py-8 text-red-500">エラーが発生しました: {error}</div>}
        {!loading && !error && filteredItems.length === 0 && (
          <div className="text-center py-8 text-stone-500">表示する洋服がありません。</div>
        )}

        {/* グリッド表示 */}
        {!loading && !error && filteredItems.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {displayedItems.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setSelectedItem(item)}
              className="bg-white rounded-2xl shadow-sm overflow-hidden border border-stone-100 active:scale-[0.98] transition-transform cursor-pointer"
            >
              <div className="aspect-[4/5] bg-stone-100 relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="object-cover w-full h-full opacity-90"
                />
                <span className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold rounded-lg shadow-sm ${
                  item.status === '現役' ? 'bg-green-500 text-white' : 
                  item.status === '保管中' ? 'bg-blue-500 text-white' : 
                  item.status === '処分予定' ? 'bg-orange-500 text-white' :
                  item.status === '処分済' ? 'bg-stone-400 text-white' : 'bg-stone-500 text-white'
                }`}>
                  {item.status}
                </span>
              </div>
              <div className="p-3">
                <p className="text-[10px] font-medium text-stone-400 mb-0.5"> {item.category} / {item.size} / {item.season} / {item.owner}</p>
                <h2 className="text-[13px] font-bold text-stone-800 truncate">{item.name}</h2>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* ページネーション */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-stone-200 text-stone-600 disabled:opacity-30 disabled:bg-stone-50 transition-all active:scale-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            
            <span className="text-sm font-bold text-stone-500">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-stone-200 text-stone-600 disabled:opacity-30 disabled:bg-stone-50 transition-all active:scale-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        )}
      </main>

      {/* 拡大表示（モーダル） */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => {
            setSelectedItem(null);
            setIsEditing(false);
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            key={selectedItem.id}
            className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()} // モーダル内クリックで閉じないように
          >
            <div className="relative aspect-square">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => {
                  setSelectedItem(null);
                  setIsEditing(false);
                }}
                className="absolute top-4 right-4 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-lg text-stone-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="px-6 py-5">
              <div className="flex justify-between items-start mb-1 gap-4">
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="text-2xl font-bold text-stone-800 border-b-2 border-stone-500 focus:outline-none w-full"
                    />
                  ) : (
                    <h2 className="text-2xl font-bold text-stone-800 truncate">{selectedItem.name}</h2>
                  )}
                </div>
                <div className={`py-1.5 px-3 rounded-xl flex items-center justify-center transition-colors shadow-sm shrink-0 ${
                  !isEditing ? (
                    selectedItem.status === '現役' ? 'bg-green-500 text-white' : 
                    selectedItem.status === '保管中' ? 'bg-blue-500 text-white' : 
                    selectedItem.status === '処分予定' ? 'bg-orange-500 text-white' :
                    selectedItem.status === '処分済' ? 'bg-stone-400 text-white' : 'bg-stone-500 text-white'
                  ) : 'bg-stone-100 border border-stone-200'
                }`}>
                  {isEditing ? (
                    <select
                      value={editedStatus}
                      onChange={(e) => setEditedStatus(e.target.value)}
                      className="bg-transparent text-stone-700 font-bold focus:outline-none text-xs text-center cursor-pointer"
                    >
                      <option value="現役">現役</option>
                      <option value="保管中">保管中</option>
                      <option value="処分予定">処分予定</option>
                      <option value="処分済">処分済</option>
                    </select>
                  ) : (
                    <p className="text-xs font-bold">{selectedItem.status}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="bg-stone-50 py-1.5 px-4 rounded-xl">
                  <p className="text-[10px] text-stone-400 font-bold uppercase mb-0.5">カテゴリー</p>
                  <p className="text-stone-700 font-bold">{selectedItem.category}</p>
                </div>
                <div className="bg-stone-50 py-1.5 px-4 rounded-xl">
                  <p className="text-[10px] text-stone-400 font-bold uppercase mb-0.5">サイズ</p>
                  <p className="text-stone-700 font-bold">{selectedItem.size}</p>
                </div>
                <div className="bg-stone-50 py-1.5 px-4 rounded-xl">
                  <p className="text-[10px] text-stone-400 font-bold uppercase mb-0.5">シーズン</p>
                  <p className="text-stone-700 font-bold">{selectedItem.season}</p>
                </div>
                <div className="bg-stone-50 py-1.5 px-4 rounded-xl">
                  <p className="text-[10px] text-stone-400 font-bold uppercase mb-0.5">所有者</p>
                  <p className="text-stone-700 font-bold">{selectedItem.owner}</p>
                </div>
                <div className="bg-stone-50 py-1.5 px-4 rounded-xl col-span-2">
                  <p className="text-[10px] text-stone-400 font-bold uppercase mb-0.5">説明</p>
                  {isEditing ? (
                    <textarea
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      rows={1}
                      className="w-full bg-transparent text-stone-700 font-bold focus:outline-none border-b border-stone-500 resize-y"
                    ></textarea>
                  ) : (
                    <p className={`font-bold whitespace-pre-wrap ${selectedItem.description ? 'text-stone-700' : 'text-stone-400'}`}>
                      {selectedItem.description || '説明はありません'}
                    </p>
                  )}
                </div>
              </div>
              
              {!isEditing ? ( 
                <button 
                  onClick={() => {
                    setEditedName(selectedItem.name);
                    setEditedDescription(selectedItem.description || '');
                    setEditedStatus(selectedItem.status);
                    setIsEditing(true);
                  }}
                  className="w-full mt-3 py-3 bg-stone-100 text-stone-600 rounded-2xl font-bold active:scale-[0.98] transition-transform hover:bg-stone-200"
                >
                  編集する
                </button>
              ) : ( 
                <div className="flex gap-2 mt-3">
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-4 bg-stone-100 text-stone-600 rounded-2xl font-bold active:scale-[0.98] transition-transform"
                  >
                    キャンセル
                  </button>
                  <button 
                    onClick={handleSave}
                    className="flex-1 py-4 bg-stone-800 text-white rounded-2xl font-bold shadow-lg shadow-stone-500/20 active:scale-[0.98] transition-transform"
                  >
                    保存
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* スマートフォン向けボトムナビゲーション */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-stone-200 flex justify-around pt-3 pb-6 px-2 z-30">
        <button 
          onClick={() => router.push('/setting')}
          className="flex flex-col items-center flex-1 text-stone-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          <span className="text-[10px] mt-1 font-medium">設定</span>
        </button>
        <button className="flex flex-col items-center flex-1 text-stone-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          <span className="text-[10px] mt-1 font-bold">一覧</span>
        </button>
        <button 
          onClick={() => router.push('/register')}
          className="flex flex-col items-center flex-1 text-stone-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          <span className="text-[10px] mt-1 font-medium">追加</span>
        </button>
      </nav>

      {/* トースト通知 */}
      {toast && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
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