import bcrypt from 'bcrypt';

/**
 * Hash a plain text password.
 * @param password - The plain text password.
 * @param saltRounds - The number of salt rounds (default is 10).
 * @returns A promise that resolves to the hashed password.
 */
export async function hashPassword(
  password: string,
  saltRounds = 10
): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  } catch {
    throw new Error('Error hashing the password');
  }
}

/**
 * Compare a plain text password with a hashed password.
 * @param password - The plain text password.
 * @param hashedPassword - The hashed password.
 * @returns A promise that resolves to a boolean indicating if the passwords match.
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch {
    throw new Error('Error comparing the passwords');
  }
}
