import { pool } from '../../../db';

export interface Todo { id: number; title: string; isCompleted: boolean; createdAt: Date; }
const columns = 'id, title, is_completed AS "isCompleted", created_at AS "createdAt"';

export const todoModel = {
  async list() {
    return (await pool.query<Todo>('SELECT ' + columns + ' FROM public.todo_tasks ORDER BY id')).rows;
  },
  async create(title: string) {
    return (await pool.query<Todo>('INSERT INTO public.todo_tasks (title) VALUES ($1) RETURNING ' + columns, [title])).rows[0];
  },
  async update(id: number, completed: boolean) {
    return (await pool.query<Todo>('UPDATE public.todo_tasks SET is_completed = $2 WHERE id = $1 RETURNING ' + columns, [id, completed])).rows[0];
  },
  async remove(id: number) {
    return (await pool.query('DELETE FROM public.todo_tasks WHERE id = $1', [id])).rowCount === 1;
  }
};
