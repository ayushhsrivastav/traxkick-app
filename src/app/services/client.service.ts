// Packages
import { Context } from 'koa';
import z from 'zod';

// Dependencies
import { BaseError } from '../utils/error.util';
import { usersGateway } from '../database';
import { generateToken } from '../utils/jwt.util';
import { comparePassword } from '../utils/bcrypt.util';
import { ErrorKeys } from '../../config/error-codes';
import { userInsertSchema } from '../schemas/user.schema';

export async function signup(
  ctx: Context
): Promise<{ status: string; access_token: string; refresh_token: string }> {
  const body = ctx.request.body;
  try {
    // Decontructing username and password
    const { username, email, password } = body as {
      username: string;
      email: string;
      password: string;
    };

    const userInfo = {
      username,
      email,
      password,
      created_at: new Date(),
    };

    // Parse user info before inserting to database
    const userObject = await userInsertSchema.parseAsync(userInfo);

    await usersGateway.insertOne({ record: userObject });

    // Generating token for user
    const access_token = generateToken(userObject?.username);
    const refresh_token = generateToken(userObject?.username, true);

    return { status: 'success', access_token, refresh_token };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors[0].message;
      throw new BaseError(errorMessage as ErrorKeys, true, true, error);
    } else {
      const newError = error as { error_message: ErrorKeys };
      throw new BaseError(
        newError?.error_message || 'UNKNOWN_EXCEPTION',
        true,
        true,
        error
      );
    }
  }
}

async function login(ctx: Context): Promise<{
  status: string;
  access_token: string;
  refresh_token: string;
  message: string;
}> {
  const body = ctx.request.body as { username: string; password: string };
  const { username, password } = body;

  const userDetails = await usersGateway.findOne({
    query: { username },
  });

  if (!userDetails) {
    return {
      status: 'failed',
      message: 'Invalid username',
      access_token: '',
      refresh_token: '',
    };
  }

  const isPasswordValid = await comparePassword(password, userDetails.password);

  if (!isPasswordValid) {
    return {
      status: 'failed',
      message: 'Incorrect password',
      access_token: '',
      refresh_token: '',
    };
  }

  const access_token = generateToken(
    userDetails.username,
    userDetails.is_admin
  );
  const refresh_token = generateToken(
    userDetails.username,
    userDetails.is_admin,
    true
  );

  return {
    status: 'success',
    message: 'Login successful',
    access_token,
    refresh_token,
  };
}

export { login };
