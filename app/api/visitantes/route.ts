import { NextResponse } from "next/server"
import { readFile, writeFile } from "fs/promises"
import path from "path"

// ✅ TIPAGEM CORRETA
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

// ================= GET =================
export async function GET() {
  try {
    const data: DB = JSON.parse(await readFile(filePath, "utf-8"))
    return NextResponse.json(data.visitantes)
  } catch {
    return NextResponse.json([])
  }
}

// ================= POST =================
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data: DB = JSON.parse(await readFile(filePath, "utf-8"))

    const novo: Visitante = {
      id: Date.now(),
      nome: body.nome,
      rg: body.rg,
      apartamento: body.apartamento,
      data: new Date().toISOString()
    }

    data.visitantes.push(novo)

    await writeFile(filePath, JSON.stringify(data, null, 2))

    return NextResponse.json(novo)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro ao salvar visitante" }, { status: 500 })
  }
}

// ================= DELETE =================
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    const data: DB = JSON.parse(await readFile(filePath, "utf-8"))

    data.visitantes = data.visitantes.filter((v) => v.id !== id)

    await writeFile(filePath, JSON.stringify(data, null, 2))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro ao excluir" }, { status: 500 })
  }
}

// ================= PUT (EDITAR) =================
export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const data: DB = JSON.parse(await readFile(filePath, "utf-8"))

    const index = data.visitantes.findIndex((v) => v.id === body.id)

    if (index !== -1) {
      data.visitantes[index] = {
        ...data.visitantes[index],
        nome: body.nome ?? data.visitantes[index].nome,
        rg: body.rg ?? data.visitantes[index].rg,
        apartamento: body.apartamento ?? data.visitantes[index].apartamento
      }

      await writeFile(filePath, JSON.stringify(data, null, 2))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro ao editar" }, { status: 500 })
  }
}