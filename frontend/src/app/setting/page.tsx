'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface FamilyMember {
  name: string;
  isRepresentative: boolean;
  defaultSize: string;
}

export default function SettingPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [familyId, setFamilyId] = useState('');
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState(''); // 新しい家族メンバーの名前
  const [newMemberSize, setNewMemberSize] = useState(''); // 新しいメンバーのサイズ
  const [editingMemberName, setEditingMemberName] = useState<string | null>(null); // 編集中のメンバー名
  const [tempSize, setTempSize] = useState(''); // 編集中のサイズ（一時保存用）
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // ログイン可能なアカウントリスト（モックデータ）
  const VALID_USERS = [
    { familyId: 'mai', userName: 'マイ', isRepresentative: true, defaultSize: '110' },
    { familyId: 'mai', userName: 'パパ', isRepresentative: false, defaultSize: 'L' },
    { familyId: 'mai', userName: 'ママ', isRepresentative: false, defaultSize: 'M' },
    { familyId: 'demo', userName: 'demo', isRepresentative: true, defaultSize: 'Free' },
  ];

  useEffect(() => {
    const auth = localStorage.getItem('closetton_auth');
    if (!auth) {
      router.push('/login');
      return;
    }
    const { familyId: storedFamilyId, userName: storedName } = JSON.parse(auth);
    setUserName(storedName);
    setFamilyId(storedFamilyId);

    // 家族IDに紐づくメンバーを抽出
    const members = VALID_USERS
      .filter(u => u.familyId === storedFamilyId)
      .map(u => ({
        name: u.userName,
        isRepresentative: u.isRepresentative,
        defaultSize: u.defaultSize
      }));
    setFamilyMembers(members);
  }, [router]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('closetton_auth');
    router.push('/login');
  };

  const handleAddMember = () => {
    if (!newMemberName.trim()) {
      setToast({ message: '名前を入力してください', type: 'error' });
      return;
    }

    if (familyMembers.length >= 5) {
      setToast({ message: '家族メンバーは最大5名までです', type: 'error' });
      return;
    }

    const newMember: FamilyMember = {
      name: newMemberName,
      isRepresentative: false,
      defaultSize: newMemberSize || '-'
    };

    setFamilyMembers([...familyMembers, newMember]);
    setNewMemberName('');
    setNewMemberSize('');
    setToast({ message: 'メンバーを追加しました', type: 'success' });
  };

  return (
    <div className="min-h-screen bg-[#f4f1f0] pb-24">
      <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-20 border-b border-stone-200">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <button
            onClick={() => router.push('/')}
            className="text-stone-600 hover:text-stone-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <h1 className="text-xl font-bold text-gray-800">設定</h1>
          
          <div className="relative" ref={menuRef}>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-9 h-9 rounded-full bg-stone-200 border border-stone-300 flex items-center justify-center text-stone-700 font-bold text-sm shadow-sm active:scale-90 transition-transform">
              {userName ? userName.charAt(0) : 'U'}
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-stone-100 py-2 animate-in fade-in zoom-in-95 duration-200 z-50">
                <div className="px-4 py-2 border-b border-stone-50">
                  <p className="text-[10px] font-bold text-stone-400 uppercase">ログイン中</p>
                  <p className="text-sm font-bold text-stone-700 truncate">{userName} さん</p>
                </div>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  ログアウト
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <div className="space-y-6">
          <section className="bg-white rounded-3xl p-5 shadow-sm border border-stone-100">
            <h2 className="text-sm font-bold text-stone-400 uppercase mb-4 px-1">家族情報</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-stone-50 rounded-2xl">
                <span className="text-sm font-bold text-stone-500">家族ID</span>
                <span className="text-sm font-extrabold text-stone-700">{familyId}</span>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-stone-400 ml-1 uppercase tracking-wider">家族メンバー</p>
                <div className="space-y-2">
                  {familyMembers.map((member) => (
                    <div key={member.name} className="group flex items-center justify-between p-3 bg-white border border-stone-100 rounded-2xl shadow-sm hover:border-blue-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-stone-700">{member.name}</span>
                            {member.isRepresentative && (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full border border-amber-200">
                                代表
                              </span>
                            )}
                          </div>
                          {editingMemberName === member.name ? (
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="text-[10px] font-bold text-stone-400">サイズ:</span>
                              <input
                                type="text"
                                value={tempSize}
                                onChange={(e) => setTempSize(e.target.value)}
                                className="text-[10px] font-bold text-stone-700 border-b border-stone-400 focus:outline-none w-12 bg-transparent p-0"
                                autoFocus
                              />
                            </div>
                          ) : (
                            <p className="text-[10px] font-bold text-stone-400 mt-0.5">サイズ: {member.defaultSize}</p>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          if (editingMemberName === member.name) {
                            setEditingMemberName(null);
                          } else {
                            setEditingMemberName(member.name);
                            setTempSize(member.defaultSize);
                          }
                        }}
                        className="p-2 text-stone-300 hover:text-stone-700 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              {/* 新しい家族メンバー追加UI */}
              <div className="space-y-2 pt-4 border-t border-stone-100 mt-4">
                <p className="text-[10px] font-bold text-stone-400 ml-1 uppercase tracking-wider">新しいメンバーを追加</p>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="名前（例: パパ）"
                    className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-500/10 text-sm"
                  />
                  <input
                    type="text"
                    value={newMemberSize}
                    onChange={(e) => setNewMemberSize(e.target.value)}
                    placeholder="サイズ（例: 110, L）"
                    className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-500/10 text-sm"
                  />
                  <button
                    className="w-full py-2.5 bg-stone-700 text-white rounded-xl font-bold text-sm shadow-md shadow-stone-500/10 active:scale-95 transition-transform"
                    onClick={handleAddMember}
                  >
                    追加
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-stone-200 flex justify-around pt-3 pb-6 px-2 z-30">
        <button className="flex flex-col items-center flex-1 text-stone-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          <span className="text-[10px] mt-1 font-bold">設定</span>
        </button>
        <button onClick={() => router.push('/')} className="flex flex-col items-center flex-1 text-stone-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          <span className="text-[10px] mt-1 font-medium">一覧</span>
        </button>
        <button onClick={() => router.push('/register')} className="flex flex-col items-center flex-1 text-stone-400">
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