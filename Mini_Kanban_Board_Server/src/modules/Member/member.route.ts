import express from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import validateRequest from '../../middlewares/validateRequest';
import { MemberValidation } from './member.validation';
import { MemberController } from './member.controller';

// mergeParams: true is required to access :boardId from the parent route
const router = express.Router({ mergeParams: true });

router.post(
    '/',
    checkAuth(),
    validateRequest(MemberValidation.addMemberValidation),
    MemberController.addMember
);

router.get(
    '/',
    checkAuth(),
    MemberController.getMembers
);

router.delete(
    '/:userId',
    checkAuth(),
    MemberController.removeMember
);

export const memberRoutes = router;
