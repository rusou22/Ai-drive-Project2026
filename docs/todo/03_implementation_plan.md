# TODO V1 実装手順書

作業場所は既存リポジトリ。Node.js 24・Express 5・TypeScript・EJS・pgを使用し、追加のランタイム依存は不要。最初に `git status -sb` と `git remote -v` で、自分のリポジトリの `feature/todo` にいることを確認する。設計3文書を先にコミット・pushする。

| 順 | 対象・作業 | 確認方法と期待結果 | 失敗時の確認先 |
| --- | --- | --- | --- |
| 1 | sql/todo/020_create_todo_tasks.sql にDDLを保存 | 列・初期値・CHECKを設計書と照合。Gitへの保存はDBを変えない | 対象テーブル名・列名 |
| 2 | Neon SQL Editorで同じブランチ・DBに手動実行 | 既存の同名表の有無を先に確認。SELECTで件数・列を確認しsql/README.mdに記録 | 接続先。異なる既存表は消さない |
| 3 | Model・Controller・Routerとindex.tsを接続。REQ-01 | npm run build → npm run dev。GETが200、dataがID昇順の配列 | import、tsconfig、DB接続 |
| 4 | REQ-02 INSERTと本文検証 | JSONでPOSTし201、GETで永続化。欠落400・空白422 | JSON解析、trim、SQL引数 |
| 5 | REQ-03 ID条件付きUPDATE | 作成したIDへPATCHし200。別ID・タイトルが変わらない | WHERE・RETURNINGと型 |
| 6 | REQ-04 ID条件付きDELETE | 作成したIDを削除し204・本文なし。再削除404 | rowCount、204の処理 |
| 7 | public/todo/todo.jsのTodoApi・views/todo/index.ejs | /todoで追加→完了→削除。Networkと表示が一致、空表示を確認 | fetchのURL・JSON・204分岐 |
| 8 | ローカルのビルド済みアプリ | npm run build → npm start。異常系と既存 /、/api/db-check、/db-sample も確認 | dist・views・publicの配置 |
| 9 | 自分のfeature/todoをpush | Preview Ready後、同じCRUD・異常系・画面を検証 | ソースブランチ、Vercel環境変数、ログ |
| 10 | feature/todo → main のPR | 差分に秘密情報がないこと、試験結果・Preview URLを確認しマージ | 差分、必須試験の失敗 |
| 11 | Production Ready後に再試験 | 本番URLで同じ試験を行い、docs/todo/04_test_results.mdにURL・日時・結果・失敗と対処を記録 | mainのコミット・デプロイ・接続先 |

共有DBを初期化しない。環境ごとに別の架空タイトルを用い、返されたIDだけを更新・削除する。0件でない場合は既存件数と未実施理由を記録する。DB障害はローカルの隔離したプロセスで再現し、公開環境の接続設定は変更しない。
