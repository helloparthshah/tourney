import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import generateStatsPrompt from '../generate-stats-prompt';

export async function POST(request) {
    const { username,
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

    const characters = await sql`SELECT * FROM Characters;`;
    return NextResponse.json({ characters }, { status: 200 });
}