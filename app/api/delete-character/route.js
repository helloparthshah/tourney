import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export async function POST(request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    const username = session.user.email;
    const { id } = await request.json();

    try {
        if (!username || !id) throw new Error('Missing required fields');
        const deleteResult = await sql`DELETE FROM Characters WHERE username = ${username} and id = ${id}`;
        if (deleteResult.rowCount === 0) {
            throw new Error('Character not found');
        }
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(true, { status: 200 });
}
