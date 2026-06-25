import { useState, useMemo } from "react";

/**
 * RQF025 — Historial de mantenimiento
 * Selecciona una máquina y muestra/agrega su historial de mantenimiento
 * en formato de línea de tiempo vertical.
 */

const MAQUINAS = [
  { id: 1, nombre: "Torno CNC-300" },
  { id: 2, nombre: "Compresor Industrial AX-9" },
  { id: 3, nombre: "Soldadora MIG 250" },
  { id: 4, nombre: "Prensa hidráulica P-12" },
];

const HISTORIAL_INICIAL = [
  { id: 1, maquinaId: 1, fecha: "2026-05-12", tipo: "Preventivo", descripcion: "Cambio de aceite y filtros", costo: 85000, tecnico: "J. Ramírez" },
  { id: 2, maquinaId: 1, fecha: "2026-02-03", tipo: "Correctivo", descripcion: "Reemplazo de rodamiento principal", costo: 320000, tecnico: "L. Gómez" },
  { id: 3, maquinaId: 2, fecha: "2026-06-10", tipo: "Preventivo", descripcion: "Purga de condensado y revisión de válvulas", costo: 60000, tecnico: "J. Ramírez" },
  { id: 4, maquinaId: 3, fecha: "2026-04-22", tipo: "Correctivo", descripcion: "Cambio de boquilla y cable de alimentación", costo: 45000, tecnico: "M. Torres" },
];

const formatoCOP = (valor) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(valor);

const hoyISO = () => new Date().toISOString().slice(0, 10);

const COLOR_TIPO = {
  Preventivo: "#4A7C6F",
  Correctivo: "#C1493B",
  Predictivo: "#E8732C",
};

