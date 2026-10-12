# Ai-drive-Project2026

授業用の Express + TypeScript + EJS サイトです。

## 公開サイト

https://ai-drive-project2026-flax.vercel.app/

「クリック」ボタンを押すと「JavaScriptが動作しました！」と表示されます。

## 使用技術

Node.js 24、Express、TypeScript、EJS、HTML / CSS / JavaScript、Vercel Hobby

## ローカルで実行

```sh
npm install
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

Vercel でこの GitHub リポジトリをインポートします。Root Directory はプロジェクト直下、Framework Preset は Express を使用し、環境変数は不要です。

変更をローカルで確認し、コミットして main にプッシュすると、Vercel が自動デプロイします。

`node_modules`、`dist`、`.env`、ローカルの作業記録は Git の管理対象から除外しています。

## ファイル構成

- `index.ts`：Express の設定と TOP ページのルーティング
- `views/index.ejs`：TOP ページの HTML
- `public/css/style.css`：ページの見た目
- `public/js/script.js`：ボタンクリック時のメッセージ表示
- `tsconfig.json`：TypeScript のビルド設定

公開後は TOP ページの表示、CSS の適用、ボタンのメッセージ表示を確認します。
