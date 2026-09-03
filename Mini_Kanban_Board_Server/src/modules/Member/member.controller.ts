import { Request, Response } from 'express';
import { catchAsync } from '../../shared/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { MemberService } from './member.service';
import AppError from '../../errors/AppError';

const addMember = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
        throw new AppError(401, 'Unauthorized');
    }

    const boardId = req.params.boardId as string;
    
    const result = await MemberService.addMember(userId, boardId, req.body);
    
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Member added successfully',
        data: result,
    });
});

const getMembers = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
        throw new AppError(401, 'Unauthorized');
    }

    const boardId = req.params.boardId as string;
    
    const result = await MemberService.getMembers(userId, boardId);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Members retrieved successfully',
        data: result,
    });
});

const removeMember = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
        throw new AppError(401, 'Unauthorized');
    }

    const boardId = req.params.boardId as string;
    const targetUserId = req.params.userId as string;
    
    await MemberService.removeMember(userId, boardId, targetUserId);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Member removed successfully',
    });
});

export const MemberController = {
    addMember,
    getMembers,
    removeMember,
};
