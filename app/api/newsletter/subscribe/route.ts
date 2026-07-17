import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { email } = body;

    // 1. Presence check
    if (email === undefined || email === null) {
      return NextResponse.json(
        { success: false, error: 'Email address is required.' },
        { status: 400 }
      );
    }

    if (typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email address must be a text value.' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim();

    // 2. Empty check
    if (trimmedEmail.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Email address cannot be empty.' },
        { status: 400 }
      );
    }

    // 3. Length limits (RFC 5321: path length constraint is 254 characters)
    if (trimmedEmail.length > 254) {
      return NextResponse.json(
        { success: false, error: 'Email address is too long (maximum 254 characters).' },
        { status: 400 }
      );
    }

    // 4. Regex validation for standard format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address format (e.g., user@example.com).' },
        { status: 400 }
      );
    }

    // Optional: safety/spam check (e.g., extremely common dummy email filters)
    const lowerEmail = trimmedEmail.toLowerCase();
    if (lowerEmail.endsWith('@test.com') || lowerEmail.endsWith('@example.com') || lowerEmail === 'test@test.com') {
      return NextResponse.json(
        { success: false, error: 'Please subscribe using a real, active email address.' },
        { status: 400 }
      );
    }

    // Success response
    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to our newsletter network!',
      email: trimmedEmail,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal server validation error.' },
      { status: 500 }
    );
  }
}
