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

// 1. CREATE TASK
const createTask = async (userId: string, columnId: string, payload: { title: string; description?: string }) => {
    const column = await prisma.column.findUnique({ where: { id: columnId } });
    if (!column) throw new AppError(404, 'Column not found');

    await checkBoardAccess(column.boardId, userId);

    const maxPosResult = await prisma.task.aggregate({
        where: { columnId },
        _max: { position: true }
    });

    const nextPosition = (maxPosResult._max.position ?? -1) + 1;

    const task = await prisma.task.create({
        data: {
            title: payload.title,
            description: payload.description,
            position: nextPosition,
            columnId
        }
    });

    return task;
};

// 2. LIST TASKS
const getTasks = async (userId: string, columnId: string) => {
    const column = await prisma.column.findUnique({ where: { id: columnId } });
    if (!column) throw new AppError(404, 'Column not found');

    await checkBoardAccess(column.boardId, userId);

    const tasks = await prisma.task.findMany({
        where: { columnId },
        orderBy: { position: 'asc' }
    });

    return tasks;
};

// 3. GET SINGLE TASK
const getSingleTask = async (userId: string, taskId: string) => {
    const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: { column: true }
    });
    if (!task) throw new AppError(404, 'Task not found');

    await checkBoardAccess(task.column.boardId, userId);

    const { column, ...taskData } = task;
    return taskData;
};

// 4. UPDATE TASK
const updateTask = async (userId: string, taskId: string, payload: { title?: string; description?: string }) => {
    const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: { column: true }
    });
    if (!task) throw new AppError(404, 'Task not found');

    await checkBoardAccess(task.column.boardId, userId);

    const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: {
            ...(payload.title !== undefined && { title: payload.title }),
            ...(payload.description !== undefined && { description: payload.description })
        }
    });

    return updatedTask;
};

// 5. DELETE TASK
const deleteTask = async (userId: string, taskId: string) => {
    const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: { column: true }
    });
    if (!task) throw new AppError(404, 'Task not found');

    await checkBoardAccess(task.column.boardId, userId);

    await prisma.$transaction([
        prisma.task.delete({
            where: { id: taskId }
        }),
        prisma.task.updateMany({
            where: {
                columnId: task.columnId,
                position: { gt: task.position }
            },
            data: {
                position: { decrement: 1 }
            }
        })
    ]);

    return null;
};

// 6. MOVE TASK
const moveTask = async (userId: string, taskId: string, targetColumnId: string, newPosition: number) => {
    const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: { column: true }
    });
    if (!task) throw new AppError(404, 'Task not found');

    const targetColumn = await prisma.column.findUnique({
        where: { id: targetColumnId }
    });
    if (!targetColumn) throw new AppError(404, 'Target column not found');

    if (task.column.boardId !== targetColumn.boardId) {
        throw new AppError(400, 'Bad Request: Cannot move task to a different board');
    }

    await checkBoardAccess(task.column.boardId, userId);

    if (task.columnId === targetColumnId) {
        // Move within the same column
        const tasks = await prisma.task.findMany({
            where: { columnId: targetColumnId },
            orderBy: { position: 'asc' }
        });

        const filteredTasks = tasks.filter(t => t.id !== taskId);
        const maxPos = filteredTasks.length;
        const clampedPos = Math.max(0, Math.min(newPosition, maxPos));

        filteredTasks.splice(clampedPos, 0, task);

        const updates = filteredTasks
            .map((t, index) => {
                if (t.position !== index) {
                    return prisma.task.update({
                        where: { id: t.id },
                        data: { position: index }
                    });
                }
                return null;
            })
            .filter((update): update is NonNullable<typeof update> => update !== null);

        if (updates.length > 0) {
            await prisma.$transaction(updates);
        }
    } else {
        // Move across columns
        const sourceTasks = await prisma.task.findMany({
            where: { columnId: task.columnId },
            orderBy: { position: 'asc' }
        });

        const targetTasks = await prisma.task.findMany({
            where: { columnId: targetColumnId },
            orderBy: { position: 'asc' }
        });

        const filteredSource = sourceTasks.filter(t => t.id !== taskId);
        
        const maxPos = targetTasks.length;
        const clampedPos = Math.max(0, Math.min(newPosition, maxPos));
        
        const updatedTarget = [...targetTasks];
        updatedTarget.splice(clampedPos, 0, { ...task, columnId: targetColumnId });

        const updates: any[] = [];

        // Reindex source
        filteredSource.forEach((t, index) => {
            if (t.position !== index) {
                updates.push(prisma.task.update({
                    where: { id: t.id },
                    data: { position: index }
                }));
            }
        });

        // Reindex target and update moved task's columnId and position
        updatedTarget.forEach((t, index) => {
            if (t.id === taskId || t.position !== index) {
                updates.push(prisma.task.update({
                    where: { id: t.id },
                    data: { position: index, columnId: targetColumnId }
                }));
            }
        });

        if (updates.length > 0) {
            await prisma.$transaction(updates);
        }
    }

    return null;
};

export const TaskService = {
    createTask,
    getTasks,
    getSingleTask,
    updateTask,
    deleteTask,
    moveTask
};
