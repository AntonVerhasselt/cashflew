import { json } from '@sveltejs/kit';
import { exchangeCodeForToken } from '$lib/exactAuth';

export async function POST({ request }: { request: Request }) {
    const { code } = await request.json();

    try {
        const tokenData = await exchangeCodeForToken(code);
        return json(tokenData);
    } catch (error) {
        console.error('Error exchanging code for token:', error);
        return json({ error: 'Failed to exchange code for token' }, { status: 500 });
    }
}
