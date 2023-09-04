"use client"
import Sidebar from '@/components/sidebar';
import { SingleEliminationBracket, Match, MATCH_STATES, SVGViewer } from '@g-loot/react-tournament-brackets';
import { useWindowSize } from '@uidotdev/usehooks';
import { useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';

export default function Brackets() {
    const size = useWindowSize();
    const finalWidth = Math.max(size.width - 50, 500);
    const finalHeight = Math.max(size.height - 100, 500);
    const [username, setUsername] = useState("harhsil");
    const [allCharacters, setAllCharacters] = useState([]);
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [characters, setCharacters] = useState([]);

    const [matches, setMatches] = useState([]);

    useEffect(() => {
        fetch(`/api/getcharacters?username=${username}`)
            .then(response => response.json())
            .then(data => {
                setAllCharacters(data);
                setSelectedCharacter(data[0]);
            });
    }, [username]);

    useEffect(() => {
        if (characters.length < 1) return;
        // remove last character
        let newMatches = [];
        let id = 0;
        let nMatches = 0;
        if (characters.length % 2 === 0) {
            nMatches = characters.length - 1;
        } else {
            nMatches = characters.length;
        }
        let totalRounds = Math.ceil(Math.log2(nMatches));
        let cRound = totalRounds;
        console.log("nMatches: " + nMatches);
        console.log("cRound: " + cRound);
        while (cRound > 1) {
            let nMatchesInRound = Math.pow(2, totalRounds - cRound + 1);
            let round = [];
            for (let i = 0; i < nMatchesInRound; i += 2) {
                id++;
                if (i + 1 < nMatchesInRound) {
                    round.push({
                        id: id,
                        name: "Round " + (cRound) + " - Match " + (Math.floor(i / 2) + 1),
                        nextMatchId: totalRounds == cRound ? null : Math.floor(id / 2),
                        tournamentRoundText: (cRound).toString(),
                        state: MATCH_STATES.SCORE_DONE,
                        participants: [
                            {
                                id: 0,
                                resultText: null,
                                isWinner: false,
                                status: null,
                                name: "TBA",
                            },
                            {
                                id: 0,
                                resultText: null,
                                isWinner: false,
                                status: null,
                                name: "TBA",
                            }
                        ],
                    });
                } else {
                    round.push({
                        id: id,
                        name: "Round " + (cRound) + " - Match " + (Math.floor(i / 2) + 1),
                        nextMatchId: totalRounds == cRound ? null : Math.floor(id / 2),
                        tournamentRoundText: (cRound).toString(),
                        state: MATCH_STATES.WALK_OVER,
                        participants: [
                            {
                                id: cRound == 1 ? characters[i].id : 0,
                                resultText: null,
                                isWinner: false,
                                name: "TBA",
                            },
                        ],
                    });
                }
            }
            newMatches = [...round, ...newMatches];
            cRound--;
        }

        for (let i = 0; i < characters.length; i += 2) {
            id++;
            if (i + 1 < characters.length) {
                newMatches.push({
                    id: id,
                    name: "Round 1 - Match " + (Math.floor(i / 2) + 1),
                    nextMatchId: totalRounds == cRound ? null : Math.floor(id / 2),
                    tournamentRoundText: '1',
                    state: MATCH_STATES.SCORE_DONE,
                    participants: [
                        {
                            id: characters[i].id,
                            resultText: null,
                            isWinner: false,
                            status: null,
                            name: characters[i].name,
                        },
                        {
                            id: characters[i + 1].id,
                            resultText: null,
                            isWinner: false,
                            status: null,
                            name: characters[i + 1].name,
                        }
                    ],
                });
            } else {
                console.log("i: " + i);
                console.log("characters[i]: " + characters[i]);
                newMatches.push({
                    id: id,
                    name: "Round 1 - Match " + (Math.floor(i / 2) + 1),
                    nextMatchId: Math.floor(id / 2),
                    tournamentRoundText: '1',
                    state: MATCH_STATES.WALK_OVER,
                    participants: [
                        {
                            id: characters[i].id,
                            resultText: null,
                            isWinner: false,
                            name: characters[i].name,
                        },
                    ],
                });
            }
        }
        console.log(newMatches);
        setMatches(newMatches);
    }, [characters]);
    return (
        <>
            {/* <Sidebar /> */}
            <Container>
                {matches.length > 0 &&
                    <SingleEliminationBracket
                        matches={matches}
                        onMatchClick={(match) => {
                            console.log(match.match);
                            fetch('/api/battle', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    username: username,
                                    p1: match.match.participants[0].name,
                                    p2: match.match.participants[1].name,
                                }),
                            })
                                .then(response => response.json())
                                .then(data => {
                                    console.log(data);
                                    let winner = data.winner;
                                    let winnerCharacter = characters.find((character) => character.name.includes(winner));
                                    let description = data.description;
                                    let newMatches = [...matches];
                                    let newMatch = newMatches.find((m) => m.id == match.match.id);
                                    // make winner name resultText and isWinner true
                                    newMatch.participants.forEach((participant) => {
                                        if (participant.name == winnerCharacter.name) {
                                            participant.resultText = "Win";
                                            participant.isWinner = true;
                                        }
                                    });
                                    // make loser name resultText and isWinner false
                                    newMatch.participants.forEach((participant) => {
                                        if (participant.name != winnerCharacter.name) {
                                            participant.resultText = "Loss";
                                            participant.isWinner = false;
                                        }
                                    });
                                    // set match state to done
                                    newMatch.state = MATCH_STATES.SCORE_DONE;
                                    // set match description
                                    newMatch.description = description;
                                    // set match
                                    newMatches.find((m) => m.id == newMatch.id).participants = newMatch.participants;
                                    // set next match
                                    if (newMatch.nextMatchId != null) {
                                        let nextMatch = newMatches.find((m) => m.id == newMatch.nextMatchId);
                                        console.log(nextMatch);
                                        // set next match participant whatever is empty
                                        for (let i = 0; i < nextMatch.participants.length; i++) {
                                            if (nextMatch.participants[i].id == 0) {
                                                nextMatch.participants[i].id = winnerCharacter.id;
                                                nextMatch.participants[i].name = winnerCharacter.name;
                                                break;
                                            }
                                        }
                                        newMatches.find((m) => m.id == newMatch.nextMatchId).participants = nextMatch.participants;
                                    }
                                    console.log(newMatches);
                                    setMatches(newMatches);
                                });
                        }}
                        matchComponent={Match}
                        svgWrapper={({ children, ...props }) => (
                            <SVGViewer width={finalWidth} height={finalHeight} {...props}>
                                {children}
                            </SVGViewer>
                        )}
                    />
                }
                <Container>
                    <Form.Select aria-label="Default select example" onChange={(e) => {
                        setSelectedCharacter(allCharacters.find((character) => character.id == e.target.value));
                    }}>
                        {allCharacters.map((character) => {
                            return <option value={character.id}>{character.name}</option>
                        })}
                    </Form.Select>
                    <Button variant="primary" onClick={() => {
                        setCharacters([...characters, selectedCharacter]);
                    }}>Add Characters</Button>
                </Container>
            </Container>
        </>
    );
}