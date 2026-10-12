# Ai-drive-Project2026

授業用の Express + TypeScript + EJS サイトです。

## 公開サイト

https://ai-drive-project2026-flax.vercel.app/

「クリック」ボタンを押すと「JavaScriptが動作しました！」と表示されます。

## 使用技術

Node.js 24、Express、TypeScript、EJS、HTML / CSS / JavaScript、Vercel Hobby

Neon（PostgreSQL）をデータベースとして利用し、`pg` の接続プールで接続します。

## ローカルで実行

```sh
npm install
```

プロジェクト直下の `.env` に、環境変数 `DATABASE_URL` を設定します。
値にはNeonのConnect画面で取得した通常の接続URLを使います。
接続文字列にはパスワードが含まれるため、GitHub・README・スクリーンショットには記載しません。

```sh
npm run dev
```

http://localhost:3000/ を開きます。

ビルド後の実行も確認できます。

```sh
npm run build
npm start
```

Windows PowerShell で npm.ps1 の実行が制限されている場合は、`npm` を `npm.cmd` に置き換えて実行してください。

## 公開と更新

Vercel の Root Directory はプロジェクト直下、Framework Preset は Express です。
PreviewとProductionの両方に環境変数 `DATABASE_URL` を登録します。
Vercelでは同じNeonブランチ・DBのプール接続URLを使用します。
値の追加・変更は、その後に作成したデプロイで確認します。

変更は機能ブランチで作成し、push後のPreviewで確認してからPull Requestをmainへマージします。mainへの反映でVercelが本番を自動デプロイします。

`node_modules`、`dist`、`.env`、ローカルの作業記録は Git の管理対象から除外しています。

## ファイル構成

- `index.ts`：Express の設定と TOP ページのルーティング
- `db.ts`：Neonへの接続プール（最大2接続）
- `views/index.ejs`：TOP ページの HTML
- `public/css/style.css`：ページの見た目
- `public/js/script.js`：ボタンクリック時のメッセージ表示
- `tsconfig.json`：TypeScript のビルド設定

公開後は TOP ページの表示、CSS の適用、ボタンのメッセージ表示を確認します。

## DB接続確認

`GET /api/db-check` は `SELECT 1 AS connection_test` を実行します。
成功時は `{"status":"ok","database":"connected"}` を返します。
接続失敗時はHTTP 503と `{"status":"error","database":"unavailable"}` を返し、接続文字列や詳細をブラウザーへ返しません。

`sql/000_check_connection.sql` は接続先のDB・ユーザー、接続成功、DBサーバー日時を確認する読み取り専用SQLです。
NeonのSQL Editorで手動実行し、[SQLの実行記録](sql/README.md)に結果を残します。

## PreviewとProduction

機能ブランチをpushするとPreviewが作成されます。Previewの `/` と `/api/db-check` を確認してから、Pull Requestをmainへマージします。
mainのProduction DeploymentがReadyになった後、本番でも確認します。
PreviewとProductionは別URL・別のコードですが、今回の `DATABASE_URL` は同じNeonブランチ・DBを指すため、DBデータは共有します。
