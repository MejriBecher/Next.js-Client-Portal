import { z } from "zod"

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().trim().optional(),
})

export const createRequestSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().optional(),
  budget: z.number().positive("Budget must be positive").optional().nullable(),
})

export const updateRequestSchema = z.object({
  title: z.string().trim().min(1, "Title cannot be empty").optional(),
  description: z.string().trim().optional(),
  budget: z.number().positive("Budget must be positive").optional().nullable(),
  status: z.enum(["PENDING", "IN_PROGRESS", "DONE"]).optional(),
})
