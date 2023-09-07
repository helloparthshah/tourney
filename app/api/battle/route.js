import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

async function getCharacter(username, name) {
    const characters = await sql`SELECT * FROM Characters WHERE username = ${username} AND name = ${name};`;
    return characters.rows[0];
}

export async function POST(request) {
    const { username,
        p1,
        p2 } = await request.json();
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

    const promptString = `Give me a funny anime style battle between two characters. Use these descriptions to help you decide what happens in the battle. There should be only one victor. Rely mostly on the descriptions to determine who wins.
p1 name: 'Rishabh'
description: Rishabh is a toxic guy whose personality is loving Atharav
speed: 5
strength: 3
charisma: 0
intelligence: 2
luck: 2
willpower: 2
p2: name: 'Atharav'
description: Atharav is a lazy plagiarist with a zero across all the stats.
speed: 0
strength: 0
charisma: 0
intelligence: 0
luck: 0
willpower: 0
output: winner: Atharav
description: The battleground was a desolate wasteland, a twisted realm that seemed to reflect the inner turmoil of those who entered it. Rishabh and Atharav stood facing each other, the tension in the air palpable. The sky overhead was a sickly shade of green, casting an eerie glow on the barren landscape. This was the stage for their one-round battle to the death.

Rishabh, a toxic and conflicted soul, was a bundle of contradictions. He had an overwhelming love for Atharav, but he had also been consumed by a twisted sense of loyalty that bordered on obsession. His eyes, once full of warmth, were now clouded with confusion and anger.

On the other hand, Atharav, the lazy plagiarist with abysmal stats, appeared utterly unprepared for the battle. His posture was slouched, and his eyes drooped with indifference. His lack of motivation was evident in every aspect of his being.

The battle began, and Atharav made no move, standing like a statue. Rishabh, torn between his love and his desire to win, hesitated. He wanted to defeat Atharav, but at the same time, he couldn't bear to harm the object of his affection.

Atharav remained motionless, watching Rishabh with a blank expression. He didn't even attempt to defend himself. Rishabh, unable to bring himself to attack, shouted, "Why won't you fight back, Atharav? I love you, but I need to win this battle!"

But Atharav continued to stand there, his indifference unwavering. Rishabh couldn't bring himself to harm the person he loved, and so, the battle ended without a single blow being struck. Atharav had won, not through strength or skill, but through Rishabh's unwavering love and his inability to harm the one he cared for.

As the green-hued sky loomed overhead, Atharav's lazy victory served as a grim reminder of the complexity of human emotions and the power they held even in the most dire of situations.
p1 name: 'Rishabh'
description: Rishabh is a toxic guy whose personality is loving Atharav
speed: 5
strength: 3
charisma: 0
intelligence: 2
luck: 2
willpower: 2
p2: name: 'Shaivya'
description: Dumb ceo of ocean designograph who is part of the company only because his father owns it
speed: 0
strength: 0
charisma: 5
intelligence: 2
luck: 5
willpower: 3
output: winner: 'Rishabh'
description: The arena was a vast, dusty coliseum, its sand stained crimson by the countless battles that had taken place within its confines. The crowd roared with anticipation as two fighters prepared to clash in a one-round battle to the death. On one side stood Rishabh, a toxic and cunning warrior, his personality tainted by his love for Atharav. On the other side was Shaivya, the dim-witted CEO of Ocean Designograph, who had inherited his position solely due to his father's wealth and influence.

The battle commenced with a deafening roar from the crowd. Rishabh, dressed in dark, menacing armor, brandished a wickedly sharp gladiator sword. He circled Shaivya, his eyes filled with malice, taunting him with insults that cut deeper than any blade.

Shaivya, in contrast, stood there bewildered, holding a rusty and oversized trident. He glanced around the arena, confused, as if wondering why he was even there. The crowd's mocking laughter only fueled his frustration.

With a swift and calculated strike, Rishabh lunged at Shaivya, his sword slashing through the air. But in a moment of sheer luck, Shaivya stumbled backward, narrowly avoiding the deadly blade. The crowd gasped in disbelief, as if witnessing a miracle.

Seizing the opportunity, Shaivya awkwardly swung his trident, aiming for Rishabh's chest. It was a clumsy attack, but it caught Rishabh off guard. The trident pierced through Rishabh's armor, causing a spray of blood to paint the arena. Rishabh howled in agony, his arrogance shattered.

In a fit of rage, Rishabh retaliated, striking wildly at Shaivya. But the CEO, fueled by adrenaline and perhaps a stroke of divine intervention, managed to parry Rishabh's blows with surprising agility. Each clash of their weapons sent sparks flying, and the battle raged on.

Despite his initial confusion, Shaivya displayed an unexpected determination. His strikes, though clumsy, began to find their mark, slowly wearing down Rishabh's defenses. Blood oozed from Rishabh's wounds, staining the sand beneath his feet.

As the battle continued, it became evident that Rishabh's overconfidence had cost him dearly. He was now weakened and vulnerable. In a final, desperate attempt, Rishabh lunged at Shaivya with all his remaining strength, but Shaivya managed to sidestep the attack and deliver a powerful blow to Rishabh's back.

Rishabh fell to his knees, his strength drained, and his lifeblood pouring onto the arena floor. The crowd fell silent, stunned by the unexpected turn of events. With one last gasp, Rishabh collapsed, defeated.

In a shocking twist of fate, the dim-witted CEO, Shaivya, emerged victorious in the brutal battle against the toxic warrior Rishabh. The arena erupted in a mix of astonishment and cheers, as the underdog, guided by sheer luck and determination, had triumphed over his formidable opponent.
p1 ${p1Input}
p2: ${p2Input}
output:`;
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
        const winner = result.candidates[0].output.split("\n")[0].replace("winner: ", "").trim().replace(/'/g, "");
        // desription is output from line 2 onwards
        let description = result.candidates[0].output.split("\n")
        description.shift();
        description = description.join("\n").replace("description: ", "").trim();
        return NextResponse.json({ winner, description }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Error parsing output" + JSON.stringify(result) }, { status: 500 });
    }
}