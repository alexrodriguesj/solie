"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "enviando" | "erro";

export function ConfirmarClient() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");
  const [status, setStatus] = useState<Status>("idle");

  async function handleConfirm() {
    if (!token || status === "enviando") return;
    setStatus("enviando");
    try {
      const res = await fetch("/api/newsletter/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = (await res.json().catch(() => null)) as { status?: string } | null;
      if (res.ok && data?.status === "confirmed") {
        router.push("/newsletter/confirmado");
      } else {
        router.push("/newsletter/erro");
      }
    } catch {
      setStatus("erro");
    }
  }

  if (!token) {
    return (
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-solie-green mb-4">
          Link inválido
        </h1>
        <p className="text-lg text-foreground/70">Faça o cadastro de novo.</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h1 className="text-3xl md:text-4xl font-serif font-bold text-solie-green mb-4">
        Confirme seu cadastro
      </h1>
      <p className="text-lg text-foreground/70 mb-8">
        Clique no botão abaixo para concluir sua inscrição na newsletter da Soliê.
      </p>
      <Button
        variant="primary"
        size="lg"
        onClick={handleConfirm}
        disabled={status === "enviando"}
      >
        {status === "enviando" ? "Confirmando..." : "Confirmar cadastro"}
      </Button>
      {status === "erro" && (
        <p className="mt-4 text-sm text-red-600">
          Não foi possível confirmar agora. Tente de novo em instantes.
        </p>
      )}
    </div>
  );
}
