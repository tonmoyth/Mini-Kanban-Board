import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { authService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { cookieUtil } from "../../utils/cookie";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.registerUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);
  const { user, accessToken } = result;

  // Set tokens in cookies for backward compatibility
  cookieUtil.setCookie(res, "accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      accessToken,
      user,
    },
  });
});

const getCurrentUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const result = await authService.getCurrentUser(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
  // Clear authentication cookies
  cookieUtil.clearCookie(res, "accessToken", { path: "/" });
  
  // Since JWT is stateless, we just return success
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged out successfully",
    data: null,
  });
});

export const userController = {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
};
