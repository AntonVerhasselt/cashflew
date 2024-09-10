import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { insertOne, findOne, updateOne } from '$lib/dbOperations';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const userData = await request.json();
    const existingUser = await findOne('users', { sub: userData.sub });

    if (existingUser) {
      await updateOne('users', { sub: userData.sub }, userData);
      return json({ success: true, id: existingUser._id.toString() });
    } else {
      const result = await insertOne('users', userData);
      return json({ success: true, id: result.insertedId.toString() });
    }
  } catch (error) {
    console.error('Error creating/updating user:', error);
    return json({ success: false, error: 'Error creating/updating user' }, { status: 500 });
  }
};

export const GET: RequestHandler = async ({ url }) => {
  const sub = url.searchParams.get('sub');
  if (!sub) {
    return json({ error: 'Missing sub parameter' }, { status: 400 });
  }

  try {
    const user = await findOne('users', { sub });
    return json({ user });
  } catch (error) {
    console.error('Error finding user:', error);
    return json({ error: 'Error finding user' }, { status: 500 });
  }
};
