import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import generateStatsPrompt from '../generate-stats-prompt';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export async function POST(request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    const username = session.user.email;

    const { name,
        description,
        image } = await request.json();

    const {
        speed,
        strength,
        charisma,
        intelligence,
        luck,
        willpower } = await generateStatsPrompt(name, description);

    try {
        if (!username || !name || !description) throw new Error('Missing required fields');
        await sql`INSERT INTO Characters (username, name, description, image, speed, strength, charisma, intelligence, luck, willpower) VALUES (${username}, ${name}, ${description}, ${image}, ${speed}, ${strength}, ${charisma}, ${intelligence}, ${luck}, ${willpower});`;
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }

    const characters = await sql`SELECT * FROM Characters;`;
    return NextResponse.json({ characters }, { status: 200 });
}