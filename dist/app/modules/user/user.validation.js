"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const createUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string().min(1).max(255).optional(),
        name: zod_1.z.string().min(1).max(255),
        email: zod_1.z.string().email(),
        role: zod_1.z.string().optional().default('user'),
        password: zod_1.z.string().min(1).max(255),
    }),
});
exports.UserValidation = {
    createUserZodSchema,
};
