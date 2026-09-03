import { prisma } from '../../lib/prisma';
import AppError from '../../errors/AppError';

// 1. ADD / SHARE BOARD WITH USER
const addMember = async (userId: string, boardId: string, payload: { email: string; role: 'MEMBER' }) => {
    // Find the Board and verify that requester is the Board owner.
    const board = await prisma.board.findUnique({
        where: { id: boardId }
    });

    if (!board) {
        throw new AppError(404, 'Board not found');
    }

    if (board.ownerId !== userId) {
        throw new AppError(403, 'Forbidden: Only the board owner can add members');
    }

    // Find target user by email
    const targetUser = await prisma.user.findUnique({
        where: { email: payload.email }
    });

    if (!targetUser) {
        throw new AppError(404, 'User not found');
    }

    // Check if user is already a member or is the owner
    const existingMember = await prisma.boardMember.findUnique({
        where: {
            boardId_userId: {
                boardId,
                userId: targetUser.id
            }
        }
    });

    if (existingMember || board.ownerId === targetUser.id) {
        throw new AppError(409, 'User is already a member or owner of the board');
    }

    // Create BoardMember
    const newMember = await prisma.boardMember.create({
        data: {
            boardId,
            userId: targetUser.id,
            role: 'MEMBER'
        }
    });

    return newMember;
};

// 2. GET BOARD MEMBERS
const getMembers = async (userId: string, boardId: string) => {
    // requester must have access to the Board (owner or member)
    const board = await prisma.board.findUnique({
        where: { id: boardId },
        include: {
            owner: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            },
            members: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        }
                    }
                }
            }
        }
    });

    if (!board) {
        throw new AppError(404, 'Board not found');
    }

    const isOwner = board.ownerId === userId;
    const isMember = board.members.some(member => member.userId === userId);

    if (!isOwner && !isMember) {
        throw new AppError(403, 'Forbidden: You do not have access to this board');
    }

    // Format the response to include owner and members
    const owner = {
        id: board.owner.id,
        name: board.owner.name,
        email: board.owner.email,
        role: 'OWNER'
    };

    const sharedMembers = board.members.map(member => ({
        id: member.user.id,
        name: member.user.name,
        email: member.user.email,
        role: member.role
    }));

    return [owner, ...sharedMembers];
};

// 3. REMOVE MEMBER
const removeMember = async (requesterId: string, boardId: string, targetUserId: string) => {
    const board = await prisma.board.findUnique({
        where: { id: boardId }
    });

    if (!board) {
        throw new AppError(404, 'Board not found');
    }

    if (board.ownerId !== requesterId) {
        throw new AppError(403, 'Forbidden: Only the board owner can remove members');
    }

    if (board.ownerId === targetUserId) {
        throw new AppError(400, 'Bad Request: The board owner cannot be removed');
    }

    const membership = await prisma.boardMember.findUnique({
        where: {
            boardId_userId: {
                boardId,
                userId: targetUserId
            }
        }
    });

    if (!membership) {
        throw new AppError(404, 'Membership not found');
    }

    await prisma.boardMember.delete({
        where: {
            boardId_userId: {
                boardId,
                userId: targetUserId
            }
        }
    });

    return null;
};

export const MemberService = {
    addMember,
    getMembers,
    removeMember,
};
