# TODO V1 テスト結果

設計のコミット：`f47d3fa`（feature/todo）。これを引き継いだ `feature/todo-app` で実装・検証した。Neon は webapp-class / production / neondb。3環境は同じ表を参照する。各確認で作った架空の行だけを更新・削除し、既存データの初期化はしていない。

| チェック | Local | Preview | Production |
| --- | --- | --- | --- |
| REQ-01 GET 200、ID順・0件の空配列と画面表示 | 合格 | 合格 | 合格 |
| REQ-02 POST 201、空白除去・採番・未完了。JSON不正／欠落／型違い400、空白／101文字422 | 合格 | 合格 | 合格 |
| REQ-03 PATCH 200、true・false、タイトルと作成日時の保持。型違い・空本文400、未発見404 | 合格 | 合格 | 合格 |
| REQ-04 DELETE 204・本文なし。再削除404、ID 0は400 | 合格 | 合格 | 合格 |
| /todo の画面から追加・チェック・再読込後の保持・削除・0件表示 | 合格 | 合格 | 合格 |
| 既存 /・/api/db-check・/db-sample | 合格 | 合格 | 合格 |

Local：http://localhost:3000/todo 、2026-11-04 13:38 JST。npm ci・ビルド・ビルド済みExpress起動成功。API試験開始時0件、作成したID 1を削除。一覧の再取得でも削除を確認した。CSSとEJSは既存のpublic・views設定で配信する。


## Preview・Productionの実績

- [PR #3](https://github.com/rusou22/Ai-drive-Project2026/pull/3)：実装コミット `76c3c51`、マージ `021671d`。リポジトリは [rusou22/Ai-drive-Project2026](https://github.com/rusou22/Ai-drive-Project2026)。
- [Previewの画面](https://ai-drive-project2026-h4wgig7cg-suwa-so-s-projects.vercel.app/todo)：2026-11-04 13:39〜13:41 JST。feature/todo-app のGit連携デプロイがReady。認証済みのVercel CLIでAPIを、ブラウザーで画面を確認した。初回0件、API試験で自分が作ったID 3を削除した。
- [Productionの画面](https://ai-drive-project2026-flax.vercel.app/todo)：2026-11-04 13:41〜13:42 JST。マージ前は404、mainの自動デプロイがReadyになった後は200。公開URLで上表の全項目を確認。初回0件、API試験で作ったID 5を削除した。
- 全環境でUI操作用の架空タスクも作成し、完了のチェックがページ再読込後も保持されることと、削除後の空表示を確認した。Localでは追加でタイトル100文字が201、同時に存在する2件がID昇順になることも検証した。

## 障害試験と実装上の確認

ローカルの隔離プロセスで到達不能の接続先を与え、503 DB_UNAVAILABLEを確認した。Modelのクエリ例外を模擬した場合は500 INTERNAL_ERROR。どちらも統一エラーJSONでSQLや接続情報を返さない。共有環境では障害を意図的に発生させていない。

画面と静的ファイルのディレクトリがともに /todo を使うため、静的配信のディレクトリリダイレクトを無効にした。ビルド後と公開後に /todo は200、画面操作は成功。Previewのチェック操作では更新リクエスト中の瞬間的な状態を検査せず、再取得と再読込後の状態で判定した。V1の共通仕様に対する既知の未解決事項なし。
