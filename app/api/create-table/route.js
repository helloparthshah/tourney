import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const result =
            await sql`CREATE TABLE Characters ( id serial,
                username varchar(255) not null,
                name varchar(255) not null,
                description varchar(255) ,
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