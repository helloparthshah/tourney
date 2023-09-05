"use client"

import Sidebar from '@/components/sidebar';
// import { SingleEliminationBracket, Match, MATCH_STATES, SVGViewer } from '@g-loot/react-tournament-brackets';
import { useWindowSize } from '@uidotdev/usehooks';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Button, Container, Form, OverlayTrigger, Popover } from 'react-bootstrap';

if (typeof window !== "undefined" && typeof window.navigator !== "undefined") {
    import("@g-loot/react-tournament-brackets");
}
const SingleEliminationBracket = dynamic(
    () => {
        return import("@g-loot/react-tournament-brackets").then(
            mod => mod.SingleEliminationBracket
        );
    },
    { ssr: false }
);

const Match = dynamic(
    () => {
        return import("@g-loot/react-tournament-brackets").then(mod => mod.Match);
    },
    { ssr: false }
);
const MATCH_STATES = dynamic(
    () => {
        return import("@g-loot/react-tournament-brackets").then(
            mod => mod.MATCH_STATES
        );
    },
    { ssr: false }
);
const SVGViewer = dynamic(
    () => {
        return import("@g-loot/react-tournament-brackets").then(
            mod => mod.SVGViewer
        );
    },
    { ssr: false }
);

const createTheme = dynamic(
    () => {
        return import("@g-loot/react-tournament-brackets").then(
            mod => mod.createTheme
        );
    },
    { ssr: false }
);

export default function Brackets() {
    const size = useWindowSize();
    const finalWidth = Math.max(size.width - 200, 500);
    const finalHeight = Math.max(size.height - 100, 500);
    const [username, setUsername] = useState("harshil");
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
        while (cRound > 1) {
            let nMatchesInRound = Math.pow(2, totalRounds - cRound + 1);
            let round = [];
            for (let i = 0; i < nMatchesInRound; i += 2) {
                id++;
                round.push({
                    id: id,
                    name: "Round " + (cRound) + " - Match " + (Math.floor(i / 2) + 1),
                    nextMatchId: totalRounds == cRound ? null : Math.floor(id / 2),
                    tournamentRoundText: (cRound).toString(),
                    state: null,
                    participants: [
                        {
                            id: null,
                            resultText: null,
                            isWinner: false,
                            status: null,
                            name: null,
                        },
                        {
                            id: null,
                            resultText: null,
                            isWinner: false,
                            status: null,
                            name: null,
                        }
                    ],
                });
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
                    state: null,
                    participants: [
                        {
                            id: characters[i].id,
                            resultText: null,
                            isWinner: false,
                            status: null,
                            name: characters[i].name,
                            description: characters[i].description,
                        },
                        {
                            id: characters[i + 1].id,
                            resultText: null,
                            isWinner: false,
                            status: null,
                            name: characters[i + 1].name,
                            description: characters[i + 1].description,
                        }
                    ],
                });
            } else {
                newMatches.push({
                    id: id,
                    name: "Round 1 - Match " + (Math.floor(i / 2) + 1),
                    nextMatchId: Math.floor(id / 2),
                    tournamentRoundText: '1',
                    state: "WALK_OVER",
                    participants: [
                        {
                            id: characters[i].id,
                            resultText: null,
                            isWinner: false,
                            name: characters[i].name,
                            description: characters[i].description,
                        },
                    ],
                });
            }
        }
        setMatches(newMatches);
    }, [characters]);

    async function playMatch(match) {
        let data = {};
        if (match.state && match.state == "WALK_OVER") {
            data = {
                winner: match.participants[0].name,
                description: "Walkover",
            };
        } else {
            data = await fetch('/api/battle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    p1: match.participants[0].name,
                    p2: match.participants[1].name,
                }),
            })
                .then(response => response.json())
                .then(data => {
                    return data;
                }).catch((error) => {
                    console.error('Error:', error);
                });
        }
        let winner = data.winner;
        let winnerCharacter = characters.find((character) => character.name.toLowerCase().includes(winner.toLowerCase()));
        let description = data.description;
        let newMatches = [...matches];
        let newMatch = newMatches.find((m) => m.id == match.id);
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
        newMatch.state = "DONE";
        // set match description
        newMatch.description = description;
        // set match
        // newMatches.find((m) => m.id == newMatch.id).participants = newMatch.participants;
        // newMatches.find((m) => m.id == newMatch.id).state = newMatch.state;
        // newMatches.find((m) => m.id == newMatch.id).description = newMatch.description;
        console.log(newMatch);
        // set next match
        if (newMatch.nextMatchId != null) {
            let nextMatch = newMatches.find((m) => m.id == newMatch.nextMatchId);
            let participantIndex = newMatch.id % 2;
            nextMatch.participants[participantIndex].id = winnerCharacter.id;
            nextMatch.participants[participantIndex].name = winnerCharacter.name;
            nextMatch.participants[participantIndex].description = winnerCharacter.description;
            newMatches.find((m) => m.id == newMatch.nextMatchId).participants = nextMatch.participants;
        }
        setMatches(newMatches);
    }

    const [selectedMatch, setSelectedMatch] = useState(null);

    return (
        <>
            {/* <Sidebar /> */}
            <Container>
                {matches.length > 0 &&
                    <SingleEliminationBracket
                        matches={matches}
                        matchComponent={
                            ({ match, ...props }) => {
                                return (
                                    <div style={{ position: "relative", overflow: "visible" }}>
                                        <Match
                                            match={match}
                                            {...props}
                                            onMatchClick={async (match) => {
                                                console.log(match.match);
                                                setSelectedMatch(match.match);
                                            }}
                                            onPartyClick={(party) => {
                                                console.log(party);
                                            }}
                                        />
                                        <Button variant="primary"
                                            style={{ zIndex: 2, position: "absolute", top: 0, right: 100 }}
                                            onClick={() => {
                                                playMatch(match);
                                            }}>
                                            {(match.state && match.state == "DONE") ? "Replay Match" : "Play Match"}
                                        </Button>
                                    </div>
                                );
                            }
                        }
                        svgWrapper={({ children, ...props }) => {
                            return (
                                <SVGViewer width={finalWidth} height={finalHeight} {...props}>
                                    {children}
                                </SVGViewer>
                            );
                        }}
                    />
                }
                <Container>
                    <Form.Select aria-label="Default select example" onChange={(e) => {
                        setSelectedCharacter(allCharacters.find((character) => character.id == e.target.value));
                    }}>
                        {allCharacters.map((character) => {
                            return (
                                <option value={character.id} key={character.id}>
                                    {character.name}
                                </option>
                            );
                        })}
                    </Form.Select>
                    <Button variant="primary" onClick={() => {
                        setCharacters([...characters, selectedCharacter]);
                    }}>
                        Add Characters
                    </Button>
                    <Button variant="primary" onClick={() => {
                        // randomize character order from allCharacters

                        let shuffled = allCharacters
                            .map(value => ({ value, sort: Math.random() }))
                            .sort((a, b) => a.sort - b.sort)
                            .map(({ value }) => value)
                        setCharacters(shuffled);
                    }}>
                        Randomize Characters
                    </Button>
                </Container>
                <Container>
                    <h1 className="mb-3"><b>Selected Match</b></h1>
                    {selectedMatch &&
                        <div>
                            <h3>{selectedMatch.name}</h3>
                            <h5>{selectedMatch.participants[0].name ?? ""} vs {selectedMatch.participants[1]?.name ?? ""}</h5>
                            <h5>{selectedMatch.description ?? ""}</h5>
                        </div>
                    }
                </Container>
            </Container>
        </>
    );
}