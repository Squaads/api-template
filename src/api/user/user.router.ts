import { Router } from 'express';
import UserController from './user.controller';

const usersRouter = Router();
const userController = new UserController();

usersRouter.get('/', (req, res) => userController.getAll(req, res));
usersRouter.get('/:id', (req, res) => userController.getById(req, res));
usersRouter.post('/create', (req, res) => userController.create(req, res));
usersRouter.patch('/:id', (req, res) => userController.update(req, res));
usersRouter.delete('/:id', (req, res) => userController.delete(req, res));

export default usersRouter;
