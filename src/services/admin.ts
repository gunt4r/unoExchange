import type { JwtPayload } from 'jsonwebtoken';
import type { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '@/enums/role';
import { getDataSource } from '@/libs/DB';
import { Admin } from '@/models/admin';

export type TokenPayload = {
  id: string;
  username: string;
  role: string;
} & JwtPayload;

export function verifyJWT(token: string): TokenPayload | null {
  try {
    const payload = verify(token, process.env.JWT_SECRET as string) as TokenPayload;
    return payload;
  } catch {
    return null;
  }
}

export function isAdminToken(token: string): boolean {
  const payload = verifyJWT(token);
  return payload?.role === Role.ADMIN;
}
export const getUserById = async (id: string) => {
  const dataSource = await getDataSource();
  const user = await dataSource.getRepository(Admin).findOneBy({ id });
  if (!user) {
    throw new Error('Admin not found');
  }
  return user;
};
export const getUserByUsername = async (username: string) => {
  const dataSource = await getDataSource();
  const user = await dataSource.getRepository(Admin).findOneBy({ username });
  if (!user) {
    return null;
  }
  return user;
};
export const authentication = async (data: Partial<Admin>): Promise<any> => {
  const { username, password } = data;

  if (!username || !password) {
    throw new Error('username and password are required');
  }

  const user = await getUserByUsername(username);

  if (!user) {
    throw new Error('Admin not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Incorrect username or password');
  }
  const token = sign(
    { id: user.id, username: user.username, role: Role.ADMIN },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' },
  );
  const { password: _, ...userWithoutPassword } = user;
  return { token, user: userWithoutPassword };
};

export const logout = async (response: NextResponse) => {
  response.cookies.set({
    name: 'token',
    value: '',
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
  });
};

export const verifyToken = async (request: NextRequest) => {
  const token = request.cookies.get('token')?.value;
  if (!token) {
    throw new Error('Token not found');
  }
  const payload = verify(
    token,
    process.env.JWT_SECRET as string,
  ) as JwtPayload;
  const user = await getUserById(payload.id);
  if (!user) {
    throw new Error('Admin not found');
  }
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const getUserIdFromRequest = (
  request: NextRequest,
): string | undefined => {
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return undefined;
  }
  try {
    const payload = verify(token, process.env.JWT_SECRET as string) as any;
    return payload?.id;
  } catch {
    return undefined;
  }
};
export const getUserIdFromToken = (token: string): string | undefined => {
  if (!token) {
    return undefined;
  }
  try {
    const payload = verify(token, process.env.JWT_SECRET as string) as any;
    return payload?.id;
  } catch {
    return undefined;
  }
};
export const ensureSessionCookie = (
  request: NextRequest,
  response: NextResponse,
) => {
  let sessionId = request.cookies.get(
    process.env.NAME_SESSION_ID as string,
  )?.value;
  if (!sessionId) {
    sessionId = uuidv4();
    response.cookies.set({
      name: process.env.NAME_SESSION_ID as string,
      value: sessionId,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
    });
  }
  return sessionId;
};

export const getUserFromRequest = async (
  request: NextRequest,
): Promise<Admin | null> => {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return null;
  }

  try {
    return await getUserById(userId);
  } catch {
    return null;
  }
};
