# TODO V1 テスト結果

設計のコミット：`f47d3fa`（feature/todo）。これを引き継いだ `feature/todo-app` で実装・検証する。Neon は webapp-class / production / neondb。3環境は同じ表を参照する。各確認で作った架空の行だけを更新・削除し、既存データの初期化はしていない。

| チェック | Local | Preview | Production |
| --- | --- | --- | --- |
| REQ-01 GET 200、ID順・0件の空配列と画面表示 | 合格 | 未実施 | 未実施 |
| REQ-02 POST 201、空白除去・採番・未完了。JSON不正／欠落／型違い400、空白／101文字422 | 合格 | 未実施 | 未実施 |
| REQ-03 PATCH 200、true・false、タイトルと作成日時の保持。型違い・空本文400、未発見404 | 合格 | 未実施 | 未実施 |
| REQ-04 DELETE 204・本文なし。再削除404、ID 0は400 | 合格 | 未実施 | 未実施 |
| /todo の画面から追加・チェック・再読込後の保持・削除・0件表示 | 合格 | 未実施 | 未実施 |
| 既存 /・/api/db-check・/db-sample | 合格 | 未実施 | 未実施 |

Local：http://localhost:3000/todo 、2026-11-04 13:38 JST。npm ci・ビルド・ビルド済みExpress起動成功。API試験開始時0件、作成したID 1を削除。一覧の再取得でも削除を確認した。CSSとEJSは既存のpublic・views設定で配信する。
