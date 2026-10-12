# 第2回：Neon接続とVercel Preview — 確認記録・提出課題

実施日：2026-10-12（日本時間）。教材：20261007 Neon接続とVercel Preview。

## 提出用URL

- GitHub：https://github.com/rusou22/Ai-drive-Project2026
- 接続確認PR：https://github.com/rusou22/Ai-drive-Project2026/pull/1
- 接続確認Preview：https://ai-drive-project2026-navwqc62s-suwa-so-s-projects.vercel.app/
- Production：https://ai-drive-project2026-flax.vercel.app/
- 商品一覧PR：https://github.com/rusou22/Ai-drive-Project2026/pull/2
- 商品一覧Preview：https://ai-drive-project2026-fm2s3dma8-suwa-so-s-projects.vercel.app/
- 本番の接続確認：https://ai-drive-project2026-flax.vercel.app/api/db-check
- 本番の商品一覧：https://ai-drive-project2026-flax.vercel.app/db-sample

PreviewはVercel Authenticationの対象です。閲覧には権限のあるVercelアカウントでのログインが必要です。本番は一般公開しています。

## 接続確認PRの記録

`feature/neon-connection` → `main`。コミット `70f1b37`、マージ `7676784`。
Preview Readyとconnectedを確認してからPR #1をマージし、その後Production Readyと接続成功を確認しました。

| 確認時点 | `/` | `/api/db-check` | `/db-sample` |
| --- | --- | --- | --- |
| ローカル（21:55） | 200、CSS・JS正常 | 200、connected | 未実装 |
| Preview（マージ前、21:58） | 表示・ボタン動作正常 | connected | 未実装 |
| Production（マージ前、21:58） | 200 | 404、未実装 | 404、未実装 |
| Production（マージ後、21:59） | 200 | 200、connected | 404、未実装 |

## 商品一覧PRの記録

PR #1の本番確認後、mainをpullし、別ブランチ `feature/product-list` で作業しました。
SQL Editorで商品を作成してから、一覧ページを実装しました。
コミット `5c3e328` のGitHub連携PreviewがReadyになり、3ページを確認してからPR #2をマージしました（マージ `7005566`）。
マージ後のGitHub連携ProductionはGit情報取得エラーとなったため、マージ済みmainを公式CLIで本番デプロイし、Readyと商品3件を確認しました。

| 確認時点 | `/` | `/api/db-check` | `/db-sample` |
| --- | --- | --- | --- |
| ローカル（22:00） | 200 | 200、connected | 200、商品3件・価格一致 |
| Preview（マージ前、22:03） | 表示・CSS・JS正常 | 200、connected | 商品3件・価格一致 |
| Production（マージ前、22:02） | 200 | 200、connected | 404、ルート未反映 |
| Production（マージ後、22:05） | 200 | 200、connected | 200、商品3件・価格一致 |

マージ後にローカルmainをpullし、`npm run build` → `npm start` でも3ページが200になることを確認しました。

## 実行・設定の記録

- Neon：`webapp-class`、Freeプラン、AWS Singapore、PostgreSQL 18。
- 接続先：Neonブランチ `production`、DB `neondb`、ユーザー `neondb_owner`。
- ローカル：`.env` の `DATABASE_URL` に通常接続URL。
- Vercel：Preview・Productionの両方の `DATABASE_URL` に同じDBのプール接続URLをSecretとして設定。PreviewのGitブランチ制限なし。
- [SQLの実行順序と結果](../sql/README.md)。SQLは手動実行し、デプロイによる自動実行は行っていません。
- `npm run build` 成功。ローカルでトップ・接続確認・商品一覧を確認。接続失敗時の503と商品名のHTMLエスケープも確認。
- `.env`・`.env.*` をGit対象外とし、コミット前にファイル一覧と差分の秘密情報チェックを実施。

## 発生したエラーと解決方法

1. 接続確認ブランチのGitHub連携Previewと、PR #2マージ後のProductionで `Git information retrieval failed for this deployment.` が発生しました。ビルド前のソース取得段階のエラーです。それぞれ同じコミットを公式Vercel CLIからデプロイし、Readyと実動作を確認しました。PR #1後のProductionと商品一覧のPreviewはGitHub連携で自動デプロイできています。連携の一時的な取得失敗自体はアプリコードの修正で解消したものではなく、再発時にはデプロイ状態を確認する必要があります。
2. アプリ内ブラウザーでPreviewのJSON APIを開くと `ERR_BLOCKED_BY_CLIENT` になりました。認証済み公式 `vercel curl` でAPIのconnectedレスポンスを確認しました。ローカルと本番のHTTP確認も成功しています。
3. `pg` が `sslmode=require` の将来バージョンに関する警告を表示しました。現在のpg 8系では証明書検証付きで接続できており、接続エラーではありません。TLS検証を無効化していません。

## 提出課題への回答

### 1. SQLをGitHubに保存することと、SQL Editorで実行することの違い

GitHubへの保存は、SQLファイルの内容と変更履歴を共有・記録する操作です。保存・push・PRのマージだけではNeonのDBは変わりません。SQL Editorで実行すると、選択したNeonブランチ・DBにSQLが適用され、今回はproductsテーブルと商品3件が作られます。実行先・日時・順序・結果を別途記録する必要があります。

### 2. Previewに商品一覧が見えても、マージ前のProductionに見えない理由

PreviewとProductionは別URLで、それぞれ異なるコードを実行しています。マージ前は商品一覧ルート `/db-sample` がPreviewにだけあり、本番にはまだないため、本番は404になります。共有DBに商品がないという意味ではありません。マージ後のProductionデプロイがReadyになると、本番でも一覧を表示できます。

### 3. 今回の商品データは別々か。どの設定で決まるか

今回は共有です。VercelのPreviewとProductionの環境変数 `DATABASE_URL` が、同じNeonブランチ `production` とDB `neondb` を指しているためです。コードのデプロイ先が異なるだけではDBは分かれません。環境ごとに別のNeonブランチ・DBへの接続先を設定すれば、データを分けられます。

## 第3回へ進むための確認

- 接続確認PR #1：マージ済み。
- `/api/db-check`：ローカル・Preview・Productionでconnected。
- `sql/000_check_connection.sql`・`sql/README.md`：Git管理済み、実行先と結果を記録済み。
- `.env`と接続文字列：GitHubに含めていません。
- 商品一覧の演習PR #2：マージ済み。本番の商品3件まで確認済み。
- SQLの保存と実行、PreviewとProductionのコードの違い、DB共有の理由：上記3問に回答済み。

マージ後の確認結果を確定するため、最後に記録のみのコミットをmainへ追加しています。
