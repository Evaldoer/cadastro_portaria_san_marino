"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

// ================= TIPOS =================
type Visitante = {
  id: number
  nome: string
  rg: string
  apartamento: string
  data?: string
}

type Entrega = {
  id: number
  descricao: string
  quantidade: string
  bloco: string
  apartamento: string
  foto?: string
  data?: string
}

// ================= CLOCK =================
function Clock() {
  const [time, setTime] = useState("")
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      )
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return <span>{time}</span>
}

// ================= COMPONENTE =================
export default function Home() {
  const [visitantes, setVisitantes] = useState<Visitante[]>([])
  const [entregas, setEntregas] = useState<Entrega[]>([])

  function formatarData(data?: string) {
    if (!data) return ""
    return new Date(data).toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // ================= VISITANTES =================
  async function carregarVisitantes() {
    const res = await fetch("/api/visitantes", { cache: "no-store" })
    const data = await res.json()
    setVisitantes(data)
  }

  async function registrarVisitante(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const nome = (form.elements.namedItem("nome") as HTMLInputElement).value
    const rg = (form.elements.namedItem("rg") as HTMLInputElement).value
    const apartamento = (form.elements.namedItem("apartamento") as HTMLInputElement).value
    await fetch("/api/visitantes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, rg, apartamento }),
    })
    form.reset()
    await carregarVisitantes()
  }

  async function excluirVisitante(id: number) {
    await fetch("/api/visitantes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    await carregarVisitantes()
  }

  async function editarVisitante(v: Visitante) {
    const nome = prompt("Novo nome:", v.nome)
    if (!nome) return
    await fetch("/api/visitantes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...v, nome }),
    })
    await carregarVisitantes()
  }

  // ================= ENTREGAS =================
  async function carregarEntregas() {
    const res = await fetch("/api/entregas", { cache: "no-store" })
    const data = await res.json()
    setEntregas(data)
  }

  async function registrarEntrega(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const descricao = (form.elements.namedItem("descricao") as HTMLInputElement).value
    const quantidade = (form.elements.namedItem("quantidade") as HTMLInputElement).value
    const bloco = (form.elements.namedItem("bloco") as HTMLInputElement).value
    const apartamento = (form.elements.namedItem("apartamento") as HTMLInputElement).value
    const foto = (form.elements.namedItem("foto") as HTMLInputElement).files?.[0]
    const formData = new FormData()
    formData.append("descricao", descricao)
    formData.append("quantidade", quantidade)
    formData.append("bloco", bloco)
    formData.append("apartamento", apartamento)
    if (foto) formData.append("foto", foto)
    await fetch("/api/entregas", { method: "POST", body: formData })
    form.reset()
    await carregarEntregas()
  }

  async function excluirEntrega(id: number) {
    await fetch("/api/entregas", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    await carregarEntregas()
  }

  async function editarEntrega(e: Entrega) {
    const descricao = prompt("Nova descricao:", e.descricao)
    if (!descricao) return
    await fetch("/api/entregas", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...e, descricao }),
    })
    await carregarEntregas()
  }

  useEffect(() => {
    const init = async () => {
      await Promise.all([carregarVisitantes(), carregarEntregas()])
    }
    init()
  }, [])

  // ================= UI =================
  return (
    <>
      {/* ===== TASKBAR / HEADER ===== */}
      <header className="header">
        {/* Start-button style logo */}
        <span
          style={{
            background: "linear-gradient(135deg,#34b020 30%,#27870d 100%)",
            color: "#fff",
            fontWeight: "bold",
            fontSize: 11,
            padding: "2px 10px",
            borderTop: "2px solid #5de23c",
            borderLeft: "2px solid #5de23c",
            borderRight: "2px solid #145708",
            borderBottom: "2px solid #145708",
            borderRadius: 2,
            userSelect: "none",
            cursor: "default",
            letterSpacing: 0.5,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <span style={{ fontSize: 13 }}>&#9782;</span> Iniciar
        </span>

        {/* Divider */}
        <span
          style={{
            width: 2,
            height: 20,
            background: "linear-gradient(180deg,#0a246a,#6a8fd8)",
            margin: "0 4px",
          }}
        />

        {/* App title button */}
        <span
          style={{
            background: "linear-gradient(180deg,#3669c3 0%,#1b3f9a 100%)",
            color: "#fff",
            fontSize: 11,
            padding: "2px 10px",
            borderTop: "1px solid #6a8fd8",
            borderLeft: "1px solid #6a8fd8",
            borderRight: "1px solid #091e6a",
            borderBottom: "1px solid #091e6a",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <span style={{ fontSize: 12 }}>&#127962;</span> Portaria San Marino
        </span>

        {/* Spacer */}
        <span style={{ marginLeft: "auto" }} />

        {/* System tray clock */}
        <span
          style={{
            background: "rgba(0,0,0,0.25)",
            color: "#fff",
            fontSize: 11,
            padding: "2px 8px",
            borderTop: "1px solid #0a246a",
            borderLeft: "1px solid #0a246a",
            borderRight: "1px solid #6a8fd8",
            borderBottom: "1px solid #6a8fd8",
          }}
        >
          <Clock />
        </span>
      </header>

      {/* ===== DESKTOP AREA ===== */}
      <div className="container">

        {/* WINDOW — Registrar Visitante */}
        <div className="card">
          <h2>Registrar Visitante</h2>
          <form onSubmit={registrarVisitante}>
            <input name="nome" placeholder="Nome completo" required />
            <input name="rg" placeholder="RG" required />
            <input name="apartamento" placeholder="Apartamento" required />
            <button type="submit">OK</button>
          </form>
        </div>

        {/* WINDOW — Registrar Entrega */}
        <div className="card">
          <h2>Registrar Entrega</h2>
          <form onSubmit={registrarEntrega}>
            <input name="descricao" placeholder="Descricao" required />
            <input name="quantidade" placeholder="Quantidade" required />
            <input name="bloco" placeholder="Bloco" required />
            <input name="apartamento" placeholder="Apartamento" required />
            <input name="foto" type="file" />
            <button type="submit">OK</button>
          </form>
        </div>

        {/* WINDOW — Lista de Visitantes */}
        <div className="card">
          <h2>Visitantes Registrados</h2>
          <ul>
            {visitantes.length === 0 && (
              <li style={{ color: "#808080", fontStyle: "italic" }}>
                Nenhum visitante registrado.
              </li>
            )}
            {visitantes.map((v) => (
              <li key={v.id}>
                <strong>Nome:</strong> {v.nome}
                &nbsp;&nbsp;<strong>RG:</strong> {v.rg}
                <br />
                <strong>Ap:</strong> {v.apartamento}
                &nbsp;&nbsp;<strong>Data:</strong> {formatarData(v.data)}
                <div className="actions">
                  <button onClick={() => editarVisitante(v)}>Editar</button>
                  <button onClick={() => excluirVisitante(v.id)}>Excluir</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* WINDOW — Lista de Entregas */}
        <div className="card">
          <h2>Entregas Registradas</h2>
          <ul>
            {entregas.length === 0 && (
              <li style={{ color: "#808080", fontStyle: "italic" }}>
                Nenhuma entrega registrada.
              </li>
            )}
            {entregas.map((e) => (
              <li key={e.id}>
                <strong>Desc:</strong> {e.descricao}
                &nbsp;&nbsp;<strong>Qtd:</strong> {e.quantidade}
                <br />
                <strong>Bloco:</strong> {e.bloco}
                &nbsp;&nbsp;<strong>Ap:</strong> {e.apartamento}
                <br />
                <strong>Data:</strong> {formatarData(e.data)}
                {e.foto && (
                  <div>
                    <Image src={e.foto} width={100} height={100} alt="Foto da entrega" />
                  </div>
                )}
                <div className="actions">
                  <button onClick={() => editarEntrega(e)}>Editar</button>
                  <button onClick={() => excluirEntrega(e.id)}>Excluir</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* ===== STATUS BAR ===== */}
      <footer className="statusbar">
        <span className="statusbar-panel">Pronto</span>
        <span className="statusbar-panel">
          {visitantes.length} visitante(s) &nbsp;|&nbsp; {entregas.length} entrega(s)
        </span>
        <span style={{ marginLeft: "auto" }} className="statusbar-panel">
          Condominio San Marino
        </span>
      </footer>
    </>
  )
}
