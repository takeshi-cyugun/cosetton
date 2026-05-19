# Closetton (クローゼットン) - 子供服管理システム

**Closetton** は、お子様の成長に伴って増え続ける子供服を効率的に管理するための、モバイルファーストな在庫管理アプリケーションです。
サイズアウトの把握、家族間での在庫共有、季節ごとの入れ替えをスムーズにサポートします。

## 🚀 プロジェクト概要

子供の成長は早く、服の買い替え頻度が高いという課題を解決するために開発されました。
「誰の」「どのサイズの」「どの季節の」服が「どこにあるか（現役/保管/処分予定）」を瞬時に把握することを目指しています。

### 主な機能

- **モバイル最適化UI**: スマートフォンでの片手操作を意識した App-like な操作感。
- **衣服管理**: カテゴリ、サイズ、季節、所有者（パパ/ママ/子供名）による詳細な管理。
- **インタラクティブな一覧**: 2列5行のページネーション表示と、カードをタップした際の拡大表示アニメーション。
- **フィルタリング**: 所有者（Owner）ごとのリアルタイム絞り込み機能。
- **認証基盤**: Supabase Auth を利用した安全なログイン（実装中）。

## 🛠 技術スタック

### フロントエンド

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **ORM**: Drizzle ORM (型安全なデータベース操作)

### バックエンド / インフラ

- **BaaS**: Supabase
  - **Database**: PostgreSQL
  - **Authentication**: Supabase Auth
  - **Storage**: Supabase Storage (画像保存用)
- **Hosting**: Vercel
- **API**: FastAPI (Python による高度なデータ処理・ビジネスロジック)

### ローカル開発環境の構築

```bash
# リポジトリのクローン
git clone <https://github.com/your-username/Closetton.git>
cd Closetton/frontend

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```
