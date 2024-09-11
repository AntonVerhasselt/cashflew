import { exchangeCodeForTokens } from '$server/authController';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ request }: RequestEvent) {
  const { code } = await request.json();
  const tokens = await exchangeCodeForTokens(code);
  return new Response(JSON.stringify(tokens), { status: 200 });
}
