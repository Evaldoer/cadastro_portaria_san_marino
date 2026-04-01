import { NextResponse } from "next/server"
import { readFile, writeFile } from "fs/promises"
import path from "path"

// ================= TIPAGEM =================
interface Entrega {
  id: number
  descricao: string
  quantidade: string
  bloco: string
  apartamento: string
  foto?: string
  data: string
}

interface Visitante {
  id: number
  nome: string
  data: string
}

interface DB {
  visitantes: Visitante[]
  entregas: Entrega[]
}

const dbPath = path.join(process.cwd(), "db.json")

// ================= FUNÇÕES SEGURAS =================
async function getDB(): Promise<DB> {
  try {
    const data = await readFile(dbPath, "utf-8")
    return JSON.parse(data)
  } catch {
    return { visitantes: [], entregas: [] }
  }
}

async function saveDB(data: DB) {
  await writeFile(dbPath, JSON.stringify(data, null, 2))
}

// ================= GET =================
export async function GET() {
  const data = await getDB()
  return NextResponse.json(data.entregas)
}

// ================= POST =================
export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const descricao = formData.get("descricao") as string
    const quantidade = formData.get("quantidade") as string
    const bloco = formData.get("bloco") as string
    const apartamento = formData.get("apartamento") as string
    const foto = formData.get("foto") as File | null

    let fotoPath: string | undefined

    // ================= UPLOAD FOTO =================
    if (foto && foto.size > 0) {
      const bytes = await foto.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const fileName = `${Date.now()}-${foto.name}`
      const uploadPath = path.join(process.cwd(), "public/uploads", fileName)

      await writeFile(uploadPath, buffer)

      fotoPath = `/uploads/${fileName}`
    }

    const data = await getDB()

    const novaEntrega: Entrega = {
      id: Date.now(),
      descricao,
      quantidade,
      bloco,
      apartamento,
      foto: fotoPath,
      data: new Date().toISOString(),
    }

    data.entregas.push(novaEntrega)

    await saveDB(data)

    return NextResponse.json(novaEntrega)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Erro ao salvar entrega" },
      { status: 500 }
    )
  }
}

// ================= DELETE =================
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    const data = await getDB()

    data.entregas = data.entregas.filter((e) => e.id !== id)

    await saveDB(data)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Erro ao excluir entrega" },
      { status: 500 }
    )
  }
}

// ================= PUT =================
export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const data = await getDB()

    const index = data.entregas.findIndex((e) => e.id === body.id)

    if (index === -1) {
      return NextResponse.json(
        { error: "Entrega não encontrada" },
        { status: 404 }
      )
    }

    data.entregas[index] = {
      ...data.entregas[index],
      descricao: body.descricao ?? data.entregas[index].descricao,
      quantidade: body.quantidade ?? data.entregas[index].quantidade,
      bloco: body.bloco ?? data.entregas[index].bloco,
      apartamento: body.apartamento ?? data.entregas[index].apartamento,
    }

    await saveDB(data)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Erro ao editar entrega" },
      { status: 500 }
    )
  }
}