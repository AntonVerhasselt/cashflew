import { json } from '@sveltejs/kit';
import { PUBLIC_EXACT_CLIENT_ID, PUBLIC_EXACT_CLIENT_SECRET, PUBLIC_EXACT_REDIRECT_URI } from '$env/static/public';

const EXACT_TOKEN_URL = 'https://start.exactonline.be/api/oauth2/token';

export async function POST({ request }: { request: Request }) {
    const { code } = await request.json();

    const response = await fetch(EXACT_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: PUBLIC_EXACT_CLIENT_ID,
            client_secret: PUBLIC_EXACT_CLIENT_SECRET,
            redirect_uri: PUBLIC_EXACT_REDIRECT_URI,
            code,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Exact API error:', errorText);
        return json({ error: 'Failed to exchange code for token', details: errorText }, { status: 400 });
    }

    const tokenData = await response.json();
    console.log(tokenData);
    return json(tokenData);
}
