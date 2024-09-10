import { json } from '@sveltejs/kit';

const EXACT_USER_INFO_URL = 'https://start.exactonline.nl/api/v1/current/Me';

export async function GET({ request, url }: { request: Request, url: URL }) {
    const token = url.searchParams.get('token');

    if (!token) {
        return json({ error: 'No token provided' }, { status: 400 });
    }

    const response = await fetch(EXACT_USER_INFO_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Exact API error:', errorText);
        return json({ error: 'Failed to fetch user info', details: errorText }, { status: response.status });
    }

    const userData = await response.json();
    return json(userData);
}
