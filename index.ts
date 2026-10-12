import express, { Request, Response } from 'express';
import path from 'path';

const app = express();
const port: number = Number(process.env.PORT) || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

app.get('/', (_req: Request, res: Response): void => {
  res.render('index');
});

app.listen(port, (): void => {
  console.log(`Server started: http://localhost:${port}`);
});
