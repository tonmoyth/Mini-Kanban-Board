import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

import fs from "fs";
import { userService } from "./user.service";

const getProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await userService.getProfile(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile fetched successfully",
    data: result,
  });
});



export const userController = {
  getProfile,

};
