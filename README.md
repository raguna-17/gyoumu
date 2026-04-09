1. Django版：社内ダッシュボード／業務管理アプリ

特徴

管理画面でチームのタスク・進捗・ファイルを一括管理
ユーザー権限や役割ごとのアクセス制御あり
完全APIなら Django REST Framework + ViewSet（特にModelViewSet）ベース

users（認証）
tasks（メイン機能）
dashboard（付加価値）
files（オプション）

users 作る
usersのAPIテスト軽く確認 → テストコード書く
tasks 作る
tasksも同じようにテスト → テストコード
dashboard
files

企業ウケポイント

CRUDだけじゃなく、権限管理・管理画面・データ可視化で設計力が見える
renderを組み合わせるとインフラスキルもアピール可能
実務でよく使う「業務管理系アプリ」を作れる