import fetch from 'node-fetch';

export const getUserInfo = async (tokens: { access_token: string }) => {
  try {
    const response = await fetch(`${process.env.EXACT_API_URL}/v1/current/Me`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user information from Exact API');
    }

    const userInfo = await response.json();
    console.log('User Information:', userInfo);

    // TODO: Implement storing user information and tokens in the database

    return { message: 'User information fetched successfully' };
  } catch (error) {
    console.error('Error fetching user information:', error);
    throw error;
  }
};

