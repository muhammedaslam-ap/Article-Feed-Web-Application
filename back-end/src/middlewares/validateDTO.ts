import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import {CustomError} from "../util/custom.error"; // Adjust path

export const validateDTO =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Request Body:", req.body); // Debug the incoming data
      req.body = await schema.parseAsync(req.body); // Validate and transform
      console.log("Validated Body:", req.body); // Debug validated data
      next();
    } catch (error:any) {
      console.error("Validation Error:", error); // Log the full error
      if (error instanceof ZodError) {
        throw new CustomError("Validation failed: " + error.errors.map((e) => e.message).join(", "), 400);
      }
      throw new CustomError(`Required field missing or invalid: ${error.message}`, 400);
    }
  };