import { z } from "zod";

export const userRegisterSchema = z.object({
  body: z.object({
    name: z.string({
      message: "Name is required",
    }),
    email: z
      .string({
        message: "Email is required",
      })
      .email(),
    password: z
      .string({
        message: "Password is required",
      })
      .min(6, "Password must be at least 6 characters"),
  }),
});

export const userLoginSchema = z.object({
  body: z.object({
    email: z
      .string({
        message: "Email is required",
      })
      .email(),
    password: z
      .string({
        message: "Password is required",
      })
      .min(6, "Password must be at least 6 characters"),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});

export const updateUserProfileSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    bio: z.string().max(300).optional(),
  }),
});
