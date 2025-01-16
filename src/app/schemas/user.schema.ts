// Packages
import z from 'zod';
import { ObjectId } from 'mongodb';

// Dependencies
import { hashPassword } from '../utils/bcrypt.util';
import { ErrorKeys } from '../../config/error-codes';

export const userInsertSchema = z.object({
  username: z.string().refine(val => val !== undefined, {
    message: 'USERNAME_NOT_PASSED' as ErrorKeys,
  }),
  password: z
    .string()
    .min(6, { message: 'MIN_LEN_PASSWORD' as ErrorKeys })
    .refine(val => val !== undefined, {
      message: 'PASSWORD_NOT_PASSED' as ErrorKeys,
    })
    .transform(async val => await hashPassword(val)),
  created_at: z
    .date()
    .optional()
    .refine(val => val !== undefined, {
      message: 'CREATED_AT_NOT_PASSED' as ErrorKeys,
    }),
});

export const userInfoSchema = z.object({
  _id: z.instanceof(ObjectId),
  username: z.string(),
  password: z.string(),
  created_at: z.date(),
});
