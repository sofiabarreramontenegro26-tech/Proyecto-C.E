import { useState } from "react";

/**
 * RQF022 — Reporte semanal / mensual
 * Alterna entre vista semanal y mensual, muestra barras simples (sin librerías
 * externas) y un arco-indicador (signature element del módulo) con el avance
 * frente a la meta del periodo.
 */

const DATOS_SEMANAL = [
  { etiqueta: "Lun", valor: 420000 },
  { etiqueta: "Mar", valor: 610000 },
  { etiqueta: "Mié", valor: 380000 },
  { etiqueta: "Jue", valor: 720000 },
  { etiqueta: "Vie", valor: 890000 },
  { etiqueta: "Sáb", valor: 540000 },
  { etiqueta: "Dom", valor: 150000 },
];

const DATOS_MENSUAL = [
  { etiqueta: "Sem 1", valor: 2450000 },
  { etiqueta: "Sem 2", valor: 3120000 },
  { etiqueta: "Sem 3", valor: 2780000 },
  { etiqueta: "Sem 4", valor: 3460000 },
];

const META_SEMANAL = 4000000;
const META_MENSUAL = 14000000;

const formatoCOP = (valor) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(valor);

function ArcoIndicador({ porcentaje }) {
  const pct = Math.min(porcentaje, 100);
  const radio = 54;
  const circunferencia = 2 * Math.PI * radio;
  const recorrido = (pct / 100) * circunferencia;

  return (
    <svg viewBox="0 0 130 130" className="w-32 h-32">
      <circle cx="65" cy="65" r={radio} fill="none" stroke="#1C1B19" strokeWidth="12" />
      <circle
        cx="65"
        cy="65"
        r={radio}
        fill="none"
        stroke="#E8732C"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={`${recorrido} ${circunferencia}`}
        transform="rotate(-90 65 65)"
      />
      <text x="65" y="60" textAnchor="middle" className="fill-[#F2EFE9]" style={{ fontSize: "22px", fontWeight: 700, fontFamily: "monospace" }}>
        {pct.toFixed(0)}%
      </text>
      <text x="65" y="80" textAnchor="middle" className="fill-[#9A958A]" style={{ fontSize: "10px", fontFamily: "monospace" }}>
        de la meta
      </text>
    </svg>
  );
}

export default function ReporteSemanalMensual() {
  const [periodo, setPeriodo] = useState("semanal");

  const datos = periodo === "semanal" ? DATOS_SEMANAL : DATOS_MENSUAL;
  const meta = periodo === "semanal" ? META_SEMANAL : META_MENSUAL;
  const total = datos.reduce((acc, d) => acc + d.valor, 0);
  const promedio = total / datos.length;
  const maximo = Math.max(...datos.map((d) => d.valor));
  const avance = (total / meta) * 100;

  return (
    <div className="min-h-screen w-full bg-[#1C1B19] text-[#F2EFE9] p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <span className="font-mono text-xs tracking-widest text-[#E8732C]">RQF022 — REPORTES</span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-1">
              Reporte {periodo === "semanal" ? "semanal" : "mensual"}
            </h1>
            <p className="text-[#9A958A] mt-1 text-sm">Resumen de ingresos por periodo.</p>
          </div>

          <div className="flex bg-[#25241F] border border-white/10 rounded-xl p-1">
            {["semanal", "mensual"].map((opcion) => (
              <button
                key={opcion}
                onClick={() => setPeriodo(opcion)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize
                  ${periodo === opcion ? "bg-[#E8732C] text-[#1C1B19]" : "text-[#9A958A] hover:text-[#F2EFE9]"}`}
              >
                {opcion}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
          {/* Barras */}
          <div className="bg-[#25241F] border border-white/10 rounded-2xl p-6">
            <h2 className="font-semibold text-sm uppercase tracking-wide text-[#9A958A] mb-6">
              Ingresos por {periodo === "semanal" ? "día" : "semana"}
            </h2>
            <div className="flex items-end gap-3 h-56">
              {datos.map((d) => (
                <div key={d.etiqueta} className="flex-1 flex flex-col items-center gap-2 h-full">
                  <div className="flex-1 w-full flex items-end">
                    <div
                      className="w-full bg-[#E8732C] rounded-t-md transition-all"
                      style={{ height: `${(d.valor / maximo) * 100}%`, opacity: d.valor === maximo ? 1 : 0.65 }}
                      title={formatoCOP(d.valor)}
                    />
                  </div>
                  <span className="text-xs font-mono text-[#9A958A]">{d.etiqueta}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen + arco */}
          <div className="bg-[#25241F] border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-5">
            <ArcoIndicador porcentaje={avance} />
            <div className="w-full flex flex-col gap-3 mt-1">
              <Fila etiqueta="Total del periodo" valor={formatoCOP(total)} color="text-[#4A7C6F]" />
              <Fila etiqueta="Promedio" valor={formatoCOP(promedio)} />
              <Fila etiqueta="Meta del periodo" valor={formatoCOP(meta)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Fila({ etiqueta, valor, color = "text-[#F2EFE9]" }) {
  return (
    <div className="flex items-center justify-between text-sm border-t border-white/5 pt-3 first:border-t-0 first:pt-0">
      <span className="text-[#9A958A]">{etiqueta}</span>
      <span className={`font-mono ${color}`}>{valor}</span>
    </div>
  );
}
