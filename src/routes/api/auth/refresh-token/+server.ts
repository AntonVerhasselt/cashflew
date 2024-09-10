import { json } from '@sveltejs/kit';
import { refreshToken } from '$lib/exactAuth';

export async function POST({ request }: { request: Request }) {
    const formData = await request.formData();
    const refreshTokenValue = formData.get('refresh_token');

    if (typeof refreshTokenValue !== 'string') {
        return json({ error: 'Invalid refresh token' }, { status: 400 });
    }

    try {
        const tokenData = await refreshToken(refreshTokenValue);
        return json(tokenData);
    } catch (error) {
        console.error('Error refreshing token:', error);
        if (error instanceof Error) {
            return json({ error: 'Failed to refresh token', details: error.message }, { status: 500 });
        }
        return json({ error: 'Failed to refresh token' }, { status: 500 });
    }
}
