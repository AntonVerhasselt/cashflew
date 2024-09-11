import fetch from 'node-fetch';
import { insertOne, updateOne, findOne } from './dbOperations';

export const exchangeCodeForTokens = async (code: string) => {
  console.log('Exchanging code for tokens...');
  
  // Decode the authorization code
  const decodedCode = decodeURIComponent(code);

  console.log(`URL: ${process.env.EXACT_API_URL}/oauth2/token`);
  console.log('Request body:', {
    code: decodedCode,
    redirect_uri: process.env.EXACT_REDIRECT_URI,
    grant_type: 'authorization_code',
    client_id: process.env.EXACT_CLIENT_ID,
    client_secret: process.env.EXACT_CLIENT_SECRET,
  });

  const response = await fetch(`${process.env.EXACT_API_URL}/oauth2/token`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    body: new URLSearchParams({
      code: decodedCode,
      redirect_uri: process.env.EXACT_REDIRECT_URI!,
      grant_type: 'authorization_code',
      client_id: process.env.EXACT_CLIENT_ID!,
      client_secret: process.env.EXACT_CLIENT_SECRET!,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error response:', errorText);
    throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
  }

  const tokens = await response.json();
  console.log('Received tokens:', JSON.stringify(tokens, null, 2));
  
  if (tokens.error) {
    console.error('Error in token response:', tokens);
    throw new Error(`Token error: ${tokens.error_description || tokens.error}`);
  }

  await saveTokens(tokens);
  return tokens;
};

export const refreshTokens = async (refreshToken: string) => {
  console.log('Refreshing tokens...');
  const response = await fetch(`${process.env.EXACT_API_URL}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: process.env.EXACT_CLIENT_ID!,
      client_secret: process.env.EXACT_CLIENT_SECRET!,
      grant_type: 'refresh_token',
    }),
  });

  const tokens = await response.json();
  console.log('Received new tokens:', JSON.stringify(tokens, null, 2));
  await updateTokens(refreshToken, tokens);
  return tokens;
};

async function saveTokens(tokens: any) {
  console.log('Saving tokens to database...');
  const { access_token, refresh_token, expires_in } = tokens;
  const expiresAt = new Date(Date.now() + expires_in * 1000);
  
  try {
    await insertOne('tokens', {
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt,
      createdAt: new Date(),
    });
    console.log('Tokens saved successfully');
  } catch (error) {
    console.error('Error saving tokens:', error);
    throw error;
  }
}

async function updateTokens(oldRefreshToken: string, newTokens: any) {
  console.log('Updating tokens in database...');
  const { access_token, refresh_token, expires_in } = newTokens;
  const expiresAt = new Date(Date.now() + expires_in * 1000);

  try {
    const result = await updateOne('tokens', 
      { refreshToken: oldRefreshToken },
      {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt,
        updatedAt: new Date(),
      }
    );
    console.log('Tokens updated successfully:', result);
  } catch (error) {
    console.error('Error updating tokens:', error);
    throw error;
  }
}


