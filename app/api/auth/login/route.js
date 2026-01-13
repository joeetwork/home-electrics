import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'givenergy_token';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function POST(request) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey || typeof apiKey !== 'string') {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    // Validate the API key by making a test request to GivEnergy
    const testResponse = await fetch('https://api.givenergy.cloud/v1/communication-device', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!testResponse.ok) {
      if (testResponse.status === 401) {
        return NextResponse.json(
          { error: 'Invalid API key. Please check and try again.' },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: 'Could not validate API key. Please try again.' },
        { status: 400 }
      );
    }

    const data = await testResponse.json();

    if (!data.data || data.data.length === 0) {
      return NextResponse.json(
        { error: 'No devices found for this API key.' },
        { status: 400 }
      );
    }

    // Set the cookie with the API key
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, apiKey, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
