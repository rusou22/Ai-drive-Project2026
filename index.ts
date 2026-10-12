import express, { Request, Response } from 'express';
import path from 'path';
import { pool, logDatabaseError } from './db';

const app = express();
const port: number = Number(process.env.PORT) || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

app.get('/', (_req: Request, res: Response): void => {
  res.render('index');
});

app.get('/api/db-check', async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query<{ connection_test: number }>(
      'SELECT 1 AS connection_test'
    );
    if (result.rows[0]?.connection_test !== 1) {
      res.status(503).json({ status: 'error', database: 'unavailable' });
      return;
    }
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    logDatabaseError('DB接続確認に失敗しました', error);
    res.status(503).json({ status: 'error', database: 'unavailable' });
  }
});

type Product = { id: number; name: string; price: number };

app.get('/db-sample', async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query<Product>(
      'SELECT id, name, price FROM products ORDER BY id'
    );
    res.render('db-sample', { products: result.rows });
  } catch (error) {
    logDatabaseError('商品一覧の取得に失敗しました', error);
    res.status(503).send('商品一覧を表示できません');
  }
});

app.listen(port, (): void => {
  console.log(`Server started: http://localhost:${port}`);
});
