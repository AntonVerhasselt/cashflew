import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { insertOne, findOne } from '$lib/dbOperations';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const userData = await request.json();
    const result = await insertOne('users', userData);
    return json({ success: true, id: result.insertedId.toString() });
  } catch (error) {
    console.error('Error creating user:', error);
    return json({ success: false, error: 'Error creating user' }, { status: 500 });
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
