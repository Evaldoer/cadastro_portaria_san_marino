import { NextResponse } from "next/server"

interface Visitante {
  id: number
  data: string
  [key: string]: string | number | boolean
}

let visitantes: Visitante[] = []

export async function GET() {
  return NextResponse.json(visitantes)
}

export async function POST(req: Request) {
  const body = await req.json()
  const novo = { id: Date.now(), ...body, data: new Date().toISOString() }
  visitantes.push(novo)
  return NextResponse.json(novo)
}