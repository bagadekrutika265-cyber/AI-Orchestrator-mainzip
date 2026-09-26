import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto';
import { Request, Response, NextFunction } from 'express';
import { User, UserRole } from './types.js';

type Session = {
  userId: string;
  expiresAt: number;
  rememberMe: boolean;
};

type ResetToken = {
  userId: string;
  expiresAt: number;
};

const SESSION_COOKIE = 'ao_session';
const sessions = new Map<string, Session>();
const resetTokens = new Map<string, ResetToken>();

export const hashPassword = (password: string, salt = randomBytes(16).toString('hex')) => {
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
};

export const verifyPassword = (password: string, storedHash: string) => {
  const [salt, hash] = storedHash.split(':');
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, 'hex');
  return expected.length === candidate.length && timingSafeEqual(candidate, expected);
};

const cookieOptions = (rememberMe: boolean) =>
  `HttpOnly; Path=/; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}; Max-Age=${rememberMe ? 60 * 60 * 24 * 14 : 60 * 60 * 8}`;

export const createSession = (res: Response, userId: string, rememberMe: boolean) => {
  const token = randomBytes(32).toString('hex');
  sessions.set(token, {
    userId,
    rememberMe,
    expiresAt: Date.now() + (rememberMe ? 14 : 8) * 24 * 60 * 60 * 1000,
  });
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=${token}; ${cookieOptions(rememberMe)}`);
};

export const clearSession = (req: Request, res: Response) => {
  const token = readCookie(req, SESSION_COOKIE);
  if (token) sessions.delete(token);
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`);
};

const readCookie = (req: Request, key: string) => {
  const header = req.headers.cookie || '';
  const pair = header.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${key}=`));
  return pair?.slice(key.length + 1);
};

export const getSessionUserId = (req: Request) => {
  const token = readCookie(req, SESSION_COOKIE);
  if (!token) return undefined;
  const session = sessions.get(token);
  if (!session) return undefined;
  if (session.expiresAt < Date.now()) {
    sessions.delete(token);
    return undefined;
  }
  return session.userId;
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!getSessionUserId(req)) {
    res.status(401).json({ error: 'Authentication required', code: 'AUTH_REQUIRED' });
    return;
  }
  next();
};

export const roleCanApprove = (role: UserRole) => role === 'ADMIN' || role === 'MANAGER';

export const createResetToken = (userId: string) => {
  const token = randomBytes(24).toString('hex');
  resetTokens.set(token, { userId, expiresAt: Date.now() + 10 * 60 * 1000 });
  return token;
};

export const consumeResetToken = (token: string) => {
  const record = resetTokens.get(token);
  if (!record || record.expiresAt < Date.now()) {
    if (record) resetTokens.delete(token);
    return undefined;
  }
  resetTokens.delete(token);
  return record.userId;
};

export const makeDemoPasswordHash = () => hashPassword('Demo@123', 'ai-orchestrator-demo-salt');
export const isSupportedRole = (role: string): role is UserRole =>
  role === 'ADMIN' || role === 'MANAGER' || role === 'EMPLOYEE';
export const safeUser = (user: User) => {
  const { passwordHash: _passwordHash, ...publicUser } = user as User & { passwordHash?: string };
  return publicUser;
};