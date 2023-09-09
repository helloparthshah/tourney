import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    const username = session.user.email;
    return NextResponse.json({ message: 'Hello from the API!' });
    // drop all tables
    try {
        const result =
            await sql`DROP TABLE Characters;`;
        return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}