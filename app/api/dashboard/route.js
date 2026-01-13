import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDashboardData } from '../../../lib/givenergy';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const COOKIE_NAME = 'givenergy_token';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME);

    if (!token?.value) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const data = await getDashboardData(token.value);
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    const status = error.message.includes('Authentication failed') ? 401 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
