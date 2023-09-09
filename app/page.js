"use client"

import Characters from "@/components/characters"
import { Container } from "react-bootstrap"
import { useSession, signIn, signOut } from "next-auth/react"

export default function Home() {
  const { data: session } = useSession()

  return (
    <Container>
      <center className="mt-5 mb-5">
        <h1 style={{ fontWeight: "bold" }}>
          Storyline Showdowns
        </h1>
        <p>Storyline Showdowns is a game where you can pit your characters against each other in a battle of wits and strength.</p>
        <p>It uses Natural Language Processing (Google PaLM 2 API) to create a story based on the characters&apos; descriptions and stats.</p>
        <p>It is currently in development.</p>

        <div className="mt-5 mb-5">
          <h2>Instructions</h2>
          <p>Sign in with your Google account to create characters.</p>
          <p>Once you have created characters, you can pit them against each other in a battle in the Tourney tab.</p>
          <p>Once a battle is complete, you can view the fight by clicking on "Match Details".</p>
          <p>You can replay battles by clicking on "Play Match" after the results are displayed.</p>
          <p>You can autoplay matches through the "Play All Matches" button</p>
          <p>Have fun!</p>
        </div>
      </center>
      {session ? (
        <Characters />
      ) : (
        null
      )}
    </Container>
  )
}
