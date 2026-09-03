import { Request, Response } from 'express';
import { catchAsync } from '../../shared/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BoardService } from './board.service';
import AppError from '../../errors/AppError';

const createBoard = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
        throw new AppError(401, 'Unauthorized');
    }

    const result = await BoardService.createBoard(userId, req.body);
    
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Board created successfully',
        data: result,
    });
});

const getAllAccessibleBoards = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
        throw new AppError(401, 'Unauthorized');
    }

    const result = await BoardService.getAllAccessibleBoards(userId);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Boards retrieved successfully',
        data: result,
    });
});

const getSingleBoard = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
        throw new AppError(401, 'Unauthorized');
    }

    const boardId = req.params.boardId as string;
    const result = await BoardService.getSingleBoard(userId, boardId);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Board retrieved successfully',
        data: result,
    });
});

const updateBoard = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
        throw new AppError(401, 'Unauthorized');
    }

    const boardId = req.params.boardId as string;
    const result = await BoardService.updateBoard(userId, boardId, req.body);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Board updated successfully',
        data: result,
    });
});

const deleteBoard = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
        throw new AppError(401, 'Unauthorized');
    }

    const boardId = req.params.boardId as string;
    await BoardService.deleteBoard(userId, boardId);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Board deleted successfully',
    });
});

export const BoardController = {
    createBoard,
    getAllAccessibleBoards,
    getSingleBoard,
    updateBoard,
    deleteBoard
};
