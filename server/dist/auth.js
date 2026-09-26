"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeUser = exports.isSupportedRole = exports.makeDemoPasswordHash = exports.consumeResetToken = exports.createResetToken = exports.roleCanApprove = exports.requireAuth = exports.getSessionUserId = exports.clearSession = exports.createSession = exports.verifyPassword = exports.hashPassword = void 0;
const node_crypto_1 = require("node:crypto");
const SESSION_COOKIE = 'ao_session';
const sessions = new Map();
const resetTokens = new Map();
const hashPassword = (password, salt = (0, node_crypto_1.randomBytes)(16).toString('hex')) => {
    const hash = (0, node_crypto_1.scryptSync)(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
};
exports.hashPassword = hashPassword;
const verifyPassword = (password, storedHash) => {
    const [salt, hash] = storedHash.split(':');
    if (!salt || !hash)
        return false;
    const candidate = (0, node_crypto_1.scryptSync)(password, salt, 64);
    const expected = Buffer.from(hash, 'hex');
    return expected.length === candidate.length && (0, node_crypto_1.timingSafeEqual)(candidate, expected);
};
exports.verifyPassword = verifyPassword;
const cookieOptions = (rememberMe) => `HttpOnly; Path=/; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}; Max-Age=${rememberMe ? 60 * 60 * 24 * 14 : 60 * 60 * 8}`;
const createSession = (res, userId, rememberMe) => {
    const token = (0, node_crypto_1.randomBytes)(32).toString('hex');
    sessions.set(token, {
        userId,
        rememberMe,
        expiresAt: Date.now() + (rememberMe ? 14 : 8) * 24 * 60 * 60 * 1000,
    });
    res.setHeader('Set-Cookie', `${SESSION_COOKIE}=${token}; ${cookieOptions(rememberMe)}`);
};
exports.createSession = createSession;
const clearSession = (req, res) => {
    const token = readCookie(req, SESSION_COOKIE);
    if (token)
        sessions.delete(token);
    res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`);
};
exports.clearSession = clearSession;
const readCookie = (req, key) => {
    const header = req.headers.cookie || '';
    const pair = header.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${key}=`));
    return pair?.slice(key.length + 1);
};
const getSessionUserId = (req) => {
    const token = readCookie(req, SESSION_COOKIE);
    if (!token)
        return undefined;
    const session = sessions.get(token);
    if (!session)
        return undefined;
    if (session.expiresAt < Date.now()) {
        sessions.delete(token);
        return undefined;
    }
    return session.userId;
};
exports.getSessionUserId = getSessionUserId;
const requireAuth = (req, res, next) => {
    if (!(0, exports.getSessionUserId)(req)) {
        res.status(401).json({ error: 'Authentication required', code: 'AUTH_REQUIRED' });
        return;
    }
    next();
};
exports.requireAuth = requireAuth;
const roleCanApprove = (role) => role === 'ADMIN' || role === 'MANAGER';
exports.roleCanApprove = roleCanApprove;
const createResetToken = (userId) => {
    const token = (0, node_crypto_1.randomBytes)(24).toString('hex');
    resetTokens.set(token, { userId, expiresAt: Date.now() + 10 * 60 * 1000 });
    return token;
};
exports.createResetToken = createResetToken;
const consumeResetToken = (token) => {
    const record = resetTokens.get(token);
    if (!record || record.expiresAt < Date.now()) {
        if (record)
            resetTokens.delete(token);
        return undefined;
    }
    resetTokens.delete(token);
    return record.userId;
};
exports.consumeResetToken = consumeResetToken;
const makeDemoPasswordHash = () => (0, exports.hashPassword)('Demo@123', 'ai-orchestrator-demo-salt');
exports.makeDemoPasswordHash = makeDemoPasswordHash;
const isSupportedRole = (role) => role === 'ADMIN' || role === 'MANAGER' || role === 'EMPLOYEE';
exports.isSupportedRole = isSupportedRole;
const safeUser = (user) => {
    const { passwordHash: _passwordHash, ...publicUser } = user;
    return publicUser;
};
exports.safeUser = safeUser;
