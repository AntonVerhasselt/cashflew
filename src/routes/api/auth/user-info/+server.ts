import { json } from '@sveltejs/kit';
import { getUserInfo } from '$lib/exactAuth';

export async function GET({ url }: { url: URL }) {
    const token = url.searchParams.get('token');

    if (!token) {
        return json({ error: 'No token provided' }, { status: 400 });
    }

    try {
        const userData = await getUserInfo(token);
        return json(userData);
    } catch (error) {
        console.error('Error in user info request:', error);
        if (error instanceof Error) {
            return json({ error: error.message }, { status: 500 });
        }
        return json({ error: 'Internal server error' }, { status: 500 });
    }
}
