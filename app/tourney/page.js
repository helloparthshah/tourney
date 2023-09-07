"use client"

import Sidebar from '@/components/sidebar';
// import { SingleEliminationBracket, Match, MATCH_STATES, SVGViewer } from '@g-loot/react-tournament-brackets';
import { useWindowSize } from '@uidotdev/usehooks';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Button, Container, Form, OverlayTrigger, Popover, Spinner } from 'react-bootstrap';

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
    const [username, setUsername] = useState(process.env.TEST_USER);
    const [allCharacters, setAllCharacters] = useState([]);
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [characters, setCharacters] = useState([]);

    const [matches, setMatches] = useState([]);

    useEffect(() => {
        fetch(`/api/getcharacters?username=${username}`)
            .then(response => response.json())
            .then(data => {
                // sort by name
                data.sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });
                setAllCharacters(data);
                setSelectedCharacter(data[0]);
            });
    }, [username]);

    useEffect(() => {
        if (characters.length < 1) {
            setMatches([]);
            return;
        }
        // remove last character
        let newMatches = [];
        let id = 0;
        let nMatches = 0;
        if (characters.length % 2 === 0) {
            nMatches = characters.length - 1;
        } else {
            nMatches = characters.length;
        }
        let totalRounds = nMatches == 1 ? 1 : Math.ceil(Math.log2(nMatches));
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

        let nPlayersInRound = Math.pow(2, totalRounds);
        let nFullMatches = 0;
        if (characters.length > nPlayersInRound / 2) {
            nFullMatches = Math.floor(nPlayersInRound / 2 - (nPlayersInRound % characters.length));
        }
        let charIndex = 0;
        for (let i = 0; i < Math.floor(nPlayersInRound / 2); i++) {
            id++;
            if (i < nFullMatches) {
                newMatches.push({
                    id: id,
                    name: "Round 1 - Match " + (i + 1),
                    nextMatchId: totalRounds == cRound ? null : Math.floor(id / 2),
                    tournamentRoundText: '1',
                    state: "SCHEDULED",
                    participants: [
                        {
                            id: characters[charIndex].id,
                            resultText: null,
                            isWinner: false,
                            status: null,
                            name: characters[charIndex].name,
                            description: characters[charIndex].description,
                        },
                        {
                            id: characters[charIndex + 1].id,
                            resultText: null,
                            isWinner: false,
                            status: null,
                            name: characters[charIndex + 1].name,
                            description: characters[charIndex + 1].description,
                        }
                    ],
                });
                charIndex += 2;
            } else {
                newMatches.push({
                    id: id,
                    name: "Round 1 - Match " + (i + 1),
                    nextMatchId: Math.floor(id / 2),
                    tournamentRoundText: '1',
                    state: "WALK_OVER",
                    participants: [
                        {
                            id: characters[charIndex].id,
                            resultText: null,
                            isWinner: false,
                            name: characters[charIndex].name,
                            description: characters[charIndex].description,
                        },
                    ],
                });
                charIndex += 1;
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
            if (!username) return false;
            if (!match.participants[0].id || !match.participants[1].id) {
                alert("Please play all matches before playing this match");
                return false;
            }
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
                    return {
                        "error": error,
                    }
                });
            console.log(data);
        }
        if (data.error) {
            // alert(data.error);
            return false;
        }
        let newMatches = [...matches];
        let description = data.description;
        // let newMatch = newMatches.find((m) => m.id == match.id);
        let newMatchId = newMatches.findIndex((m) => m.id == match.id);

        let winner = data.winner;

        let winnerCharacter = characters.find((character) => character.name.toLowerCase().includes(winner.toLowerCase()));
        // make winner name resultText and isWinner true
        newMatches[newMatchId].participants.forEach((participant) => {
            if (participant.name == winnerCharacter.name) {
                participant.resultText = "Win";
                participant.isWinner = true;
            }
        });
        // make loser name resultText and isWinner false
        newMatches[newMatchId].participants.forEach((participant) => {
            if (participant.name != winnerCharacter.name) {
                participant.resultText = "Loss";
                participant.isWinner = false;
            }
        });
        // set match state to done
        if (newMatches[newMatchId].state != "WALK_OVER") {
            newMatches[newMatchId].state = "DONE";
        }
        // set match description
        newMatches[newMatchId].description = description;
        // set next match
        if (newMatches[newMatchId].nextMatchId != null) {
            let nextMatchId = newMatches.findIndex((m) => m.id == newMatches[newMatchId].nextMatchId);
            let participants = JSON.parse(JSON.stringify(newMatches[nextMatchId].participants));
            let participantIndex = newMatches[newMatchId].id % 2;
            participants[participantIndex].id = winnerCharacter.id;
            participants[participantIndex].name = winnerCharacter.name;
            participants[participantIndex].description = winnerCharacter.description;
            newMatches[nextMatchId].state = "SCHEDULED"
            newMatches[nextMatchId].participants = participants;
        }
        setMatches(newMatches);
        return true;
    }

    const [allMatchesLoading, setAllMatchesLoading] = useState(false);

    async function playAllMatches() {
        setAllMatchesLoading(true);
        const nRounds = Math.ceil(Math.log2(characters.length));
        for (let i = 1; i <= nRounds; i++) {
            let matchesInRound = matches.filter((match) => match.tournamentRoundText == i.toString());
            await Promise.all(matchesInRound.map(async (match) => {
                setSelectedMatch(match);
                setMatches(matches.map((m) => {
                    if (m.id == match.id) {
                        m.loading = true;
                    }
                    return m;
                }));
                let status = false;
                while (!status) {
                    status = await playMatch(match);
                }
                setMatches(matches.map((m) => {
                    if (m.id == match.id) {
                        m.loading = false;
                    }
                    return m;
                }));
            }));
            console.log("Round " + i + " done");
        }
        setAllMatchesLoading(false);
    }

    const [selectedMatch, setSelectedMatch] = useState(null);

    return (
        <>
            <Container>
                <Container style={{ width: "100%", height: "60vh", overflow: "scroll" }}>
                    {matches.length > 0 &&
                        <SingleEliminationBracket
                            currentRound={1}
                            matches={matches}
                            matchComponent={
                                ({ match, ...props }) => {
                                    return (
                                        <>
                                            <Match
                                                match={match}
                                                {...props}
                                                onMatchClick={async (m) => {
                                                    m.event.preventDefault();
                                                    console.log(m.match);
                                                    setSelectedMatch(m.match);
                                                }}
                                                onPartyClick={(party) => {
                                                    console.log(party);
                                                }}
                                            />
                                            <Button variant=""
                                                style={{ zIndex: 2, position: "absolute", top: -10, left: 0 }}
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    setSelectedMatch(match);
                                                    setMatches(matches.map((m) => {
                                                        if (m.id == match.id) {
                                                            m.loading = true;
                                                        }
                                                        return m;
                                                    }));
                                                    await playMatch(match);
                                                    setMatches(matches.map((m) => {
                                                        if (m.id == match.id) {
                                                            m.loading = false;
                                                        }
                                                        return m;
                                                    }));
                                                }}>
                                                {
                                                    match.loading ? <Spinner animation="border" /> :
                                                        ((match.state && match.state == "DONE") ? "Replay Match" : "Play Match")
                                                }
                                            </Button>
                                        </>
                                    );
                                }
                            }
                        />
                    }
                </Container>
                <Container className="mt-3">
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
                    <div className="mb-3 mt-3 d-flex justify-content-between">
                        <Button variant="primary" onClick={() => {
                            if (characters.find((character) => character.id == selectedCharacter.id)) {
                                alert("Character already added");
                                return;
                            }
                            setCharacters([...characters, selectedCharacter]);
                        }}>
                            Add Characters
                        </Button>
                        <Button variant="primary" onClick={() => {
                            let shuffled = allCharacters
                                .map(value => ({ value, sort: Math.random() }))
                                .sort((a, b) => a.sort - b.sort)
                                .map(({ value }) => value)
                            setCharacters(shuffled);
                        }}>
                            Randomize Characters
                        </Button>
                        <Button variant="danger" onClick={() => {
                            setCharacters([]);
                        }}>
                            Clear Characters
                        </Button>
                        <Button variant="secondary" onClick={() => {
                            playAllMatches();
                        }}>
                            {allMatchesLoading ?
                                <Spinner animation="border" /> :
                                "Play All Matches"}
                        </Button>
                    </div>
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