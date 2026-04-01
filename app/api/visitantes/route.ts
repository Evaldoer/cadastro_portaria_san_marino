import { NextResponse } from "next/server"
import { readFile, writeFile } from "fs/promises"
import path from "path"

// ================= TIPAGEM =================
interface Visitante {
  id: number
  nome: string
  rg: string
  apartamento: string
  data: string
}

interface Entrega {
  id: number
  descricao: string
  data: string
}

interface DB {
  visitantes: Visitante[]
  entregas: Entrega[]
}

const filePath = path.join(process.cwd(), "db.json")

// ================= DB =================
async function getDB(): Promise<DB> {
  try {
    const data = await readFile(filePath, "utf-8")
    return JSON.parse(data)
  } catch {
    return { visitantes: [], entregas: [] }
  }
}

async function saveDB(data: DB) {
  await writeFile(filePath, JSON.stringify(data, null, 2))
}

// ================= GET =================
export async function GET() {
  const data = await getDB()
  return NextResponse.json(data.visitantes)
}

// ================= POST =================
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = await getDB()

    if (!body?.nome || !body?.rg || !body?.apartamento) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      )
    }

    const novo: Visitante = {
      id: Date.now(),
      nome: body.nome,
      rg: body.rg,
      apartamento: body.apartamento,
      data: new Date().toISOString(),
    }

    data.visitantes.push(novo)
    await saveDB(data)

    return NextResponse.json(novo)
  } catch (error) {
    console.error("POST ERROR:", error)
    return NextResponse.json(
      { error: "Erro ao salvar visitante" },
      { status: 500 }
    )
  }
}

// ================= DELETE (CORRIGIDO) =================
export async function DELETE(req: Request) {
  try {
    const body = await req.json().catch(() => null)

    if (!body?.id) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      )
    }

    const id = Number(body.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID não é válido" },
        { status: 400 }
      )
    }

    const data = await getDB()

    const before = data.visitantes.length
    data.visitantes = data.visitantes.filter((v) => v.id !== id)

    if (data.visitantes.length === before) {
      return NextResponse.json(
        { error: "Visitante não encontrado" },
        { status: 404 }
      )
    }

    await saveDB(data)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE ERROR:", error)
    return NextResponse.json(
      { error: "Erro ao excluir visitante" },
      { status: 500 }
    )
  }
}

// ================= PUT =================
export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const data = await getDB()

    const index = data.visitantes.findIndex((v) => v.id === body.id)

    if (index === -1) {
      return NextResponse.json(
        { error: "Visitante não encontrado" },
        { status: 404 }
      )
    }

    data.visitantes[index] = {
      ...data.visitantes[index],
      nome: body.nome ?? data.visitantes[index].nome,
      rg: body.rg ?? data.visitantes[index].rg,
      apartamento: body.apartamento ?? data.visitantes[index].apartamento,
    }

    await saveDB(data)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("PUT ERROR:", error)
    return NextResponse.json(
      { error: "Erro ao editar visitante" },
      { status: 500 }
    )
  }
}