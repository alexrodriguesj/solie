"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, Clock, Users, MessageCircle, Loader2, User, Phone, Target, ChevronRight, ChevronLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { siteConfig, ctaFinal } from "@/data/content";
import { formatWhatsAppLink } from "@/lib/utils";

// URL da planilha publicada como CSV (aba "agenda" - gid=0)
const SHEET_URL = "https://docs.google.com/spreadsheets/d/1r5rfUjJdxYfLcjqnl13mwxvpkTdo7UtCHDVHtEOqTE0/export?format=csv&gid=0";

// URL do Google Apps Script para salvar contatos
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwFr02SHDm5KG36dG0qB7yUar_nEcXwPXEc5cXM2RcGZXx7ZYNb_BXBw7z23avmhjE/exec";

interface Horario {
  data: string; // formato DD/MM/YYYY
  horario: string;
  vagas: number;
}

const diasSemanaMap: Record<number, string> = {
  0: "Domingo",
  1: "Segunda",
  2: "Terça",
  3: "Quarta",
  4: "Quinta",
  5: "Sexta",
  6: "Sábado",
};

// Gera as datas da semana (segunda a sábado)
// Se hoje for domingo, mostra a próxima semana
function getProximasDatas() {
  const datas: { dia: string; data: Date; label: string; passado: boolean }[] = [];
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0); // Zera as horas para comparação correta
  const diaSemanaHoje = hoje.getDay();

  // Encontra a segunda-feira
  // Se for domingo (0), avança para a próxima segunda-feira (+1 dia)
  // Caso contrário, volta para a segunda-feira da semana atual
  const segunda = new Date(hoje);
  const diasAteSegunda = diaSemanaHoje === 0 ? 1 : 1 - diaSemanaHoje;
  segunda.setDate(hoje.getDate() + diasAteSegunda);

  // Gera de segunda (1) a sábado (6)
  for (let i = 0; i < 6; i++) {
    const data = new Date(segunda);
    data.setDate(segunda.getDate() + i);
    data.setHours(0, 0, 0, 0);

    const diaSemana = data.getDay();
    const diaNome = diasSemanaMap[diaSemana];
    const dataFormatada = data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });

    datas.push({
      dia: diaNome,
      data: data,
      label: `${diaNome.substring(0, 3)} ${dataFormatada}`,
      passado: data < hoje,
    });
  }

  return datas;
}

const formSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  whatsapp: z.string().min(10, "WhatsApp inválido"),
  objective: z.string().min(1, "Selecione um objetivo"),
});

type FormData = z.infer<typeof formSchema>;

