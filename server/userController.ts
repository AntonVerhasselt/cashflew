import fetch from 'node-fetch';
import { insertOne, updateOne, findOne } from './dbOperations';

export const getUserInfo = async (tokens: { access_token: string }) => {
  try {
    const response = await fetch(`${process.env.EXACT_API_URL}/v1/current/Me`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${tokens.access_token}`,
        'Accept': 'application/json'
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Unexpected response type:', contentType);
      console.error('Response body:', text);
      throw new Error('API did not return JSON');
    }

    const userInfo = await response.json();
    console.log('User Information:', userInfo);

    await saveUserInfo(userInfo);

    return userInfo; // Return the actual user info instead of a message
  } catch (error) {
    console.error('Error fetching user information:', error);
    throw error;
  }
};

async function saveUserInfo(userInfo: any) {
  console.log('Saving user information to database...');
  
  try {
    const existingUser = await findOne('users', { id: userInfo.id });

    if (existingUser) {
      await updateOne('users',
        { id: userInfo.id },
        {
          ...userInfo,
          updatedAt: new Date(),
        }
      );
      console.log('User information updated successfully');
    } else {
      await insertOne('users', {
        ...userInfo,
        createdAt: new Date(),
      });
      console.log('User information saved successfully');
    }
  } catch (error) {
    console.error('Error saving user information:', error);
    throw error;
  }
}

