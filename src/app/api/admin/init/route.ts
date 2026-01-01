import type { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { getDataSource } from '@/libs/DB';
import { Admin } from '@/models/admin';

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  if (secret !== process.env.INIT_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const AppDataSource = await getDataSource();
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const adminRepo = AppDataSource.getRepository(Admin);

    const adminCount = await adminRepo.count();

    if (adminCount > 0) {
      return NextResponse.json({
        error: 'Admin already exists',
      }, { status: 400 });
    }

    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
      return NextResponse.json({
        error: 'ADMIN_EMAIL and ADMIN_PASSWORD must be set',
      }, { status: 500 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = adminRepo.create({
      username,
      password: hashedPassword,
    });

    await adminRepo.save(admin);

    return NextResponse.json({
      message: 'Admin created successfully',
      username,
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json({
      error: 'Internal server error',
    }, { status: 500 });
  }
}
