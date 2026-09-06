import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { userController } from "./user.controller";
import { upload } from "../../middlewares/upload";
import validateRequest from "../../middlewares/validateRequest";
import { updateProfileSchema } from "../Auth/auth.validation";

const router = express.Router();

router.get("/me", checkAuth(), userController.getProfile);



export const userRoutes = router;
