import 'dotenv/config';
import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URLが設定されていません');
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 2,
  connectionTimeoutMillis: 10_000,
  idleTimeoutMillis: 30_000,
});

// 接続文字列やエラー詳細をログへ出さず、診断に必要なコードだけを記録する。
export function logDatabaseError(message: string, error: unknown): void {
  const code = error && typeof error === 'object' && 'code' in error
    ? String(error.code)
    : 'UNKNOWN';
  console.error(message, { code: /^[A-Z0-9_]+$/.test(code) ? code : 'UNKNOWN' });
}

pool.on('error', (error) => {
  logDatabaseError('待機中のDB接続でエラーが発生しました', error);
});
