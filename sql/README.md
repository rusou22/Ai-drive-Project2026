# SQLの目的と実行記録

`000_check_connection.sql` は接続先を確かめるための読み取り専用SQLです。
NeonのSQL Editorで実行します。テーブルやデータは変更しません。

実行前に、アプリの接続先と同じNeonブランチ・データベースであることを確認します。
SQLファイルをGitHubへ保存したり、Vercelへデプロイしたりしても、SQLは自動実行されません。
接続文字列・パスワードは、このファイルにもSQLファイルにも記載しません。

## 実行記録

実行先はNeonプロジェクト `webapp-class`（Free、Singapore）、ブランチ `production`、DB `neondb`、ユーザー `neondb_owner` です。

| 順序 | 実行日時（日本時間） | 実行したSQL | 結果 |
| --- | --- | --- | --- |
| 1 | 2026-10-12 21:55 | `SELECT 1 AS connection_test;` | SQL Editorで `connection_test = 1` |
| 2 | 2026-10-12 21:55 | `000_check_connection.sql` | SQL EditorでDB=`neondb`、ユーザー=`neondb_owner`、`connection_test = 1`、DB日時=`2026-10-12 12:55:53.770787+00`（UTC） |

どちらも読み取り専用で、データの変更はありません。
