import { refreshTokens } from '$server/authController';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ request }: RequestEvent) {
  const { refreshToken } = await request.json();
  const tokens = await refreshTokens(refreshToken);
  return new Response(JSON.stringify(tokens), { status: 200 });
}
