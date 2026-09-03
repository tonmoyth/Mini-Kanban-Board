import express from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import validateRequest from '../../middlewares/validateRequest';
import { TaskValidation } from './task.validation';
import { TaskController } from './task.controller';

export const columnTaskRoutes = express.Router({ mergeParams: true });

columnTaskRoutes.post(
    '/',
    checkAuth(),
    validateRequest(TaskValidation.createTaskValidation),
    TaskController.createTask
);

columnTaskRoutes.get(
    '/',
    checkAuth(),
    TaskController.getTasks
);

export const taskRoutes = express.Router();

taskRoutes.get(
    '/:taskId',
    checkAuth(),
    TaskController.getSingleTask
);

taskRoutes.patch(
    '/:taskId',
    checkAuth(),
    validateRequest(TaskValidation.updateTaskValidation),
    TaskController.updateTask
);

taskRoutes.delete(
    '/:taskId',
    checkAuth(),
    TaskController.deleteTask
);

taskRoutes.patch(
    '/:taskId/move',
    checkAuth(),
    validateRequest(TaskValidation.moveTaskValidation),
    TaskController.moveTask
);
