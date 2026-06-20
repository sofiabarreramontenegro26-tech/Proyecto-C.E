import React, { useState } from "react";
import { PackagePlus, PackageMinus, Hash, User, FileText, Send } from "lucide-react";

/**
 * RQF011 — Registro de movimientos
 * Permite registrar entradas y salidas de inventario y muestra
 * el libro de movimientos del día en formato tipo "manifiesto".
 */

const PRODUCTOS = [
  { id: "SKU-1042", nombre: "Cable HDMI 2m" },
  { id: "SKU-2078", nombre: "Mouse inalámbrico" },
  { id: "SKU-3310", nombre: "Teclado mecánico" },
  { id: "SKU-4456", nombre: "Monitor 24''" },
  { id: "SKU-5521", nombre: "Cargador USB-C 65W" },
];

const movimientosIniciales = [
  { folio: "MV-0091", productoId: "SKU-2078", tipo: "salida", cantidad: 4, motivo: "Venta mostrador", responsable: "L. Reyes", hora: "08:14" },
  { folio: "MV-0092", productoId: "SKU-4456", tipo: "entrada", cantidad: 10, motivo: "Devolución cliente", responsable: "J. Gómez", hora: "09:02" },
  { folio: "MV-0093", productoId: "SKU-1042", tipo: "salida", cantidad: 12, motivo: "Venta mayorista", responsable: "L. Reyes", hora: "09:47" },
];

let folioContador = 94;

export default function RegistroMovimientos() {
  const [movimientos, setMovimientos] = useState(movimientosIniciales);
  const [form, setForm] = useState({
    productoId: PRODUCTOS[0].id,
    tipo: "entrada",
    cantidad: "",
    motivo: "",
    responsable: "",
  });
  const [error, setError] = useState("");

  const handleChange = (campo, valor) => {
    setForm((f) => ({ ...f, [campo]: valor }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cantidadNum = Number(form.cantidad);
    if (!cantidadNum || cantidadNum <= 0) {
      setError("Ingresa una cantidad mayor a cero.");
      return;
    }
    if (!form.responsable.trim()) {
      setError("Indica quién registra el movimiento.");
      return;
    }

    const nuevo = {
      folio: `MV-${String(folioContador++).padStart(4, "0")}`,
      productoId: form.productoId,
      tipo: form.tipo,
      cantidad: cantidadNum,
      motivo: form.motivo.trim() || "Sin especificar",
      responsable: form.responsable.trim(),
      hora: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
    };

    setMovimientos((prev) => [nuevo, ...prev]);
    setForm({ productoId: form.productoId, tipo: form.tipo, cantidad: "", motivo: "", responsable: "" });
  };

  const nombreProducto = (id) => PRODUCTOS.find((p) => p.id === id)?.nombre ?? id;

  return (
    <div className="min-h-screen bg-stone-100 p-6 md:p-10 font-sans">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6 flex items-end justify-between border-b-2 border-dashed border-stone-400 pb-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-700">RQF-011</p>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Registro de movimientos</h1>
          </div>
          <span className="hidden md:block font-mono text-xs text-stone-500">
            Folio siguiente · MV-{String(folioContador).padStart(4, "0")}
          </span>
        </header>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-lg border border-stone-300 bg-white p-5 shadow-sm"
        >
          <div className="mb-4 grid gap-4 md:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-stone-700">Producto</span>
              <select
                value={form.productoId}
                onChange={(e) => handleChange("productoId", e.target.value)}
                className="w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2 font-mono text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
              >
                {PRODUCTOS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.id} — {p.nombre}
                  </option>
                ))}
              </select>
            </label>

            <div className="block text-sm">
              <span className="mb-1 block font-medium text-stone-700">Tipo de movimiento</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleChange("tipo", "entrada")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition ${
                    form.tipo === "entrada"
                      ? "border-teal-700 bg-teal-700 text-white"
                      : "border-stone-300 bg-stone-50 text-stone-600 hover:border-teal-600"
                  }`}
                >
                  <PackagePlus size={16} /> Entrada
                </button>
                <button
                  type="button"
                  onClick={() => handleChange("tipo", "salida")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition ${
                    form.tipo === "salida"
                      ? "border-orange-800 bg-orange-800 text-white"
                      : "border-stone-300 bg-stone-50 text-stone-600 hover:border-orange-700"
                  }`}
                >
                  <PackageMinus size={16} /> Salida
                </button>
              </div>
            </div>

            <label className="block text-sm">
              <span className="mb-1 flex items-center gap-1 font-medium text-stone-700">
                <Hash size={14} /> Cantidad
              </span>
              <input
                type="number"
                min="1"
                value={form.cantidad}
                onChange={(e) => handleChange("cantidad", e.target.value)}
                placeholder="0"
                className="w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2 font-mono text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 flex items-center gap-1 font-medium text-stone-700">
                <User size={14} /> Responsable
              </span>
              <input
                type="text"
                value={form.responsable}
                onChange={(e) => handleChange("responsable", e.target.value)}
                placeholder="Nombre de quien registra"
                className="w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
              />
            </label>

            <label className="block text-sm md:col-span-2">
              <span className="mb-1 flex items-center gap-1 font-medium text-stone-700">
                <FileText size={14} /> Motivo
              </span>
              <input
                type="text"
                value={form.motivo}
                onChange={(e) => handleChange("motivo", e.target.value)}
                placeholder="Ej. Venta mostrador, ajuste por conteo, devolución..."
                className="w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
              />
            </label>
          </div>

          {error && <p className="mb-3 text-sm font-medium text-orange-800">{error}</p>}

          <button
            type="submit"
            className="flex items-center gap-2 rounded-md bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            <Send size={16} /> Registrar movimiento
          </button>
        </form>

        {/* Libro de movimientos */}
        <div className="rounded-lg border border-stone-300 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-200 px-5 py-3">
            <h2 className="font-semibold text-stone-800">Libro de movimientos · hoy</h2>
            <span className="font-mono text-xs text-stone-400">{movimientos.length} registros</span>
          </div>
          <div className="divide-y divide-stone-100">
            {movimientos.map((m) => (
              <div key={m.folio} className="flex items-center gap-4 px-5 py-3 text-sm">
                <span className="w-20 shrink-0 font-mono text-xs text-stone-400">{m.folio}</span>
                <span
                  className={`flex w-24 shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    m.tipo === "entrada" ? "bg-teal-50 text-teal-700" : "bg-orange-50 text-orange-800"
                  }`}
                >
                  {m.tipo === "entrada" ? <PackagePlus size={12} /> : <PackageMinus size={12} />}
                  {m.tipo}
                </span>
                <span className="flex-1 truncate text-stone-700">{nombreProducto(m.productoId)}</span>
                <span className="w-12 shrink-0 text-right font-mono text-stone-900">{m.cantidad}</span>
                <span className="hidden w-40 shrink-0 truncate text-stone-500 md:block">{m.motivo}</span>
                <span className="hidden w-24 shrink-0 text-stone-500 sm:block">{m.responsable}</span>
                <span className="w-14 shrink-0 text-right font-mono text-xs text-stone-400">{m.hora}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
