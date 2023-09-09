"use client"

import Characters from "@/components/characters"
import { Container } from "react-bootstrap"
import { useSession, signIn, signOut } from "next-auth/react"

export default function Home() {
  const { data: session } = useSession()

  return (
    <Container>
      <center className="mt-5 mb-5">
        <h1 style={{ fontSize: "7rem", fontWeight: "bold" }}>
          Storyline Showdowns
        </h1>
        <p>Storyline Showdowns is a game where you can pit your characters against each other in a battle of wits and strength.</p>
        <p>It uses Natural Language Processing (Google PaLM 2 API) to create a story based on the characters&apos; descriptions and stats.</p>
        <p>It is currently in development.</p>
      </center>
      {session ? (
        <Characters />
      ) : (
        null
      )}
    </Container>
  )
}
