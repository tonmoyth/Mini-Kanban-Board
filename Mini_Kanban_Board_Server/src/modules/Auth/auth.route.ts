import express from "express";
import { userController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import {
  userRegisterSchema,
  userLoginSchema,
} from "./auth.validation";
import { checkAuth } from "../../middlewares/checkAuth";

const router = express.Router();

router.post(
  "/register",
  validateRequest(userRegisterSchema),
  userController.registerUser,
);

router.post(
  "/login",
  validateRequest(userLoginSchema),
  userController.loginUser,
);

router.get("/me", checkAuth(), userController.getCurrentUser);

router.post("/logout", checkAuth(), userController.logoutUser);

export const authRoutes = router;
