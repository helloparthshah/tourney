"use client"

import Characters from "@/components/characters"
import { Container } from "react-bootstrap"

export default function Home() {
  return (
    <Container>
      <h1>Generative Language</h1>
      <p>Generative Language is a web app that uses GPT-3 to generate characters for your tabletop RPGs.</p>
      <p>It is currently in development.</p>
      <Characters username="harshil" />
    </Container>
  )
}
