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

上記2件は読み取り専用で、データの変更はありません。

## 商品一覧の演習

`010_setup_sample_products.sql` は商品テーブルを作成し、商品3件を登録して結果を確認します。
同じIDは二重登録せず、既存データも上書きしません。アプリからの商品取得は読み取り専用です。
接続確認PR #1のマージと本番接続確認後、同じNeonブランチ `production`・DB `neondb` のSQL Editorで実行しました。
実行前に `products` テーブルが存在しないことを確認しています。

| 順序 | 実行日時（日本時間） | 実行したSQL | 結果 |
| --- | --- | --- | --- |
| 3 | 2026-10-12 22:00 | `SELECT 1 AS connection_test;` | SQL Editorで `connection_test = 1` |
| 4 | 2026-10-12 22:00 | `010_setup_sample_products.sql` | CREATE成功、INSERT 3、SELECT 3。ノート200円、ペン120円、消しゴム80円を確認 |

商品データは順序4の実行時点で共有DBに反映済みです。商品一覧のPRをマージした時点で作られたものではありません。
