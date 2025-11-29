"use client";

import { z } from "zod";

export const UserSchema = z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
    role: z.string().min(1, "Role is required"),
    status: z.enum(["active", "inactive", "banned"]),
});
