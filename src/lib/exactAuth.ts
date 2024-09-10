import { getCookie, setCookie } from './cookieUtils';
import { PUBLIC_EXACT_CLIENT_ID, PUBLIC_EXACT_REDIRECT_URI, PUBLIC_EXACT_CLIENT_SECRET } from '$env/static/public';

const EXACT_AUTH_URL = 'https://start.exactonline.be/api/oauth2/auth';
const EXACT_TOKEN_URL = 'https://start.exactonline.be/api/oauth2/token';
const EXACT_USER_INFO_URL = 'https://start.exactonline.be/api/v1/current/Me';

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
      code,
      redirect_uri: PUBLIC_EXACT_REDIRECT_URI,
      grant_type: 'authorization_code',
      client_id: PUBLIC_EXACT_CLIENT_ID,
      client_secret: PUBLIC_EXACT_CLIENT_SECRET
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error exchanging code for token:', errorData);
    throw new Error('Failed to exchange code for token');
  }

  const tokenData = await response.json();
  setAuthToken(tokenData);
  return tokenData;
}

export function setAuthToken(tokenData: any) {
  const expiresAt = Date.now() + tokenData.expires_in * 1000;
  const dataToStore = { ...tokenData, expires_at: expiresAt };
  setCookie('exact_auth_token', JSON.stringify(dataToStore), 30); // Store for 30 days
}

export function getAuthToken() {
  const tokenData = getCookie('exact_auth_token');
  if (!tokenData) return null;
  
  try {
    const parsedToken = JSON.parse(tokenData);
    if (Date.now() >= parsedToken.expires_at) {
      return null; // Token has expired
    }
    return parsedToken;
  } catch (error) {
    console.error('Error parsing token data:', error);
    return null;
  }
}

export function removeAuthToken() {
  setCookie('exact_auth_token', '', -1);
}

export async function getUserInfo(token: string) {
  try {
    const response = await fetch(EXACT_USER_INFO_URL, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.status === 401) {
      const tokenData = getAuthToken();
      if (tokenData && tokenData.refresh_token) {
        const newTokenData = await refreshToken(tokenData.refresh_token);
        return getUserInfo(newTokenData.access_token);
      } else {
        throw new Error('Token expired and no refresh token available');
      }
    }
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error fetching user info:', errorData);
      throw new Error('Failed to fetch user info');
    }
    
    return response.json();
  } catch (error) {
    console.error('Unexpected error in getUserInfo:', error);
    throw error;
  }
}

export async function refreshToken(refreshToken: string) {
  const response = await fetch(EXACT_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
      client_id: PUBLIC_EXACT_CLIENT_ID,
      client_secret: PUBLIC_EXACT_CLIENT_SECRET
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error refreshing token:', errorData);
    throw new Error('Failed to refresh token');
  }

  const tokenData = await response.json();
  setAuthToken(tokenData);
  return tokenData;
}