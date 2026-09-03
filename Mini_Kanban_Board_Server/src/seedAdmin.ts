import status from "http-status";
import bcrypt from "bcrypt";
import AppError from "./errors/AppError";
import { prisma } from "./lib/prisma";

const createAdmin = async () => {
  try {
    // Check if super admin already exists
    const existingSuperAdmin = await prisma.user.findUnique({
      where: {
        email: "tonmoyth143@gmail.com",
      },
    });

    if (existingSuperAdmin) {
      throw new AppError(status.CONFLICT, "Super admin already exists");
    }

    const passwordHash = await bcrypt.hash("12345678", 12);
    // Create user with Prisma directly
    await prisma.user.create({
      data: {
        name: "SUPER ADMIN VAI",
        email: "tonmoyth143@gmail.com",
        passwordHash,
      },
    });

    console.log("Super admin created successfully");
  } catch (error) {
    console.error("Error creating super admin:", error);
  }
};

// Run the seed function
createAdmin();
