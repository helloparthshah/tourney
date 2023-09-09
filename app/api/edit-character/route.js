import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import generateStatsPrompt from '../generate-stats-prompt';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export async function POST(request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    const username = session.user.email;
    const {
        id,
        name,
        description,
        image } = await request.json();
    console.log(username);

    const {
        speed,
        strength,
        charisma,
        intelligence,
        luck,
        willpower } = await generateStatsPrompt(name, description);

    try {
        if (!username || !name || !description) throw new Error('Missing required fields');
        await sql`
        UPDATE Characters
        SET
            name = ${name},
            description = ${description},
            image = ${image},
            speed = ${speed},
            strength = ${strength},
            charisma = ${charisma},
            intelligence = ${intelligence},
            luck = ${luck},
            willpower = ${willpower}
        WHERE id = ${id};
        `;
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(true, { status: 200 });
}