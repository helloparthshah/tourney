import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export async function POST(request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    const { p1, p2 } = await request.json();
    // start both players with 100 health
    // use willpower to multiply health by a factor of 10/(15-willpower)
    let p1Health = 100 * (10 / (15 - p1.willpower));
    let p2Health = 100 * (10 / (15 - p2.willpower));

    // underdog bonus for the weaker player based on difference in all stats
    let p1Total = p1.strength + p1.speed + p1.luck + p1.intelligence + p1.willpower;
    let p2Total = p2.strength + p2.speed + p2.luck + p2.intelligence + p2.willpower;
    let underdogFactor = 1 + Math.abs(p1Total - p2Total) / 60;
    let difference = Math.abs(p1Total - p2Total);
    const threshold = Math.min(p1Total, p2Total);

    if (p1Total === 0 || p2Total === 0) {
        let winPercent = Math.random() < 0.005;
        if (winPercent) {
            return NextResponse.json({
                winner: p1Total === 0 ? p1 : p2,
            });
        }
    }
    if (p1Total > p2Total && difference > threshold) {
        p1.strength *= underdogFactor;
        p1.speed *= underdogFactor;
        p1.luck *= underdogFactor;
        p1.intelligence *= underdogFactor;
        p1.willpower *= underdogFactor;
    } else if (p2Total > p1Total && difference > threshold) {
        p2.strength *= underdogFactor;
        p2.speed *= underdogFactor;
        p2.luck *= underdogFactor;
        p2.intelligence *= underdogFactor;
        p2.willpower *= underdogFactor;
    }

    console.log(p1, p2);

    // while both players have health
    const MAX_ROUNDS = 100;
    let numRounds = 0;
    while (p1Health > 0 && p2Health > 0 && numRounds < MAX_ROUNDS) {
        numRounds++;
        // use speed to determine who goes first based on probability
        let p1First = p1.speed / (p1.speed + p2.speed + 1) > Math.random();
        if (p1First) {
            // use strength to determine damage
            // use luck to determine if damage is doubled based on a random number
            // use intelligence to determine if damage is halved based on a random number
            p2Health -= p1.strength * (p1.luck / 10 > Math.random() ? 2 : 1) * (p1.intelligence / 10 > Math.random() ? 0.5 : 1);
        } else {
            p1Health -= p2.strength * (p2.luck / 10 > Math.random() ? 2 : 1) * (p2.intelligence / 10 > Math.random() ? 0.5 : 1);
        }
    }
    return NextResponse.json({
        winner: p1Health > 0 ? p1 : p2,
    });
}

