import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    try {
        // get all characters for the user ordered by last updated
        const result =
            await sql`select * from Characters where username = ${username} order by id desc;`;
        const characters = result['rows'];
        return NextResponse.json(characters, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}