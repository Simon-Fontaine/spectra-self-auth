import bcrypt from "bcryptjs";
import prismaEdge from "@/lib/dbEdge";
import { Role } from "@prisma/client";
/**
 * Registers a new user in the database with a hashed password.
 * Throws an error if username or email are already taken.
 *
 * @param param0 - An object containing user details.
 * @returns The newly created user object.
 */
export async function registerUser({
  username,
  email,
  password,
  displayName,
  avatarUrl,
}: {
  username: string;
  email: string;
  password: string;
  displayName?: string;
  avatarUrl?: string;
}) {
  // Check if the username or email is already taken
  const existing = await prismaEdge.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });
  if (existing) {
    throw new Error("Username or email is already taken.");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  return prismaEdge.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      displayName,
      avatarUrl,
      roles: [Role.USER],
    },
  });
}

/**
 * Verifies user credentials by username/email and password.
 * Returns the user if valid, otherwise null.
 *
 * @param usernameOrEmail - The username or email to match.
 * @param password - The plain-text password to verify.
 */
export async function verifyUser(usernameOrEmail: string, password: string) {
  const user = await prismaEdge.user.findFirst({
    where: {
      OR: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    },
  });
  if (!user) return null;

  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;

  return user;
}

/**
 * Marks a user's email as verified.
 *
 * @param userId - The ID of the user.
 */
export async function markEmailVerified(userId: string) {
  await prismaEdge.user.update({
    where: { id: userId },
    data: { isEmailVerified: true },
  });
}

/**
 * Updates a user's password by hashing the new password.
 *
 * @param userId - The ID of the user.
 * @param newPassword - The new plain-text password.
 */
export async function updateUserPassword(userId: string, newPassword: string) {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prismaEdge.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
}

/**
 * Consumes an invitation by marking it as used.
 * Returns the invitation record or null if invalid/expired.
 *
 * @param email - The email address to match.
 */
export async function consumeInvitation(email: string) {
  const invitation = await prismaEdge.invitation.findFirst({
    where: { email, usedAt: null, expiresAt: { gte: new Date() } },
  });

  if (!invitation) return null;

  await prismaEdge.invitation.update({
    where: { id: invitation.id },
    data: { usedAt: new Date() },
  });

  return invitation;
}
