import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const expectedUsername = process.env.ADMIN_USERNAME || 'admin';
    const expectedPassword = process.env.ADMIN_PASSWORD || 'password123';

    if (username === expectedUsername && password === expectedPassword) {
      // Create a stateless token
      const token = Buffer.from(`${username}:${password}`).toString('base64');
      
      const response = NextResponse.json({
        success: true,
        token,
        message: 'Authenticated successfully'
      });

      // Also set a secure HttpOnly cookie for extra safety
      response.cookies.set('admin_session', token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });

      return response;
    } else {
      return NextResponse.json(
        { success: false, error: 'Невірний логін або пароль' },
        { status: 401 }
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Server error' },
      { status: 500 }
    );
  }
}
