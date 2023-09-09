"use client"

import Characters from "@/components/characters"
import { Button, Container } from "react-bootstrap"
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
          <p>Once a battle is complete, you can view the fight by clicking on &quot;Match Details&quot;.</p>
          <p>You can replay battles by clicking on &quot;Play Match&quot; after the results are displayed.</p>
          <p>You can autoplay matches through the &quot;Play All Matches&quot; button</p>
          <p>Have fun!</p>
          <div className="mt-3 d-flex flex-column justify-content-center align-items-center gap-3">
            <Button variant="secondary" onClick={() => signIn()}>Sign In</Button>
            <Button variant="secondary" href="/tourney">
              Tourney
            </Button>
            <Button variant="danger" href="https://github.com/helloparthshah/tourney/issues/new">
              Report a Bug
            </Button>
          </div>
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
