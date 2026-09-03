import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { jwtUtils } from "../../utils/jwtUtils";
import { envVeriables } from "../../config/envConfig";
import { SignOptions } from "jsonwebtoken";

const registerUser = async (userData: any) => {
  // Check if email already exists
  const existingEmail = await prisma.user.findUnique({
    where: {
      email: userData.email.toLowerCase(),
    },
  });

  if (existingEmail) {
    throw new AppError(httpStatus.CONFLICT, "Email already exists");
  }

  // Hash password
  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(userData.password, saltRounds);

  // Create user
  const newUser = await prisma.user.create({
    data: {
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      passwordHash: passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    }
  });

  return newUser;
};

const loginUser = async (payload: any) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email.toLowerCase(),
    },
  });

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  const isPasswordMatched = await bcrypt.compare(payload.password, user.passwordHash);

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  // Generate JWT
  const jwtPayload = {
    userId: user.id,
    email: user.email
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    envVeriables.JWT_SECRET_KEY,
    {
      expiresIn: envVeriables.JWT_EXPIRES_IN || "7d",
    } as SignOptions
  );

  return {
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    }
  };
};

const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    }
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

export const authService = {
  registerUser,
  loginUser,
  getCurrentUser,
};
