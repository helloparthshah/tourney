import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export async function POST(request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    let { p1, p2 } = await request.json();
    // start both players with 100 health
    // use willpower in the range of 0-10 to mke the health range 75 to 125

    let p1Health = 75 + p1.willpower * 5;
    let p2Health = 75 + p2.willpower * 5;

    // underdog bonus for the weaker player based on difference in all stats
    let p1Total = p1.strength + p1.speed + p1.luck + p1.intelligence + p1.willpower;
    let p2Total = p2.strength + p2.speed + p2.luck + p2.intelligence + p2.willpower;
    /* if (p2Total > p1Total) {
        [p1Total, p2Total] = [p2Total, p1Total];
        [p1, p2] = [p2, p1];
    } */
    let underdogFactor = 1 - Math.abs(p1Total - p2Total) / 60;
    let difference = Math.abs(p1Total - p2Total);
    const threshold = Math.min(p1Total, p2Total);

    if (p1Total === 0 || p2Total === 0) {
        let winPercent = Math.random() < 0.01;
        console.log(winPercent);
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

    // console.log(p1, p2);
    let isP1Damage0 = p1.strength == 0;
    let isP2Damage0 = p2.strength == 0;

    // while both players have health
    const MAX_ROUNDS = 100;
    let numRounds = 0;
    while (p1Health > 0 && p2Health > 0 && numRounds < MAX_ROUNDS) {
        numRounds++;
        if (isP1Damage0) {
            p1.strength = Math.random() * 5;
        }
        if (isP2Damage0) {
            p2.strength = Math.random() * 5;
        }
        // use speed to determine who goes first based on probability
        let rollP1 = Math.random() * p1.speed;
        let rollP2 = Math.random() * p2.speed;
        let damageP1 = Math.random() * p1.strength;
        let damageP2 = Math.random() * p2.strength;
        // let p1First = p1.speed / (p1.speed + p2.speed + 1) > Math.random();
        if (rollP1 > rollP2) {
            p2Health -= damageP1 * (p1.luck / 10 > Math.random() ? 2 : 1) * (p2.intelligence / 10 > Math.random() ? 0.5 : 1);
            if (p2Health <= 0) break;
            p1Health -= damageP2 * (p2.luck / 10 > Math.random() ? 2 : 1) * (p1.intelligence / 10 > Math.random() ? 0.5 : 1);
            if (p1Health <= 0) break;
        } else {
            p1Health -= damageP2 * (p2.luck / 10 > Math.random() ? 2 : 1) * (p1.intelligence / 10 > Math.random() ? 0.5 : 1);
            if (p1Health <= 0) break;
            p2Health -= damageP1 * (p1.luck / 10 > Math.random() ? 2 : 1) * (p2.intelligence / 10 > Math.random() ? 0.5 : 1);
            if (p2Health <= 0) break;
        }
    }
    return NextResponse.json({
        winner: p1Health > 0 ? p1 : p2,
    });
}

