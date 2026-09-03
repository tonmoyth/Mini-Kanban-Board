import { prisma } from '../../lib/prisma';
import AppError from '../../errors/AppError';

// Helper to check board access
const checkBoardAccess = async (boardId: string, userId: string) => {
    const board = await prisma.board.findUnique({
        where: { id: boardId },
        include: { members: true }
    });

    if (!board) {
        throw new AppError(404, 'Board not found');
    }

    const hasAccess = board.ownerId === userId || board.members.some(member => member.userId === userId);
    if (!hasAccess) {
        throw new AppError(403, 'Forbidden: You do not have access to this board');
    }

    return board;
};

const createColumn = async (userId: string, boardId: string, payload: { name: string }) => {
    await checkBoardAccess(boardId, userId);

    const maxPosResult = await prisma.column.aggregate({
        where: { boardId },
        _max: { position: true }
    });

    const nextPosition = (maxPosResult._max.position ?? -1) + 1;

    const column = await prisma.column.create({
        data: {
            name: payload.name,
            position: nextPosition,
            boardId
        }
    });

    return column;
};

const renameColumn = async (userId: string, columnId: string, payload: { name: string }) => {
    const column = await prisma.column.findUnique({
        where: { id: columnId }
    });

    if (!column) {
        throw new AppError(404, 'Column not found');
    }

    await checkBoardAccess(column.boardId, userId);

    const updatedColumn = await prisma.column.update({
        where: { id: columnId },
        data: { name: payload.name }
    });

    return updatedColumn;
};

const deleteColumn = async (userId: string, columnId: string) => {
    const column = await prisma.column.findUnique({
        where: { id: columnId }
    });

    if (!column) {
        throw new AppError(404, 'Column not found');
    }

    await checkBoardAccess(column.boardId, userId);

    // Schema has onDelete: Cascade for tasks, so this safely deletes related tasks
    await prisma.column.delete({
        where: { id: columnId }
    });

    return null;
};

const reorderColumn = async (userId: string, columnId: string, newPosition: number) => {
    const column = await prisma.column.findUnique({
        where: { id: columnId }
    });

    if (!column) {
        throw new AppError(404, 'Column not found');
    }

    await checkBoardAccess(column.boardId, userId);

    // Fetch all columns for this board ordered by position ASC
    const columns = await prisma.column.findMany({
        where: { boardId: column.boardId },
        orderBy: { position: 'asc' }
    });

    const filteredColumns = columns.filter(c => c.id !== columnId);
    const maxPos = filteredColumns.length;
    const clampedPos = Math.max(0, Math.min(newPosition, maxPos));

    filteredColumns.splice(clampedPos, 0, column);

    const updates = filteredColumns
        .map((col, index) => {
            if (col.position !== index) {
                return prisma.column.update({
                    where: { id: col.id },
                    data: { position: index }
                });
            }
            return null;
        })
        .filter((update): update is NonNullable<typeof update> => update !== null);

    if (updates.length > 0) {
        await prisma.$transaction(updates);
    }

    return null;
};

export const ColumnService = {
    createColumn,
    renameColumn,
    deleteColumn,
    reorderColumn
};
