"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDTO = void 0;
const zod_1 = require("zod");
const custom_error_1 = require("../util/custom.error"); // Adjust path
const validateDTO = (schema) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Request Body:", req.body); // Debug the incoming data
        req.body = yield schema.parseAsync(req.body); // Validate and transform
        console.log("Validated Body:", req.body); // Debug validated data
        next();
    }
    catch (error) {
        console.error("Validation Error:", error); // Log the full error
        if (error instanceof zod_1.ZodError) {
            throw new custom_error_1.CustomError("Validation failed: " + error.errors.map((e) => e.message).join(", "), 400);
        }
        throw new custom_error_1.CustomError(`Required field missing or invalid: ${error.message}`, 400);
    }
});
exports.validateDTO = validateDTO;
