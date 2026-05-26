'use client';

import React, { useState, useEffect, ChangeEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [category, setCategory] = useState('');
  const [season, setSeason] = useState<string[]>([]); // 複数選択のため配列に変更
  const [status, setStatus] = useState('現役'); // Default status
  const [userName, setUserName] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [familyId, setFamilyId] = useState(''); // familyIdを追加
  const [owner, setOwner] = useState('');
  const [description, setDescription] = useState(''); // Assuming description is also a text input
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // エラー通知を自動で消す
  useEffect(() => {
    if (toast && toast.type === 'error') {
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

  // ログイン情報を取得して「所有者」の初期値に設定
  useEffect(() => {
    const auth = localStorage.getItem('closetton_auth');
    if (auth) { // authが存在する場合のみパース
      const { userName, familyId: storedFamilyId } = JSON.parse(auth); // familyIdも取得
      setUserName(userName);
      setOwner(userName);
      setFamilyId(storedFamilyId); // familyIdを設定
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('closetton_auth');
    router.push('/login');
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));

      // AI解析の実行
      try {
        setIsAnalyzing(true);
        
        // 30秒のタイムアウトを設定
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/items/analyze`, {
          method: 'POST',
          body: formData,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const analysisResult = await response.json();
          console.log("AI解析結果:", analysisResult);
          
          // フォームに自動セット
          if (analysisResult.name) setName(analysisResult.name);
          if (analysisResult.category) setCategory(analysisResult.category);
          
          // シーズンの処理 (AIは "春,秋" のような文字列を返すので配列に変換)
          if (analysisResult.season) {
            const seasonsArray = analysisResult.season
              .split(',')
              .map((s: string) => s.trim())
              .filter((s: string) => ['春', '夏', '秋', '冬', '通年'].includes(s));
            
            if (seasonsArray.length > 0) {
              // 「通年」が含まれている場合はそれだけにする
              if (seasonsArray.includes('通年')) {
                setSeason(['通年']);
              } else {
                setSeason(seasonsArray);
              }
            }
          }
        }
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          // console.warn("AI解析がタイムアウトしました。");
          setToast({ message: '解析がタイムアウトしました。手動で入力してください。', type: 'error' });
        } else {
          // console.error("AI解析中にエラーが発生しました:", error);
        }
      } finally {
        setIsAnalyzing(false);
      }
    } else {
      setSelectedImage(null);
      setImagePreviewUrl(null);
    }
  };

  const handleSeasonChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (!checked) {
      setSeason((prev) => prev.filter((s) => s !== value));
      return;
    }

    if (value === '通年') {
      setSeason(['通年']);
    } else if (value === '春' || value === '夏') {
      setSeason((prev) => [...prev.filter((s) => s === '春' || s === '夏'), value]);
    } else if (value === '秋' || value === '冬') {
      setSeason((prev) => [...prev.filter((s) => s === '秋' || s === '冬'), value]);
    }
  };

  const handleRegister = async () => {
    // 簡易バリデーション
    if (!selectedImage || !name || !size || !category || season.length === 0 || !owner || !familyId) { // familyIdのバリデーションを追加
      // 必須項目が未入力の場合、エラーメッセージを表示して処理を中断
      setToast({ message: '必須項目をすべて入力してください', type: 'error' });
      return;
    }

    try {
      setIsSubmitting(true);

      // FormDataを作成し、画像とテキストデータをセット
      const formData = new FormData();
      formData.append('file', selectedImage); // バックエンドの引数名 'file' と合わせる
      formData.append('name', name);
      formData.append('size', size);
      formData.append('category', category); // カテゴリーはそのまま
      formData.append('season', season.join(',')); // 配列をカンマ区切りの文字列に変換
      formData.append('status', status);
      formData.append('familyId', familyId); // familyIdを追加
      formData.append('owner', owner);
      formData.append('description', description);

      const response = await fetch(`${API_BASE_URL}/items`, {
        method: 'POST',
        // FormDataをbodyに渡す場合、Content-Typeヘッダーを明示的に指定してはいけません
        body: formData,
      });

      if (!response.ok) {
        throw new Error('登録に失敗しました');
      }

      setToast({ message: '登録が完了しました！', type: 'success' });
      
      // トーストを見せるために少し待ってから遷移
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 1500);
    } catch (e) {
      console.error("Register error:", e);
      setToast({ message: 'エラーが発生しました。再度お試しください。', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
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
          
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm shadow-sm active:scale-90 transition-transform"
            >
              {userName ? userName.charAt(0) : 'U'}
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-in fade-in zoom-in-95 duration-200 z-50">
                <div className="px-4 py-2 border-b border-slate-50">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">ログイン中</p>
                  <p className="text-sm font-bold text-slate-700 truncate">{userName} さん</p>
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

      {/* AI解析中または登録中のオーバーレイ */}
      {(isAnalyzing || isSubmitting) && (
        <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-[1px] z-50 flex items-center justify-center">
          <div className="bg-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100">
            <div className="animate-spin h-5 w-5 border-3 border-blue-600 border-t-transparent rounded-full" />
            <span className="font-bold text-slate-700">
              {isAnalyzing ? 'AIが洋服を解析中...' : '登録しています...'}
            </span>
          </div>
        </div>
      )}

      <main className="max-w-md mx-auto px-4 py-4">
        <div className="space-y-4">
          <div>
            <label className="flex items-center text-sm font-medium text-slate-700 mb-1">
              画像
              <span className="ml-2 px-1.5 py-0.5 bg-red-50 text-red-500 text-[10px] font-bold rounded border border-red-100">必須</span>
            </label>
            <div className="text-center"> {/* このdivが子要素を中央揃えにします */}
              {!selectedImage ? (
                <div className="flex items-center gap-3 justify-center"> {/* ボタンと隠しinputを中央に配置 */}
                  <label
                    htmlFor="image"
                    className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full hover:bg-blue-100 transition-colors border border-blue-100"
                  >
                    画像を選択
                  </label>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative inline-block mt-2"> {/* inline-block要素は親のtext-centerで中央揃えになります */}
                  <img 
                    src={imagePreviewUrl || ''} 
                    alt="Image Preview" 
                    className="max-w-full h-auto rounded-lg shadow-md object-cover max-h-64" 
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreviewUrl(null);
                      setName('');
                      setCategory('');
                      setSeason([]);
                    }}
                    className="absolute -top-2 -right-2 bg-slate-400/60 text-white rounded-full p-1 shadow-lg hover:bg-slate-500/80 transition-colors border-2 border-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
              )}
            </div>
          </div>

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
              disabled={isAnalyzing}
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
              disabled={isAnalyzing}
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
              disabled={isAnalyzing}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="例: トップス, ボトムス, アウター"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
              シーズン
              <span className="ml-2 px-1.5 py-0.5 bg-red-50 text-red-500 text-[10px] font-bold rounded border border-red-100">必須</span>
            </label>
            <div className="flex flex-wrap gap-x-6 gap-y-3 px-1">
              {['春', '夏', '秋', '冬', '通年'].map((s) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      value={s}
                      checked={season.includes(s)}
                      onChange={handleSeasonChange}
                      disabled={
                        isAnalyzing || (season.includes('通年') && s !== '通年') ||
                        ((season.includes('春') || season.includes('夏')) && !['春', '夏'].includes(s)) ||
                        ((season.includes('秋') || season.includes('冬')) && !['秋', '冬'].includes(s))
                      }
                      className="w-5 h-5 border-2 border-slate-300 rounded-md checked:bg-blue-600 checked:border-blue-600 appearance-none transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    />
                    <svg 
                      className={`absolute left-0.5 top-0.5 w-4 h-4 text-white pointer-events-none transition-opacity ${season.includes(s) ? 'opacity-100' : 'opacity-0'}`} 
                      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className={`text-sm font-bold ${season.includes(s) ? 'text-blue-600' : 'text-slate-500'}`}>{s}</span>
                </label>
              ))}
            </div>
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
              disabled={isAnalyzing}
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
              disabled={isAnalyzing}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="例: 自分, 夫, 息子"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
              説明 ・収納場所(任意)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isAnalyzing}
              rows={2}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-y"
              placeholder="洋服に関するメモなど"
            ></textarea>
          </div>

          <button
            onClick={handleRegister}
            disabled={isSubmitting || isAnalyzing}
            className={`w-full py-3 text-white rounded-lg font-bold shadow-lg transition-all active:scale-[0.98] ${
              isSubmitting || isAnalyzing ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 shadow-blue-500/20'
            }`}
          >
            {isSubmitting ? '登録中...' : isAnalyzing ? 'AI解析中...' : '登録'}
          </button>
        </div>
      </main>

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