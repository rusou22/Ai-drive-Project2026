import express from 'express';
import { apiError, list, create, update, remove } from './todoController';

export const todoRouter = express.Router();
todoRouter.use((_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
todoRouter.use(express.json());
todoRouter.get('/', list);
todoRouter.post('/', create);
todoRouter.patch('/:id', update);
todoRouter.delete('/:id', remove);
todoRouter.use(apiError);
