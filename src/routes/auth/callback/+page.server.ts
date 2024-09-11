import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { exchangeCodeForTokens } from '$server/authController';
import { getUserInfo } from '$server/userController'; // Add this import

export const load: PageServerLoad = async ({ url }) => {
  const code = url.searchParams.get('code');
  
  if (!code) {
    throw error(400, 'No authorization code found');
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    
    let userInfo = null;
    try {
      userInfo = await getUserInfo(tokens);
    } catch (userInfoError) {
      console.error('Failed to fetch user info:', userInfoError);
      // Continue without user info
    }

    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      userInfo: userInfo,
    };
  } catch (err) {
    console.error('Error during token exchange:', err);
    throw error(500, 'Authentication failed. Please try again.');
  }
};
