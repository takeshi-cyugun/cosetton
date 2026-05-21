# Closetton (クローゼットン)

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776ab?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-05998b)](https://fastapi.tiangolo.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-latest-C5F74F)](https://orm.drizzle.team/)
[![Supabase](https://img.shields.io/badge/Supabase-BaaS-3ecf8e)](https://supabase.com/)

**子供の成長を記録し、家族で共有するモバイルファーストな在庫管理プラットフォーム**

## 🌟 プロジェクト概要

「せっかく買った服が、気づいたらサイズアウトしていた」「上の子の服がどこにあるか分からない」という育児の課題を解決するために開発されました。
**Closetton** は、単なるリスト管理ではなく、忙しい育児の合間に「片手で・直感的に」在庫を把握できる体験を提供します。

### 解決する課題

- **管理漏れの防止**: サイズ・季節・状態による強力なフィルタリング。
- **情報の非対称性の解消**: 家族間でのリアルタイムなデータ共有（実装予定）。
- **買い替えの最適化**: 在庫の可視化による、無駄な買い物の削減。

## 🏗 システムアーキテクチャ

```mermaid
graph LR
    subgraph "Frontend"
        NextJS[Next.js App Router]
    end

    subgraph "Backend (Python)"
        FastAPI[FastAPI Server]
        Pydantic[Pydantic Models]
    end

    subgraph "Cloud / DB"
        Auth[Supabase Auth]
        DB[(PostgreSQL)]
        Storage[Supabase Storage]
    end

    NextJS -- "REST API (JSON)" --> FastAPI
    FastAPI -- "CRUD / Auth Check" --> DB
    FastAPI -- "Upload / Download" --> Storage
    NextJS -- "Session" --> Auth
```

## 🛠 技術スタック

### 技術選定の理由

- **Next.js (App Router) & TypeScript**: フロントエンドの型安全性を担保しつつ、Server Components を活用した高速なレンダリングを実現するため。
- **Python 3.10+ & FastAPI**: 業務ロジックの核となるバックエンド。将来的な画像解析（OpenCV）や機械学習（サイズ推論）の導入を見据え、エコシステムが豊富な Python を選択。FastAPI の型ヒントを活用し、堅牢な API 開発を実現しています。
- **Drizzle ORM**: Prisma よりも軽量で SQL ライクな記述が可能であり、TypeScript との親和性が極めて高いため。
- **Supabase**: 認証・DB・ストレージを統合管理でき、開発速度とコスト効率を最大化するため。

## ✨ 主な機能と技術的ハイライト

### 1. モバイルファーストなUI/UX

- **Tailwind CSS** を活用したレスポンシブ設計。
- **Framer Motion**（または CSS Animation）による、カードタップ時のシームレスな拡大アニメーション。

### 2. Python/FastAPI による堅牢なバックエンド

- **中央集権的な CRUD 実装**: 全ての DB 操作を FastAPI 経由で行うことで、ビジネスロジックの一貫性とセキュリティを担保。
- **Pydantic による厳密なバリデーション**: Python の型ヒントを最大限活用し、不正なデータ入力を未然に防ぐ設計。
- **非同期 I/O (async/await)**: データベース接続や画像処理を非同期で行うことで、高い同時実行性能を確保。

### 3. クラウドストレージ連携

- **Supabase Storage** を利用した画像管理。
- `python-multipart` を用いた非同期的なバイナリデータ処理の最適化。

### 4. 高度なフィルタリング

- 状態（現役・保管・処分）やサイズに応じた動的なクエリ発行。

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