export default function HistorialMantenimiento() {
  const [maquinaId, setMaquinaId] = useState(MAQUINAS[0].id);
  const [historial, setHistorial] = useState(HISTORIAL_INICIAL);
  const [form, setForm] = useState({ fecha: hoyISO(), tipo: "Preventivo", descripcion: "", costo: "", tecnico: "" });
  const [error, setError] = useState("");

  const registros = useMemo(
    () =>
      historial
        .filter((h) => h.maquinaId === maquinaId)
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)),
    [historial, maquinaId]
  );

  const costoTotal = registros.reduce((acc, r) => acc + r.costo, 0);

  const actualizarCampo = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

  const agregarRegistro = (e) => {
    e.preventDefault();
    if (!form.descripcion.trim()) {
      setError("Describe brevemente el mantenimiento realizado.");
      return;
    }
    setError("");
    setHistorial((prev) => [
      {
        id: Date.now(),
        maquinaId,
        fecha: form.fecha,
        tipo: form.tipo,
        descripcion: form.descripcion.trim(),
        costo: Number(form.costo) || 0,
        tecnico: form.tecnico.trim() || "Sin asignar",
      },
      ...prev,
    ]);
    setForm({ fecha: hoyISO(), tipo: "Preventivo", descripcion: "", costo: "", tecnico: "" });
  };

  return (
    <div className="min-h-screen w-full bg-[#1C1B19] text-[#F2EFE9] p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <span className="font-mono text-xs tracking-widest text-[#E8732C]">RQF025 — MANTENIMIENTO</span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-1">Historial de mantenimiento</h1>
          <p className="text-[#9A958A] mt-1 text-sm">Consulta y registra intervenciones por máquina.</p>
        </div>

        {/* Selector de máquina */}
        <div className="flex flex-wrap gap-2 mb-6">
          {MAQUINAS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMaquinaId(m.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors
                ${maquinaId === m.id
                  ? "bg-[#E8732C] border-[#E8732C] text-[#1C1B19]"
                  : "bg-[#25241F] border-white/10 hover:border-white/30"}`}
            >
              {m.nombre}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-6">
          {/* Formulario */}
          <form
            onSubmit={agregarRegistro}
            className="bg-[#25241F] border border-white/10 rounded-2xl p-6 flex flex-col gap-4 self-start"
          >
            <h2 className="font-semibold text-sm uppercase tracking-wide text-[#9A958A]">Nuevo registro</h2>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5 text-sm">
                Fecha
                <input
                  type="date"
                  value={form.fecha}
                  onChange={(e) => actualizarCampo("fecha", e.target.value)}
                  className="bg-[#1C1B19] border border-white/10 rounded-lg px-3 py-2 outline-none
                             focus:border-[#E8732C] transition-colors font-mono"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                Tipo
                <select
                  value={form.tipo}
                  onChange={(e) => actualizarCampo("tipo", e.target.value)}
                  className="bg-[#1C1B19] border border-white/10 rounded-lg px-3 py-2 outline-none
                             focus:border-[#E8732C] transition-colors"
                >
                  {Object.keys(COLOR_TIPO).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="flex flex-col gap-1.5 text-sm">
              Descripción
              <textarea
                value={form.descripcion}
                onChange={(e) => actualizarCampo("descripcion", e.target.value)}
                placeholder="Ej: Cambio de aceite y filtros"
                rows={3}
                className="bg-[#1C1B19] border border-white/10 rounded-lg px-3 py-2 outline-none
                           focus:border-[#E8732C] transition-colors resize-none"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5 text-sm">
                Costo
                <input
                  type="number"
                  min="0"
                  value={form.costo}
                  onChange={(e) => actualizarCampo("costo", e.target.value)}
                  placeholder="0"
                  className="bg-[#1C1B19] border border-white/10 rounded-lg px-3 py-2 outline-none
                             focus:border-[#E8732C] transition-colors font-mono"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                Técnico
                <input
                  type="text"
                  value={form.tecnico}
                  onChange={(e) => actualizarCampo("tecnico", e.target.value)}
                  placeholder="Nombre"
                  className="bg-[#1C1B19] border border-white/10 rounded-lg px-3 py-2 outline-none
                             focus:border-[#E8732C] transition-colors"
                />
              </label>
            </div>

            {error && <p className="text-sm text-[#C1493B]">{error}</p>}

            <button
              type="submit"
              className="bg-[#E8732C] text-[#1C1B19] font-semibold rounded-lg py-2.5 mt-1
                         hover:brightness-110 transition-all"
            >
              Agregar al historial
            </button>
          </form>

          {/* Línea de tiempo */}
          <div className="bg-[#25241F] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-sm uppercase tracking-wide text-[#9A958A]">
                Línea de tiempo
              </h2>
              <span className="font-mono text-[#9A958A] text-sm">
                Total: <span className="text-[#E8732C]">{formatoCOP(costoTotal)}</span>
              </span>
            </div>

            <div className="relative pl-6">
              <div className="absolute left-[7px] top-1 bottom-1 w-px bg-white/10" />
              <div className="flex flex-col gap-6">
                {registros.map((r) => (
                  <div key={r.id} className="relative">
                    <span
                      className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-[#25241F]"
                      style={{ backgroundColor: COLOR_TIPO[r.tipo] || "#9A958A" }}
                    />
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono text-xs text-[#9A958A]">{r.fecha}</span>
                      <span
                        className="text-xs font-mono px-2 py-0.5 rounded-md"
                        style={{ backgroundColor: `${COLOR_TIPO[r.tipo]}26`, color: COLOR_TIPO[r.tipo] }}
                      >
                        {r.tipo}
                      </span>
                    </div>
                    <p className="text-sm leading-snug">{r.descripcion}</p>
                    <p className="text-xs text-[#9A958A] mt-1">
                      {r.tecnico} · <span className="font-mono text-[#4A7C6F]">{formatoCOP(r.costo)}</span>
                    </p>
                  </div>
                ))}

                {registros.length === 0 && (
                  <p className="text-center py-8 text-[#9A958A] text-sm">
                    Esta máquina no tiene mantenimientos registrados.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
