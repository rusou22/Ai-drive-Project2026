import { Request, Response, ErrorRequestHandler } from 'express';
import { logDatabaseError } from '../../../db';
import { todoModel } from './todoModel';

function fail(res: Response, status: number, code: string, message: string) {
  res.status(status).json({ status: 'error', code, message, details: [] });
}
function missing(res: Response) { fail(res, 404, 'NOT_FOUND', 'TODOが見つかりません'); }
function readId(req: Request, res: Response): number | undefined {
  const raw = req.params.id;
  if (typeof raw !== 'string' || !/^[0-9]+$/.test(raw) || Number(raw) < 1) {
    fail(res, 400, 'BAD_REQUEST', 'IDは1以上の整数で指定してください');
    return;
  }
  if (Number(raw) > 2147483647) { missing(res); return; }
  return Number(raw);
}

export async function list(_req: Request, res: Response) {
  res.json({ status: 'success', data: await todoModel.list() });
}
export async function create(req: Request, res: Response) {
  if (typeof req.body?.title !== 'string') return fail(res, 400, 'BAD_REQUEST', 'titleに文字列を指定してください');
  const title = req.body.title.trim();
  if (title.includes('\0')) return fail(res, 400, 'BAD_REQUEST', 'タイトルに使用できない文字があります');
  if (!title || [...title].length > 100) return fail(res, 422, 'VALIDATION_ERROR', 'タイトルは1〜100文字で入力してください');
  res.status(201).json({ status: 'success', data: await todoModel.create(title) });
}
export async function update(req: Request, res: Response) {
  const id = readId(req, res);
  if (id === undefined) return;
  if (typeof req.body?.isCompleted !== 'boolean' || Object.keys(req.body).length !== 1)
    return fail(res, 400, 'BAD_REQUEST', 'isCompletedに真偽値だけを指定してください');
  const data = await todoModel.update(id, req.body.isCompleted);
  if (!data) return missing(res);
  res.json({ status: 'success', data });
}
export async function remove(req: Request, res: Response) {
  const id = readId(req, res);
  if (id === undefined) return;
  if (!await todoModel.remove(id)) return missing(res);
  res.status(204).end();
}

// Express 5 は async ハンドラーの例外もここに渡す。
export const apiError: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) return next(err);
  if (err.type === 'entity.parse.failed' || err.type === 'entity.too.large' || err.type === 'charset.unsupported' || err.type === 'encoding.unsupported')
    return fail(res, 400, 'BAD_REQUEST', '送信したJSONを確認してください');
  logDatabaseError('TODO APIの処理に失敗しました', err);
  const down = /^(08|ECONN|ETIMEDOUT|EAI_AGAIN|ENOTFOUND|ENETUNREACH|EHOSTUNREACH|57P0[123]|53300|28P01)/.test(String(err.code ?? '')) ||
    /connection terminated|connection timeout|timeout exceeded when trying to connect/i.test(String(err.message ?? ''));
  if (down) return fail(res, 503, 'DB_UNAVAILABLE', 'データベースに接続できません');
  fail(res, 500, 'INTERNAL_ERROR', 'TODOを処理できませんでした');
};
