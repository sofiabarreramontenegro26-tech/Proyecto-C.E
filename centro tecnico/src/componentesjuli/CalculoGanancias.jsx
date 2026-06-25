import { useState, useMemo } from "react";

/**
 * RQF023 — Cálculo de ganancias
 * Calculadora de margen y utilidad por venta, con arco-indicador de margen
 * (mismo motivo visual usado en ReporteSemanalMensual.jsx).
 */

const formatoCOP = (valor) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(
    isFinite(valor) ? valor : 0
  );

function ArcoMargen({ porcentaje }) {
  const pct = Math.max(0, Math.min(porcentaje, 100));
  const radio = 54;
  const circunferencia = 2 * Math.PI * radio;
  const recorrido = (pct / 100) * circunferencia;
  const color = pct < 15 ? "#C1493B" : pct < 35 ? "#E8732C" : "#4A7C6F";

  return (
    <svg viewBox="0 0 130 130" className="w-36 h-36">
      <circle cx="65" cy="65" r={radio} fill="none" stroke="#1C1B19" strokeWidth="12" />
      <circle
        cx="65"
        cy="65"
        r={radio}
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={`${recorrido} ${circunferencia}`}
        transform="rotate(-90 65 65)"
        style={{ transition: "stroke-dasharray 0.3s ease, stroke 0.3s ease" }}
      />
      <text x="65" y="60" textAnchor="middle" className="fill-[#F2EFE9]" style={{ fontSize: "24px", fontWeight: 700, fontFamily: "monospace" }}>
        {pct.toFixed(1)}%
      </text>
      <text x="65" y="80" textAnchor="middle" className="fill-[#9A958A]" style={{ fontSize: "10px", fontFamily: "monospace" }}>
        margen
      </text>
    </svg>
  );
}

export default function CalculoGanancias() {
  const [costoUnitario, setCostoUnitario] = useState(38500);
  const [precioVenta, setPrecioVenta] = useState(55000);
  const [cantidad, setCantidad] = useState(10);
  const [gastosFijos, setGastosFijos] = useState(50000);

  const resultado = useMemo(() => {
    const costo = Number(costoUnitario) || 0;
    const precio = Number(precioVenta) || 0;
    const cant = Number(cantidad) || 0;
    const gastos = Number(gastosFijos) || 0;

    const ingresoTotal = precio * cant;
    const costoTotal = costo * cant;
    const gananciaBruta = ingresoTotal - costoTotal;
    const gananciaNeta = gananciaBruta - gastos;
    const margenBruto = ingresoTotal > 0 ? (gananciaBruta / ingresoTotal) * 100 : 0;
    const margenNeto = ingresoTotal > 0 ? (gananciaNeta / ingresoTotal) * 100 : 0;

    return { ingresoTotal, costoTotal, gananciaBruta, gananciaNeta, margenBruto, margenNeto };
  }, [costoUnitario, precioVenta, cantidad, gastosFijos]);

  return (
    <div className="min-h-screen w-full bg-[#1C1B19] text-[#F2EFE9] p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <span className="font-mono text-xs tracking-widest text-[#E8732C]">RQF023 — FINANZAS</span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-1">Cálculo de ganancias</h1>
          <p className="text-[#9A958A] mt-1 text-sm">
            Estima la utilidad bruta y neta de un lote de venta.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">
          {/* Inputs */}
          <div className="bg-[#25241F] border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="font-semibold text-sm uppercase tracking-wide text-[#9A958A]">Datos de la venta</h2>

            <Campo etiqueta="Costo unitario" valor={costoUnitario} onChange={setCostoUnitario} />
            <Campo etiqueta="Precio de venta unitario" valor={precioVenta} onChange={setPrecioVenta} />
            <Campo etiqueta="Cantidad vendida" valor={cantidad} onChange={setCantidad} prefijo="" sufijo="uds." />
            <Campo etiqueta="Gastos fijos asociados" valor={gastosFijos} onChange={setGastosFijos} />
          </div>

          {/* Resultados */}
          <div className="bg-[#25241F] border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-5">
            <ArcoMargen porcentaje={resultado.margenNeto} />

            <div className="w-full flex flex-col gap-3">
              <Fila etiqueta="Ingreso total" valor={formatoCOP(resultado.ingresoTotal)} />
              <Fila etiqueta="Costo total" valor={formatoCOP(resultado.costoTotal)} />
              <Fila etiqueta="Ganancia bruta" valor={formatoCOP(resultado.gananciaBruta)} color="text-[#4A7C6F]" />
              <Fila
                etiqueta="Ganancia neta"
                valor={formatoCOP(resultado.gananciaNeta)}
                color={resultado.gananciaNeta >= 0 ? "text-[#4A7C6F]" : "text-[#C1493B]"}
                destacar
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Campo({ etiqueta, valor, onChange, sufijo = "COP" }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      {etiqueta}
      <div className="flex items-center bg-[#1C1B19] border border-white/10 rounded-lg overflow-hidden
                       focus-within:border-[#E8732C] transition-colors">
        <input
          type="number"
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent px-3 py-2 outline-none font-mono"
        />
        <span className="px-3 text-xs text-[#9A958A] font-mono">{sufijo}</span>
      </div>
    </label>
  );
}

function Fila({ etiqueta, valor, color = "text-[#F2EFE9]", destacar = false }) {
  return (
    <div
      className={`flex items-center justify-between border-t border-white/5 pt-3 first:border-t-0 first:pt-0
        ${destacar ? "text-base" : "text-sm"}`}
    >
      <span className="text-[#9A958A]">{etiqueta}</span>
      <span className={`font-mono font-semibold ${color}`}>{valor}</span>
    </div>
  );
}
