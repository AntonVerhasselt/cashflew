import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { exchangeCodeForTokens } from '$server/authController'; // Adjust this import path as needed

export const load: PageServerLoad = async ({ url }) => {
  const code = url.searchParams.get('code');
  
  if (!code) {
    throw error(400, 'No authorization code found');
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    
    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    };
  } catch (err) {
    console.error('Error during token exchange:', err);
    throw error(500, 'Authentication failed. Please try again.');
  }
};
