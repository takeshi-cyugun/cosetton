# Closetton (クローゼットン)

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776ab?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-05998b)](https://fastapi.tiangolo.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-latest-C5F74F)](https://orm.drizzle.team/)
[![Supabase](https://img.shields.io/badge/Supabase-BaaS-3ecf8e)](https://supabase.com/)
[![Google AI](https://img.shields.io/badge/Google_AI-Gemini-4285F4?logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![Render](https://img.shields.io/badge/Render-Deployment-46E3B7?logo=render&logoColor=white)](https://render.com/)

**家族の「今」を共有する、クラウド上のデジタルクローゼット・マネージャー**

## 🌟 プロジェクト概要

「あの服、どこに仕舞ったっけ？」「前に似たような服買ったような気がするなぁ」という家族の疑問を解消するために開発されました。
**Closetton** は、家中のクローゼットをクラウドで共有し、家族の誰もが「いつでも・どこでも・直感的に」在庫を把握・管理できるデジタル空間を提供します。

### 解決する課題

- **情報の共有化**: 家族の誰が何を持っているか、どこにあるかをリアルタイムに共有。
- **AIによる整理の自動化**: Google Gemini APIを活用し、写真一枚で面倒なタグ付けを自動化。
- **無駄な買い物の削減**: 外出先でも現在の在庫を確認でき、重複購入や死蔵品を防ぎます。

## 🏗 システムアーキテクチャ

```mermaid
graph LR
    subgraph "Frontend (Vercel)"
        NextJS[Next.js App Router]
    end

    subgraph "Backend (Render.com)"
        FastAPI[FastAPI Server]
        Pydantic[Pydantic Models]
    end

    subgraph "Cloud / DB (Supabase)"
        Auth[Supabase Auth]
        DB[(PostgreSQL)]
        Storage[Supabase Storage]
    end

    subgraph "AI Service"
        Gemini[Google AI / Gemini API]
    end

    NextJS -- "REST API (JSON)" --> FastAPI
    FastAPI -- "CRUD / Auth Check" --> DB
    FastAPI -- "Upload / Download" --> Storage
    FastAPI -- "Image Analysis / Auto Tagging" --> Gemini
    NextJS -- "Session" --> Auth
```

## 🛠 技術スタック

### 技術選定の理由

- **Next.js (App Router) & TypeScript**: フロントエンドの型安全性を担保しつつ、Server Components を活用した高速なレンダリングを実現するため。
- **Python 3.10+ & FastAPI**: 高度なデータ処理やAI連携に優れたPythonを採用。FastAPIにより、モバイル端末からのリクエストにも高速に応答するバックエンドを構築しています。
- **Google AI (Gemini API)**: 「登録の面倒臭さ」を解消するコア技術。衣服画像を解析し、ブランド、カテゴリ、季節感などを自動抽出。家族全員が整理整頓を継続できる仕組みを支えます。
- **Render.com**: Pythonバックエンドのホスティングに使用。GitHub連携による自動デプロイ（CI/CD）が容易で、信頼性の高い実行環境を低コストで構築できるため。
- **Drizzle ORM**: Prisma よりも軽量で SQL ライクな記述が可能であり、TypeScript との親和性が極めて高いため。
- **Supabase**: 認証・DB・ストレージを統合管理でき、開発速度とコスト効率を最大化するため。

## ✨ 主な機能と技術的ハイライト

### 1. 家族で使いやすいモバイルUI/UX

- **Tailwind CSS** を活用したレスポンシブ設計。
- **Framer Motion**（または CSS Animation）による、カードタップ時のシームレスな拡大アニメーション。

### 2. Gemini AI による自動登録支援

- **インテリジェントな画像解析**: 写真をアップロードするだけで、Gemini API が衣服の特徴を分析。カテゴリや適切な季節を自動でレコメンドします。
- **マルチモーダル解析**: 画像内の文字情報や色彩から、ブランドや特徴的なスタイルを抽出。

### 3. 家族共有を支えるAPI基盤

- **リアルタイムデータ整合性**: 全ての DB 操作を FastAPI 経由で一元管理し、家族間でのデータ不整合を防止。
- **非同期 I/O (async/await)**: データベース接続や画像処理を非同期で行うことで、家族複数人による同時アクセスでも高いパフォーマンスを発揮。

### 4. クラウドストレージ連携

- **Supabase Storage** を利用した画像管理。
- `python-multipart` を用いた非同期的なバイナリデータ処理の最適化。

### 5. 高度なフィルタリング

- 状態（現役・保管・処分）やサイズに応じた動的なクエリ発行。

## 🔗 デモサイト

以下のURLからどなたでも自由にお試しいただけます。

- **URL**: [https://closetton.vercel.app/](https://closetton.vercel.app/)
- **ログイン情報**: 家族ID: `demo` / お名前: `demo`

## 画面イメージ

### 1. ログイン画面

家族IDとお名前による認証画面です。特定の家族メンバーのみがクローゼットにアクセスできる安全な入り口を提供します。

![ログイン画面](frontend/public/login.png)

### 2. クローゼット一覧 (トップ画面)

登録された洋服をカード形式で一覧表示します。名前検索やステータス、所有者による強力なフィルタリング機能により、目的の服をすぐに見つけることができます。

![トップ画面](frontend/public/top.png)

### 3. 詳細・編集画面

選択したアイテムの詳細情報を確認・更新する画面です。ステータスの変更（現役から保管中へなど）やメモの追記をシームレスに行えます。

![詳細画面](frontend/public/detail.png)

### 4. 洋服登録画面

新しくアイテムをクローゼットに追加する画面です。画像のアップロードからサイズ・カテゴリの設定まで、スマートフォンから片手で直感的に操作できます。

![登録画面](frontend/public/register.png)

## 📂 プロジェクト構成

```text
├── frontend/      # Next.js (TypeScript, Drizzle ORM, Tailwind)
├── backend/       # FastAPI (Python 3.10+, Pydantic)
├── supabase/      # Migrations & Seed data (Optional)
├── .gitignore
└── README.md
```

## ⚙️ セットアップ

### 1. バックエンド (FastAPI)

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install fastapi uvicorn supabase pydantic-settings python-multipart
uvicorn main:app --reload
```

※ `python-multipart` はフォームデータの処理（画像アップロード）に必須です。

### 2. フロントエンド (Next.js)

```bash
cd frontend
npm install
npm run dev
```