export function Agendamento() {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [proximasDatas] = useState(() => getProximasDatas());
  const [dataSelecionada, setDataSelecionada] = useState<{ dia: string; data: Date; label: string; passado: boolean } | null>(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // Função para buscar horários da planilha
  const fetchHorarios = async () => {
    setLoading(true);

    if (!SHEET_URL) {
      // Dados de exemplo enquanto não tem a planilha
      const dadosExemplo: Horario[] = [];
      const horariosSemana = ["07:00", "08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];
      const horariosSabado = ["08:00", "09:00", "10:00", "11:00"];

      proximasDatas.forEach(item => {
        const dataStr = item.data.toLocaleDateString("pt-BR");
        const isSabado = item.data.getDay() === 6;
        const hrs = isSabado ? horariosSabado : horariosSemana;
        hrs.forEach(h => {
          dadosExemplo.push({
            data: dataStr,
            horario: h,
            vagas: Math.floor(Math.random() * 5)
          });
        });
      });

      setHorarios(dadosExemplo);
      setLoading(false);
      return;
    }

    try {
      // Adiciona timestamp para evitar cache
      const response = await fetch(`${SHEET_URL}&t=${Date.now()}`);
      const text = await response.text();

      const linhas = text.split("\n").slice(1);
      const dados: Horario[] = linhas
        .filter(linha => linha.trim())
        .map(linha => {
          const [data, horario, vagas] = linha.split(/[,\t]/);
          return {
            data: data?.trim() || "",
            horario: horario?.trim() || "",
            vagas: parseInt(vagas?.trim() || "0", 10)
          };
        });

      setHorarios(dados);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Carrega horários na montagem inicial
  useEffect(() => {
    fetchHorarios();
  }, []);

  // Filtra horários do dia selecionado, excluindo horários que já passaram se for hoje
  const horariosDoDia = dataSelecionada
    ? horarios.filter(h => {
        // Verifica se é a data selecionada
        if (h.data !== dataSelecionada.data.toLocaleDateString("pt-BR")) {
          return false;
        }

        // Verifica se a data selecionada é hoje
        const hoje = new Date();
        const isHoje = dataSelecionada.data.toDateString() === hoje.toDateString();

        if (isHoje) {
          // Converte o horário do slot para minutos desde meia-noite
          const [hora, minuto] = h.horario.split(":").map(Number);
          const horarioEmMinutos = hora * 60 + minuto;

          // Hora atual em minutos desde meia-noite
          const agora = hoje.getHours() * 60 + hoje.getMinutes();

          // Só mostra horários que ainda não passaram
          return horarioEmMinutos > agora;
        }

        return true;
      })
    : [];

  const getVagasColor = (vagas: number) => {
    if (vagas === 0) return "bg-gray-200 text-gray-500 cursor-not-allowed";
    if (vagas === 1) return "bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-300";
    if (vagas === 2) return "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-300";
    return "bg-green-100 text-green-700 hover:bg-green-200 border-green-300";
  };

  const getVagasText = (vagas: number) => {
    if (vagas === 0) return "Lotado";
    if (vagas === 1) return "1 vaga";
    return `${vagas} vagas`;
  };

  const onFormSubmit = (data: FormData) => {
    setFormData(data);

    // Salva o contato na planilha (aba "contatos")
    try {
      const contatoData = {
        timestamp: new Date().toLocaleString("pt-BR"),
        nome: data.name,
        whatsapp: data.whatsapp,
        objetivo: data.objective,
      };

      fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contatoData),
      });
    } catch (error) {
      console.error("Erro ao salvar contato:", error);
    }

    setStep(2);
    fetchHorarios(); // Atualiza horários ao ir para etapa 2
  };

  const handleAgendar = () => {
    if (!horarioSelecionado || !formData || !dataSelecionada) return;

    const dataFormatada = dataSelecionada.data.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const mensagem = `Olá! Gostaria de agendar uma aula experimental.

*Nome:* ${formData.name}
*WhatsApp:* ${formData.whatsapp}
*Objetivo:* ${formData.objective}

*Data:* ${dataFormatada}
*Horário:* ${horarioSelecionado}

Por favor, confirme a disponibilidade!`;

    window.open(
      formatWhatsAppLink(siteConfig.whatsapp, mensagem),
      "_blank"
    );
  };

  return (
    <section id="agendamento" className="py-20 bg-solie-green">
      <Container size="md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Agende sua Aula Experimental
          </h2>
          <p className="text-lg text-white/80 max-w-xl mx-auto">
            Preencha seus dados e escolha o melhor horário
          </p>

          {/* Steps Indicator */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className={`flex items-center gap-2 ${step >= 1 ? "text-white" : "text-white/50"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? "bg-white text-solie-green" : "bg-white/30"}`}>
                1
              </div>
              <span className="hidden sm:inline">Seus dados</span>
            </div>
            <div className="w-8 h-0.5 bg-white/30" />
            <div className={`flex items-center gap-2 ${step >= 2 ? "text-white" : "text-white/50"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? "bg-white text-solie-green" : "bg-white/30"}`}>
                2
              </div>
              <span className="hidden sm:inline">Horário</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl max-w-2xl mx-auto">
            {/* Step 1: Form */}
            {step === 1 && (
              <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <User className="w-4 h-4 text-solie-green" />
                    Nome
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register("name")}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-solie-green focus:ring-2 focus:ring-solie-green/20 outline-none transition-all"
                    placeholder="Seu nome completo"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* WhatsApp */}
                <div>
                  <label htmlFor="whatsapp" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <Phone className="w-4 h-4 text-solie-green" />
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    id="whatsapp"
                    {...register("whatsapp")}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-solie-green focus:ring-2 focus:ring-solie-green/20 outline-none transition-all"
                    placeholder="(41) 99999-9999"
                  />
                  {errors.whatsapp && (
                    <p className="text-red-500 text-sm mt-1">{errors.whatsapp.message}</p>
                  )}
                </div>

                {/* Objective */}
                <div>
                  <label htmlFor="objective" className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <Target className="w-4 h-4 text-solie-green" />
                    Qual seu objetivo?
                  </label>
                  <select
                    id="objective"
                    {...register("objective")}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-solie-green focus:ring-2 focus:ring-solie-green/20 outline-none transition-all bg-white"
                  >
                    <option value="">Selecione...</option>
                    {ctaFinal.objectives.map((obj) => (
                      <option key={obj} value={obj}>{obj}</option>
                    ))}
                  </select>
                  {errors.objective && (
                    <p className="text-red-500 text-sm mt-1">{errors.objective.message}</p>
                  )}
                </div>

                {/* Submit */}
                <Button type="submit" variant="primary" size="lg" className="w-full">
                  Próximo: Escolher horário
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </form>
            )}

            {/* Step 2: Calendar */}
            {step === 2 && (
              <div className="space-y-6">
                {/* Back button */}
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-solie-green hover:text-solie-green-dark transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Voltar
                </button>

                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-solie-green" />
                  </div>
                ) : (
                  <>
                    {/* Day Selection */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-5 h-5 text-solie-green" />
                        <span className="font-semibold text-foreground">Escolha o dia</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {proximasDatas.map(item => (
                          <button
                            key={item.label}
                            disabled={item.passado}
                            onClick={() => {
                              if (!item.passado) {
                                setDataSelecionada(item);
                                setHorarioSelecionado(null);
                                fetchHorarios(); // Atualiza horários ao selecionar dia
                              }
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                              item.passado
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed line-through"
                                : dataSelecionada?.label === item.label
                                  ? "bg-solie-green text-white"
                                  : "bg-solie-beige-light text-foreground hover:bg-solie-beige"
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time Selection */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Clock className="w-5 h-5 text-solie-green" />
                        <span className="font-semibold text-foreground">Escolha o horário</span>
                      </div>
                      {!dataSelecionada ? (
                        <p className="text-muted text-center py-4">Selecione um dia primeiro</p>
                      ) : horariosDoDia.length === 0 ? (
                        <p className="text-muted text-center py-4">Nenhum horário disponível para este dia</p>
                      ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                          {horariosDoDia.map(h => (
                            <button
                              key={`${h.data}-${h.horario}`}
                              onClick={() => h.vagas > 0 && setHorarioSelecionado(h.horario)}
                              disabled={h.vagas === 0}
                              className={`p-3 rounded-xl border-2 transition-all ${
                                horarioSelecionado === h.horario
                                  ? "border-solie-green bg-solie-green text-white"
                                  : getVagasColor(h.vagas)
                              }`}
                            >
                              <div className="text-lg font-bold">{h.horario}</div>
                              <div className="text-xs flex items-center justify-center gap-1">
                                <Users className="w-3 h-3" />
                                {getVagasText(h.vagas)}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap justify-center gap-4 text-xs border-t pt-4">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-green-100 border border-green-300"></div>
                        <span className="text-muted">Disponível</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-300"></div>
                        <span className="text-muted">Poucas</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-orange-100 border border-orange-300"></div>
                        <span className="text-muted">Última</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-gray-200"></div>
                        <span className="text-muted">Lotado</span>
                      </div>
                    </div>

                    {/* Summary and Submit */}
                    {horarioSelecionado && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-solie-beige-light rounded-2xl p-4 text-center"
                      >
                        <p className="text-sm mb-3">
                          <strong>{formData?.name}</strong> • {dataSelecionada?.label} às {horarioSelecionado}
                        </p>
                        <Button
                          variant="whatsapp"
                          size="lg"
                          onClick={handleAgendar}
                          className="w-full"
                        >
                          <MessageCircle className="w-5 h-5" />
                          Confirmar pelo WhatsApp
                        </Button>
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
