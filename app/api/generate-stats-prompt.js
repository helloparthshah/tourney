
export default async function generateStatsPrompt(name, description) {
    const input = "name: " + name + " description: " + description;
    const promptString = `Using the name and description provided, generate 6 attributes from a scale from 0 to 10 for speed, strength, charisma, luck, intelligence, willpower
input: name: "Rishabh" description: "Rishabh is a non-charismatic, unmotivated, toxic guy whose entire personality is loving Atharav."
output: Speed: 5, Strength: 3, Charisma: 0, Luck: 2, Intelligence: 2, Willpower: 2
input: name: "Atharav" description: "Atharav is a lazy plagiarist who has a zero across all the stats"
output: Speed: 0, Strength: 0, Charisma: 0, Luck: 0, Intelligence: 0, Willpower: 0
input: name: "Prem Devanbu" description: "Prem Devanbu is a Distinguished Research Professor on the Faculty of the Computer Science Department at the University of California at Davis. He works in the areas of empirical software engineering, and Software Engineering applications of ML, and co-directs the DECAL Lab with Vladimir Filkov."
output: Speed: 5, Strength: 5, Charisma: 5, Luck: 8, Intelligence: 10, Willpower: 7
input: ${input}
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


    const stats = await fetch(`https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=${process.env.GOOGLE_API_KEY}`,
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
        });
    if (stats.error) {
        return NextResponse.json({ error: stats.error.message }, { status: 500 });
    }
    console.log(stats);

    const statsString = stats.candidates[0].output;
    const statsArray = statsString.split(", ");
    const speed = statsArray[0].split(": ")[1];
    const strength = statsArray[1].split(": ")[1];
    const charisma = statsArray[2].split(": ")[1];
    const luck = statsArray[3].split(": ")[1];
    const intelligence = statsArray[4].split(": ")[1];
    const willpower = statsArray[5].split(": ")[1];

    return {
        speed: speed,
        strength: strength,
        charisma: charisma,
        luck: luck,
        intelligence: intelligence,
        willpower: willpower
    }
}