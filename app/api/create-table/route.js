import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    const username = session.user.email;
    try {
        const result =
            await sql`CREATE TABLE Characters ( id serial,
                username varchar(255) not null,
                name varchar(255) not null,
                image varchar(255),
                description varchar(255),
                speed INT,
                strength INT,
                charisma INT,
                intelligence INT,
                luck INT,
                willpower INT,
                PRIMARY KEY (username, name));`;
        return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}