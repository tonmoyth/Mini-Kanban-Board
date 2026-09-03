import { prisma } from '../../lib/prisma';
import AppError from '../../errors/AppError';

const createBoard = async (userId: string, payload: { name: string }) => {
    const { name } = payload;
    
    // Create board and default columns atomically
    const result = await prisma.board.create({
        data: {
            name,
            ownerId: userId,
            columns: {
                create: [
                    { name: 'TODO', position: 0 },
                    { name: 'IN PROGRESS', position: 1 },
                    { name: 'DONE', position: 2 },
                ]
            }
        },
        include: {
            columns: {
                orderBy: {
                    position: 'asc'
                }
            }
        }
    });

    return result;
};

const getAllAccessibleBoards = async (userId: string) => {
    // Return all boards where the authenticated user is either owner or member
    const boards = await prisma.board.findMany({
        where: {
            OR: [
                { ownerId: userId },
                { members: { some: { userId } } }
            ]
        },
        select: {
            id: true,
            name: true,
            ownerId: true,
            createdAt: true,
            updatedAt: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return boards;
};

const getSingleBoard = async (userId: string, boardId: string) => {
    const board = await prisma.board.findUnique({
        where: { id: boardId },
        include: {
            columns: {
                orderBy: { position: 'asc' },
                include: {
                    tasks: {
                        orderBy: { position: 'asc' }
                    }
                }
            },
            members: {
                select: {
                    userId: true
                }
            }
        }
    });

    if (!board) {
        throw new AppError(404, 'Board not found');
    }

    const hasAccess = board.ownerId === userId || board.members.some(member => member.userId === userId);

    if (!hasAccess) {
        throw new AppError(403, 'Forbidden access to this board');
    }
    
    const { members, ...boardData } = board;

    return boardData;
};

const updateBoard = async (userId: string, boardId: string, payload: { name: string }) => {
    const board = await prisma.board.findUnique({
        where: { id: boardId }
    });

    if (!board) {
        throw new AppError(404, 'Board not found');
    }

    if (board.ownerId !== userId) {
        throw new AppError(403, 'Forbidden: Only the board owner can update the board');
    }

    const updatedBoard = await prisma.board.update({
        where: { id: boardId },
        data: { name: payload.name }
    });

    return updatedBoard;
};

const deleteBoard = async (userId: string, boardId: string) => {
    const board = await prisma.board.findUnique({
        where: { id: boardId }
    });

    if (!board) {
        throw new AppError(404, 'Board not found');
    }

    if (board.ownerId !== userId) {
        throw new AppError(403, 'Forbidden: Only the board owner can delete the board');
    }

    // Since `onDelete: Cascade` is on BoardMember and Column in schema.prisma,
    // Prisma handles cascaded deletes appropriately.
    await prisma.board.delete({
        where: { id: boardId }
    });

    return null;
};

export const BoardService = {
    createBoard,
    getAllAccessibleBoards,
    getSingleBoard,
    updateBoard,
    deleteBoard
};
