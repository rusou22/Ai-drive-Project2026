# TODO V1 設計書

画面は `GET /todo` から `views/todo/index.ejs` を表示する。一覧・フォーム・完了チェック・削除ボタンを用意し、通信は静的ファイル `public/todo/todo.js` の TodoApi に集める。既存の `index.ts` の EJS・public 設定と `db.ts` の Pool を再利用する。

要求経路：画面 → Fetch → `index.ts` のJSON解析 → `/api/v1/todos` の `todoRouter.ts` → `todoController.ts`（入力・応答）→ `todoModel.ts`（SQL）→ Neon。3つのTSファイルは `src/apps/todo/` に置く。既存ルート・listenは維持する。

| REQ | メソッド・パス（基点 /api/v1/todos） | 本文 | 成功／失敗 | Model・画面の対応と試験 |
| --- | --- | --- | --- | --- |
| 01 | GET 基点 | なし | 200 data: 配列／500・503 | SELECT、ORDER BY id ASC。list() → 空表示と登録後の一覧を比較。 |
| 02 | POST 基点 | {"title":"例題"} | 201 data: 1件／400・422・500・503 | INSERT ... RETURNING。create(title) → 空白除去、ID・初期値falseを確認。 |
| 03 | PATCH /:id | {"isCompleted":true} | 200 data: 1件／400・404・500・503 | ID条件付きUPDATE ... RETURNING。update(id,isCompleted) → 対象のみ切替。 |
| 04 | DELETE /:id | なし | 204 本文なし／400・404・500・503 | ID条件付きDELETE、件数で未発見を判定。delete(id) → 一覧から消え、再削除404。 |

**DBとJSON。** `todo_tasks` の列は、自動採番の整数主キー `id`、必須TEXT `title`、必須BOOLEAN `is_completed`（初期false）、必須TIMESTAMPTZ `created_at`（初期NOW()）。タイトルはtrim後1〜100文字をアプリで検証し、DBにもCHECKを置く。値はSQLプレースホルダーで渡す。JSONでは後ろ2列を `isCompleted` と `createdAt` に変換する。例：`{"status":"success","data":{"id":1,"title":"例題","isCompleted":false,"createdAt":"2026-10-28T06:00:00.000Z"}}`。GETは同じ形の配列。

**エラー。** 不正JSON・必須項目の欠落・型やID形式の不正は400 BAD_REQUEST、タイトル長違反は422 VALIDATION_ERROR、未発見は404 NOT_FOUND。SQLや内部処理の異常は500 INTERNAL_ERROR、DBへの接続障害は503 DB_UNAVAILABLE。共通形は `{"status":"error","code":"NOT_FOUND","message":"TODOが見つかりません","details":[]}`。JSON解析エラーもこの形式に変換する。サーバーには診断用コードのみを記録する。

**画面。** TodoApiはres.okを確認し、204ではJSONを読まない。更新成功後は一覧を取り直す。タイトルにはtextContentを使い、リクエスト中は二重操作を防ぐ。取得失敗を「0件」として扱わない。
