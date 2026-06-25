import { useState } from "react";

/**
 * RQF024 — Registro de máquinas
 * Formulario de alta de máquinas + listado en tarjetas con estado operativo.
 */

const ESTADOS = {
  operativa: { etiqueta: "Operativa", color: "#4A7C6F" },
  mantenimiento: { etiqueta: "En mantenimiento", color: "#E8732C" },
  fuera_servicio: { etiqueta: "Fuera de servicio", color: "#C1493B" },
};

const MAQUINAS_INICIALES = [
  { id: 1, nombre: "Torno CNC-300", tipo: "Mecanizado", adquisicion: "2022-03-10", estado: "operativa" },
  { id: 2, nombre: "Compresor Industrial AX-9", tipo: "Aire comprimido", adquisicion: "2021-08-02", estado: "mantenimiento" },
  { id: 3, nombre: "Soldadora MIG 250", tipo: "Soldadura", adquisicion: "2023-01-17", estado: "operativa" },
  { id: 4, nombre: "Prensa hidráulica P-12", tipo: "Conformado", adquisicion: "2019-11-29", estado: "fuera_servicio" },
];

export default function RegistroMaquinas() {
  const [maquinas, setMaquinas] = useState(MAQUINAS_INICIALES);
  const [form, setForm] = useState({ nombre: "", tipo: "", adquisicion: "", estado: "operativa" });
  const [error, setError] = useState("");

  const actualizarCampo = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

  const registrarMaquina = (e) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.tipo.trim()) {
      setError("Completa al menos el nombre y el tipo de máquina.");
      return;
    }
    setError("");
    setMaquinas((prev) => [
      { id: Date.now(), ...form, nombre: form.nombre.trim(), tipo: form.tipo.trim() },
      ...prev,
    ]);
    setForm({ nombre: "", tipo: "", adquisicion: "", estado: "operativa" });
  };

  const conteoPorEstado = Object.keys(ESTADOS).reduce((acc, key) => {
    acc[key] = maquinas.filter((m) => m.estado === key).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen w-full bg-[#1C1B19] text-[#F2EFE9] p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <span className="font-mono text-xs tracking-widest text-[#E8732C]">RQF024 — ACTIVOS</span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-1">Registro de máquinas</h1>
            <p className="text-[#9A958A] mt-1 text-sm">Inventario de maquinaria y su estado actual.</p>
          </div>
          <div className="flex gap-2">
            {Object.entries(ESTADOS).map(([key, info]) => (
              <div
                key={key}
                className="flex items-center gap-1.5 bg-[#25241F] border border-white/10 rounded-lg px-3 py-1.5 text-xs"
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: info.color }} />
                <span className="font-mono">{conteoPorEstado[key] || 0}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-6">
          {/* Formulario */}
          <form
            onSubmit={registrarMaquina}
            className="bg-[#25241F] border border-white/10 rounded-2xl p-6 flex flex-col gap-4 self-start"
          >
            <h2 className="font-semibold text-sm uppercase tracking-wide text-[#9A958A]">Nueva máquina</h2>

            <label className="flex flex-col gap-1.5 text-sm">
              Nombre
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => actualizarCampo("nombre", e.target.value)}
                placeholder="Ej: Torno CNC-300"
                className="bg-[#1C1B19] border border-white/10 rounded-lg px-3 py-2 outline-none
                           focus:border-[#E8732C] transition-colors"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              Tipo
              <input
                type="text"
                value={form.tipo}
                onChange={(e) => actualizarCampo("tipo", e.target.value)}
                placeholder="Ej: Mecanizado"
                className="bg-[#1C1B19] border border-white/10 rounded-lg px-3 py-2 outline-none
                           focus:border-[#E8732C] transition-colors"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              Fecha de adquisición
              <input
                type="date"
                value={form.adquisicion}
                onChange={(e) => actualizarCampo("adquisicion", e.target.value)}
                className="bg-[#1C1B19] border border-white/10 rounded-lg px-3 py-2 outline-none
                           focus:border-[#E8732C] transition-colors font-mono"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              Estado
              <select
                value={form.estado}
                onChange={(e) => actualizarCampo("estado", e.target.value)}
                className="bg-[#1C1B19] border border-white/10 rounded-lg px-3 py-2 outline-none
                           focus:border-[#E8732C] transition-colors"
              >
                {Object.entries(ESTADOS).map(([key, info]) => (
                  <option key={key} value={key}>{info.etiqueta}</option>
                ))}
              </select>
            </label>

            {error && <p className="text-sm text-[#C1493B]">{error}</p>}

            <button
              type="submit"
              className="bg-[#E8732C] text-[#1C1B19] font-semibold rounded-lg py-2.5 mt-1
                         hover:brightness-110 transition-all"
            >
              Registrar máquina
            </button>
          </form>

          {/* Listado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
            {maquinas.map((m) => {
              const estado = ESTADOS[m.estado];
              return (
                <div
                  key={m.id}
                  className="bg-[#25241F] border border-white/10 rounded-2xl p-5 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-snug">{m.nombre}</h3>
                    <span
                      className="text-xs font-mono px-2 py-1 rounded-md whitespace-nowrap"
                      style={{ backgroundColor: `${estado.color}26`, color: estado.color }}
                    >
                      {estado.etiqueta}
                    </span>
                  </div>
                  <span className="text-xs uppercase tracking-wide text-[#9A958A]">{m.tipo}</span>
                  <span className="text-xs font-mono text-[#9A958A]">
                    Adquirida: {m.adquisicion || "—"}
                  </span>
                </div>
              );
            })}

            {maquinas.length === 0 && (
              <div className="col-span-full text-center py-12 text-[#9A958A]">
                Aún no hay máquinas registradas.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
