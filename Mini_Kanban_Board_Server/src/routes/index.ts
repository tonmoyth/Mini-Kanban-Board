import express from "express";
import { authRoutes } from "../modules/Auth/auth.route";
import { userRoutes } from "../modules/User/user.route";
import { boardRoutes } from "../modules/Board/board.route";
import { memberRoutes } from "../modules/Member/member.route";

const router = express.Router();

const moduleRoutes = [
    {
        path: "/auth",
        route: authRoutes,
    },
    {
        path: "/user",
        route: userRoutes,
    },
    {
        path: "/boards",
        route: boardRoutes,
    },
    {
        path: "/boards/:boardId/members",
        route: memberRoutes,
    }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
