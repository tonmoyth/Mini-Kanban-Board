import express from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import validateRequest from '../../middlewares/validateRequest';
import { ColumnValidation } from './column.validation';
import { ColumnController } from './column.controller';

export const boardColumnRoutes = express.Router({ mergeParams: true });

boardColumnRoutes.post(
    '/',
    checkAuth(),
    validateRequest(ColumnValidation.createColumnValidation),
    ColumnController.createColumn
);

export const columnRoutes = express.Router();

columnRoutes.patch(
    '/:columnId',
    checkAuth(),
    validateRequest(ColumnValidation.renameColumnValidation),
    ColumnController.renameColumn
);

columnRoutes.delete(
    '/:columnId',
    checkAuth(),
    ColumnController.deleteColumn
);

columnRoutes.patch(
    '/:columnId/reorder',
    checkAuth(),
    validateRequest(ColumnValidation.reorderColumnValidation),
    ColumnController.reorderColumn
);
