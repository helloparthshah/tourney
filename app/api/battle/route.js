import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

async function getCharacter(username, name) {
    const characters = await sql`SELECT * FROM Characters WHERE username = ${username} AND name = ${name};`;
    return characters.rows[0];
}

export async function POST(request) {
    const { username,
        p1,
        p2,
        winner } = await request.json();
    let p1data = await getCharacter(username, p1);
    let p2data = await getCharacter(username, p2);


    const p1Input = `p1 name: '${p1data.name}'
description: ${p1data.description}
speed: ${p1data.speed}
strength: ${p1data.strength}
charisma: ${p1data.charisma}
intelligence: ${p1data.intelligence}
luck: ${p1data.luck}
willpower: ${p1data.willpower}`;
    const p2Input = `p2 name: '${p2data.name}'
description: ${p2data.description}
speed: ${p2data.speed}
strength: ${p2data.strength}
charisma: ${p2data.charisma}
intelligence: ${p2data.intelligence}
luck: ${p2data.luck}
willpower: ${p2data.willpower}`;

    const promptString = `Orchestrate a funny anime style battle description between these 2 characters. Try to use the descriptions of the characters to make the battle funny, vulgar, and gory. Don't rely on the stats too much. Make sure the winner is ${winner}.
${p1Input}
${p2Input}
Make sure that ${winner} wins.`;

    const body = {
        "prompt":
        {
            "text": promptString
        },
        "temperature": 0.7,
        "top_k": 40,
        "top_p": 0.95,
        "candidate_count": 1,
        "max_output_tokens": 1024,
        "stop_sequences": [],
        "safety_settings": [
            {
                "category": "HARM_CATEGORY_DEROGATORY", "threshold": 4
            },
            {
                "category": "HARM_CATEGORY_TOXICITY", "threshold": 4
            },
            {
                "category": "HARM_CATEGORY_VIOLENCE", "threshold": 4
            },
            {
                "category": "HARM_CATEGORY_SEXUAL", "threshold": 4
            },
            {
                "category": "HARM_CATEGORY_MEDICAL", "threshold": 4
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS", "threshold": 4
            }]
    }


    const result = await fetch(`https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=${process.env.GOOGLE_API_KEY}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        }).then(response => response.json())
        .then(data => {
            return data;
        }).catch((error) => {
            console.error('Error:', error);
            return { error };
        });
    if (result.error) {
        return NextResponse.json({ error: result.error.message }, { status: 500 });
    }
    try {
        // desription is output from line 2 onwards
        // let description = result.candidates[0].output.split("\n")
        // description.shift();
        // description = description.join("\n").replace("description: ", "").trim();
        let description = result.candidates[0].output;
        return NextResponse.json({ winner, description }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Error parsing output" + JSON.stringify(result) }, { status: 500 });
    }
}