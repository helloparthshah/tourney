import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Not authorized' }, { status: 401 });

    const username = session.user.email;
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