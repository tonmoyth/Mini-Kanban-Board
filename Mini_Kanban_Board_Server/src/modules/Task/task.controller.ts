import { Request, Response } from 'express';
import { catchAsync } from '../../shared/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TaskService } from './task.service';
import AppError from '../../errors/AppError';

const createTask = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) throw new AppError(401, 'Unauthorized');

    const columnId = req.params.columnId as string;
    
    const result = await TaskService.createTask(userId, columnId, req.body);
    
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Task created successfully',
        data: result,
    });
});

const getTasks = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) throw new AppError(401, 'Unauthorized');

    const columnId = req.params.columnId as string;
    
    const result = await TaskService.getTasks(userId, columnId);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tasks retrieved successfully',
        data: result,
    });
});

const getSingleTask = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) throw new AppError(401, 'Unauthorized');

    const taskId = req.params.taskId as string;
    
    const result = await TaskService.getSingleTask(userId, taskId);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Task retrieved successfully',
        data: result,
    });
});

const updateTask = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) throw new AppError(401, 'Unauthorized');

    const taskId = req.params.taskId as string;
    
    const result = await TaskService.updateTask(userId, taskId, req.body);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Task updated successfully',
        data: result,
    });
});

const deleteTask = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) throw new AppError(401, 'Unauthorized');

    const taskId = req.params.taskId as string;
    
    await TaskService.deleteTask(userId, taskId);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Task deleted successfully',
    });
});

const moveTask = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) throw new AppError(401, 'Unauthorized');

    const taskId = req.params.taskId as string;
    const { targetColumnId, position } = req.body;
    
    await TaskService.moveTask(userId, taskId, targetColumnId, position);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Task moved successfully',
    });
});

export const TaskController = {
    createTask,
    getTasks,
    getSingleTask,
    updateTask,
    deleteTask,
    moveTask
};
