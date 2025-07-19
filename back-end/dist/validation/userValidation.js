"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = void 0;
const zod_1 = require("zod");
// Date format validator
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
exports.registerSchema = zod_1.z
    .object({
    firstName: zod_1.z
        .string()
        .min(2, "First name is required")
        .max(50, "First name must be 50 characters or less"),
    lastName: zod_1.z
        .string()
        .min(2, "Last name is required")
        .max(50, "Last name must be 50 characters or less"),
    email: zod_1.z
        .string()
        .email("Invalid email address")
        .min(3, "Email is required"),
    phone: zod_1.z
        .string()
        .regex(/^\d{10}$/, "Phone number must be 10 digits"),
    dob: zod_1.z
        .string()
        .regex(dateRegex, "DOB must be in YYYY-MM-DD format")
        .transform((val) => new Date(val)), // Transform string to Date
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Za-z]/, "Password must contain at least one letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    preferences: zod_1.z
        .array(zod_1.z.string())
        .min(1, "Select at least one category"),
});
