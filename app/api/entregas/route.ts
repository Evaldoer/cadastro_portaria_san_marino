import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"

interface Entrega {
  id: number
  descricao: string
  quantidade: string
  bloco: string
  apartamento: string
  foto?: string
  data: string
}

let entregas: Entrega[] = []

export async function GET() {
  return NextResponse.json(entregas)
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const descricao = formData.get("descricao") as string
    const quantidade = formData.get("quantidade") as string
    const bloco = formData.get("bloco") as string
    const apartamento = formData.get("apartamento") as string
    const foto = formData.get("foto") as File | null

    let fotoPath = ""

    // 📸 SALVAR FOTO
    if (foto && foto.size > 0) {
      const bytes = await foto.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const fileName = Date.now() + "-" + foto.name
      const uploadDir = path.join(process.cwd(), "public/uploads")
      const filePath = path.join(uploadDir, fileName)

      await writeFile(filePath, buffer)

      fotoPath = "/uploads/" + fileName
    }

    const novaEntrega: Entrega = {
      id: Date.now(),
      descricao,
      quantidade,
      bloco,
      apartamento,
      foto: fotoPath,
      data: new Date().toISOString()
    }

    entregas.push(novaEntrega)

    console.log("ENTREGA SALVA:", novaEntrega)

    return NextResponse.json(novaEntrega)
  } catch (error) {
    console.error("Erro:", error)
    return NextResponse.json({ error: "Erro ao salvar" }, { status: 500 })
  }
}