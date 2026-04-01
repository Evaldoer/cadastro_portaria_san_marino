"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

type Visitante = {
  id: number;
  nome: string;
  rg: string;
  apartamento: string;
  data?: string;
};

type Entrega = {
  id: number;
  descricao: string;
  quantidade: string;
  bloco: string;
  apartamento: string;
  foto?: string;
  data?: string;
};

export default function Home() {
  const [visitantes, setVisitantes] = useState<Visitante[]>([]);
  const [entregas, setEntregas] = useState<Entrega[]>([]);

  // ✅ DATA BRASÍLIA
  function formatarData(data?: string) {
    if (!data) return "";

    return new Date(data).toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // ================= VISITANTES =================
  async function carregarVisitantes() {
    const res = await fetch("/api/visitantes", { cache: "no-store" });
    const data = await res.json();
    setVisitantes(data);
  }

  async function registrarVisitante(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    const nome = (form.elements.namedItem("nome") as HTMLInputElement).value;
    const rg = (form.elements.namedItem("rg") as HTMLInputElement).value;
    const apartamento = (form.elements.namedItem("apartamento") as HTMLInputElement).value;

    await fetch("/api/visitantes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, rg, apartamento }),
    });

    form.reset();
    await carregarVisitantes();
  }

  // ================= ENTREGAS =================
  async function carregarEntregas() {
    const res = await fetch("/api/entregas", { cache: "no-store" });
    const data = await res.json();
    setEntregas(data);
  }

  async function registrarEntrega(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    const descricao = (form.elements.namedItem("descricao") as HTMLInputElement).value;
    const quantidade = (form.elements.namedItem("quantidade") as HTMLInputElement).value;
    const bloco = (form.elements.namedItem("bloco") as HTMLInputElement).value;
    const apartamento = (form.elements.namedItem("apartamento") as HTMLInputElement).value;
    const foto = (form.elements.namedItem("foto") as HTMLInputElement).files?.[0];

    const formData = new FormData();
    formData.append("descricao", descricao);
    formData.append("quantidade", quantidade);
    formData.append("bloco", bloco);
    formData.append("apartamento", apartamento);

    if (foto) formData.append("foto", foto);

    await fetch("/api/entregas", {
      method: "POST",
      body: formData,
    });

    form.reset();
    await carregarEntregas();
  }

  // INIT
  useEffect(() => {
    async function init() {
      await carregarVisitantes();
      await carregarEntregas();
    }
    init();
  }, []);

  return (
    <>
      {/* ✅ HEADER CORRETO */}
      <header className="header">
        🏢 Portaria San Marino
      </header>

      <div className="container">

        {/* VISITANTE */}
        <div className="card">
          <h2>👤 Registrar Visitante</h2>

          <form onSubmit={registrarVisitante}>
            <label>Nome</label>
            <input name="nome" placeholder="Digite o nome" required />

            <label>RG</label>
            <input name="rg" placeholder="Digite o RG" required />

            <label>Apartamento</label>
            <input name="apartamento" placeholder="Ex: 1105" required />

            <button type="submit">Registrar</button>
          </form>
        </div>

        {/* ENTREGA */}
        <div className="card">
          <h2>📦 Registrar Entrega</h2>

          <form onSubmit={registrarEntrega}>
            <label>Descrição</label>
            <input name="descricao" placeholder="Ex: Pizza, Encomenda" required />

            <label>Quantidade</label>
            <input name="quantidade" placeholder="Ex: 1" required />

            <label>Bloco</label>
            <input name="bloco" placeholder="Ex: A, B, C" required />

            <label>Apartamento</label>
            <input name="apartamento" placeholder="Ex: 1508" required />

            <label>📸 Foto da encomenda</label>
            <input name="foto" type="file" />

            <button type="submit">Registrar</button>
          </form>
        </div>

        {/* LISTA VISITANTES */}
        <div className="card">
          <h2>📋 Visitantes</h2>

          <ul>
            {visitantes.length === 0 ? (
              <li>Carregando visitantes...</li>
            ) : (
              visitantes.map((v) => (
                <li key={v.id}>
                  👤 {v.nome} - RG: {v.rg}
                  <br />
                  🏠 Ap {v.apartamento}
                  <br />
                  🕒 {formatarData(v.data)}
                </li>
              ))
            )}
          </ul>
        </div>

        {/* LISTA ENTREGAS */}
        <div className="card">
          <h2>📦 Entregas</h2>

          <ul>
            {entregas.length === 0 ? (
              <li>Carregando entregas...</li>
            ) : (
              entregas.map((e) => (
                <li key={e.id}>
                  📦 {e.descricao} - {e.quantidade} un
                  <br />
                  🏢 Bloco {e.bloco} Ap {e.apartamento}
                  <br />
                  🕒 {formatarData(e.data)}

                  {e.foto && (
                    <Image
                      src={e.foto}
                      width={100}
                      height={100}
                      alt="Foto"
                      style={{ marginTop: 8, borderRadius: 6 }}
                    />
                  )}
                </li>
              ))
            )}
          </ul>
        </div>

      </div>
    </>
  );
}