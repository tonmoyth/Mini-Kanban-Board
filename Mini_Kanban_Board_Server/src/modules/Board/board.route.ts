import express from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import validateRequest from '../../middlewares/validateRequest';
import { BoardValidation } from './board.validation';
import { BoardController } from './board.controller';

const router = express.Router();

router.post(
    '/',
    checkAuth(),
    validateRequest(BoardValidation.createBoardValidation),
    BoardController.createBoard
);

router.get(
    '/',
    checkAuth(),
    BoardController.getAllAccessibleBoards
);

router.get(
    '/:boardId',
    checkAuth(),
    BoardController.getSingleBoard
);

router.patch(
    '/:boardId',
    checkAuth(),
    validateRequest(BoardValidation.updateBoardValidation),
    BoardController.updateBoard
);

router.delete(
    '/:boardId',
    checkAuth(),
    BoardController.deleteBoard
);

export const boardRoutes = router;
