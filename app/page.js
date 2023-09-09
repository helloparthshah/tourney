"use client"

import Characters from "@/components/characters"
import { Container } from "react-bootstrap"
import { useSession, signIn, signOut } from "next-auth/react"

export default function Home() {
  const { data: session } = useSession()

  return (
    <Container>
      <center className="mt-5 mb-5">
        <h1>HashiHunt Tourney Battles</h1>
        <p>HashiHunt Tourney Battles is a game where you can pit your characters against each other in a battle of wits and strength.</p>
        <p>It uses Natural Language Processing to create a story based on the characters&apos; descriptions and stats.</p>
        <p>It is currently in development.</p>
      </center>
      {session ? (
        <Characters username={session.user.email} />
      ) : (
        null
      )}
    </Container>
  )
}
