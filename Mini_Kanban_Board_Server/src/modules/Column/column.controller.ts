import { Request, Response } from 'express';
import { catchAsync } from '../../shared/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ColumnService } from './column.service';
import AppError from '../../errors/AppError';

const createColumn = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) throw new AppError(401, 'Unauthorized');

    const boardId = req.params.boardId as string;
    
    const result = await ColumnService.createColumn(userId, boardId, req.body);
    
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Column created successfully',
        data: result,
    });
});

const renameColumn = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) throw new AppError(401, 'Unauthorized');

    const columnId = req.params.columnId as string;
    
    const result = await ColumnService.renameColumn(userId, columnId, req.body);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Column renamed successfully',
        data: result,
    });
});

const deleteColumn = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) throw new AppError(401, 'Unauthorized');

    const columnId = req.params.columnId as string;
    
    await ColumnService.deleteColumn(userId, columnId);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Column deleted successfully',
    });
});

const reorderColumn = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) throw new AppError(401, 'Unauthorized');

    const columnId = req.params.columnId as string;
    const { position } = req.body;
    
    await ColumnService.reorderColumn(userId, columnId, position);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Column reordered successfully',
    });
});

export const ColumnController = {
    createColumn,
    renameColumn,
    deleteColumn,
    reorderColumn
};
