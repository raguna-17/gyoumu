本システムでは、DjangoのカスタムUserモデルを採用し、emailをログインIDとした認証基盤を実装しています。

ユーザー登録は専用APIから行い、emailとpasswordを必須としています。
emailは正規化して重複登録を防止し、passwordは必ずハッシュ化して保存することでセキュリティを確保しています。

ユーザー作成は直接モデル操作せず、UserManagerを経由することで作成ルールを統一し、不正なユーザー生成を防ぐ設計にしています。

また、ユーザー情報の取得は読み取り専用として分離しており、登録用と取得用でSerializerを分けることで責務を明確化しています。

認証方式はemailベースで統一し、Django標準のusernameは使用していません。

全体として、認証・データ生成・表示の責務を分離した、安全性と拡張性を意識したユーザー管理設計になっています。
本システムのタスク機能は、プロジェクト単位でタスクを管理する構造になっており、各タスクは必ず特定のプロジェクトに属する階層型データとして設計されています。

タスクは「作成」「閲覧」「更新」「削除」の基本CRUD操作を持ちますが、すべての操作は認証済みユーザーに限定され、さらにプロジェクト所有者単位でアクセス制御が行われています。
本プロジェクトは、Django REST Frameworkを用いたJWT認証ベースのAPIサーバーであり、ユーザー・タスク・管理画面のドメイン分離を行ったマルチアプリ構成です。環境変数による設定分離とCORS制御により、フロントエンド分離構成（SPA）と本番デプロイ（Render/PostgreSQL）に対応しています。


# Task Management App

## Overview

タスク・プロジェクトを管理するWebアプリケーションです。
JWT認証を用いたAPIと、Reactによるフロントエンドを分離した構成になっています。

* ユーザー認証（JWT）
* プロジェクト管理
* タスクCRUD
* 担当者・進捗管理

---

https://gyoumu-bakku.onrender.com
https://gyoumu-furonto.onrender.com

## Tech Stack

### Backend

* Python / Django
* Django REST Framework
* JWT認証（SimpleJWT）
* PostgreSQL
* Docker

### Frontend

* React（Vite）
* Axios
* Custom Hooks（ロジック分離）

---

## Architecture

### Backend構成

* app単位で責務分離（users / tasks / dashboard）
* DRFのViewSet + SerializerでAPI設計
* JWTによる認証必須（全API）

### Frontend構成

* featureベース構成
* API層 / Hooks / UI を分離

```
features/
  tasks/
    api/        ← API通信
    useTasks.js ← 状態管理・ロジック
    components/ ← UI
```

---

## Key Implementation

### Backend

#### データモデル

* Project と Task を1対多で管理
* Taskに進捗・担当者・期限を保持

#### API設計

* ViewSetでCRUDを統一
* 認証済ユーザーのみアクセス可能

#### Serializer

* ネスト構造でProject情報を含めて返却
* 書き込み時は `project_id` を使用

---

### Frontend

#### API層

Axios + JWTで認証付き通信

* GET /tasks/
* POST /tasks/
* PATCH /tasks/:id/
* DELETE /tasks/:id/

#### カスタムHook（useTasks）

* タスク状態管理
* 入力バリデーション
* API呼び出し集約

例：

* 進捗（0〜100）バリデーション
* ユーザーID検証
* optimistic update

👉 UIとロジックを分離し、再利用性を確保

---

## Features

* タスク一覧取得
* タスク作成
* タスク更新（進捗・ステータス・担当者）
* タスク削除
* 入力バリデーション

---

## Testing

### Backend

* pytest使用
* 各app単位でテスト実装

### Frontend

* Vitest使用
* API層・Hooksを中心にテスト
* カバレッジ測定対応

---

## Setup

### Backend

```bash
cd backend
docker-compose up --build
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

### Backend

* DJANGO_SECRET_KEY
* DJANGO_DEBUG
* DATABASE_URL

### Frontend

* VITE_API_URL

---

## Notes

* 認証はJWTベース
* APIはすべて認証必須
* CORSは開発用に全許可

---

## Future Improvements

* 権限管理（管理者制御）
* UIテスト追加
* フィルタ・検索機能
* パフォーマンス最適化
