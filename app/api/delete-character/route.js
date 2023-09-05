import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request) {
    const { username, id } = await request.json();

    try {
        if (!username || !id) throw new Error('Missing required fields');
        const deleteResult = await sql`DELETE FROM Characters WHERE username = ${username}; and id = ${id}`;
        if (deleteResult.rowCount === 0) {
            throw new Error('Character not found');
        }
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const characters = await sql`SELECT * FROM Characters;`;
    return NextResponse.json({ characters }, { status: 200 });
}
