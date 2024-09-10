import { getCookie, setCookie } from './cookieUtils';
import { PUBLIC_EXACT_CLIENT_ID, PUBLIC_EXACT_REDIRECT_URI, PUBLIC_EXACT_CLIENT_SECRET } from '$env/static/public';

const EXACT_AUTH_URL = 'https://start.exactonline.be/api/oauth2/auth';
const EXACT_TOKEN_URL = 'https://start.exactonline.be/api/oauth2/token';

export async function getAuthorizationUrl() {
  const params = new URLSearchParams({
    client_id: PUBLIC_EXACT_CLIENT_ID,
    redirect_uri: PUBLIC_EXACT_REDIRECT_URI,
    response_type: 'code',
    scope: 'openid profile email',
  });

  return `${EXACT_AUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string) {
  const response = await fetch(EXACT_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: PUBLIC_EXACT_CLIENT_ID ?? '',
      client_secret: PUBLIC_EXACT_CLIENT_SECRET ?? '',
      code,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange code for token');
  }

  return response.json();
}

export function setAuthToken(token: string) {
  setCookie('exact_auth_token', token, 7);
}

export function getAuthToken() {
  return getCookie('exact_auth_token');
}

export function removeAuthToken() {
  setCookie('exact_auth_token', '', -1);
}

export async function getUserInfo(token: string) {
  const response = await fetch('https://start.exactonline.nl/api/v1/current/Me', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user info');
  }

  return response.json();
}