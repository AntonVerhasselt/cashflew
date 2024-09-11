import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const client = new MongoClient(process.env.MONGO_URI || '');
const db = client.db(process.env.DB_NAME);
const users = db.collection('users');

export const POST: RequestHandler = async ({ request }) => {
    try {
        const userData = await request.json();
        const newUser = {
            _id: new ObjectId(),
            ...userData,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await users.insertOne(newUser);
        return json({ message: 'User created successfully', user: newUser }, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);
        return json({ error: 'Failed to create user' }, { status: 500 });
    }
};

export const PUT: RequestHandler = async ({ request }) => {
    try {
        const { _id, createdAt, ...updateData } = await request.json();
        if (!_id) {
            return json({ error: 'User ID is required' }, { status: 400 });
        }

        const result = await users.updateOne(
            { _id: new ObjectId(_id) },
            { 
                $set: { ...updateData, updatedAt: new Date() }
            }
        );

        if (result.matchedCount === 0) {
            return json({ error: 'User not found' }, { status: 404 });
        }

        return json({ message: 'User updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error updating user:', error);
        return json({ error: 'Failed to update user' }, { status: 500 });
    }
};
