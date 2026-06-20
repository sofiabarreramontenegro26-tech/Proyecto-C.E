import React, { useState } from "react";
import { Truck, PackageCheck, Calendar, DollarSign, Boxes } from "lucide-react";

/**
 * RQF012 — Registro de nuevas entradas
 * Captura recepciones de proveedor: producto, cantidad, costo,
 * número de lote/factura y fecha. Acumula el resumen de la sesión.
 */

const PRODUCTOS = [
  { id: "SKU-1042", nombre: "Cable HDMI 2m" },
  { id: "SKU-2078", nombre: "Mouse inalámbrico" },
  { id: "SKU-3310", nombre: "Teclado mecánico" },
  { id: "SKU-4456", nombre: "Monitor 24''" },
  { id: "SKU-5521", nombre: "Cargador USB-C 65W" },
];

const PROVEEDORES = ["Distribuidora Aurora", "ImporTech S.A.", "Comercial del Norte", "Otro"];

export default function RegistroEntradas() {
  const [entradas, setEntradas] = useState([]);
  const [form, setForm] = useState({
    proveedor: PROVEEDORES[0],
    productoId: PRODUCTOS[0].id,
    cantidad: "",
    costoUnitario: "",
    lote: "",
    fecha: new Date().toISOString().slice(0, 10),
  });
  const [error, setError] = useState("");
  const [confirmacion, setConfirmacion] = useState(null);

  const update = (campo, valor) => {
    setForm((f) => ({ ...f, [campo]: valor }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cantidad = Number(form.cantidad);
    const costo = Number(form.costoUnitario);

    if (!cantidad || cantidad <= 0) return setError("La cantidad recibida debe ser mayor a cero.");
    if (!costo || costo <= 0) return setError("Indica el costo unitario recibido.");
    if (!form.lote.trim()) return setError("Captura el número de lote o factura.");

    const entrada = {
      id: `EN-${Date.now().toString().slice(-6)}`,
      ...form,
      cantidad,
      costoUnitario: costo,
      total: cantidad * costo,
    };

    setEntradas((prev) => [entrada, ...prev]);
    setConfirmacion(entrada);
    setForm((f) => ({ ...f, cantidad: "", costoUnitario: "", lote: "" }));

    setTimeout(() => setConfirmacion(null), 3500);
  };

  const nombreProducto = (id) => PRODUCTOS.find((p) => p.id === id)?.nombre ?? id;
  const totalSesion = entradas.reduce((acc, e) => acc + e.total, 0);
  const unidadesSesion = entradas.reduce((acc, e) => acc + e.cantidad, 0);

  return (
    <div className="min-h-screen bg-stone-100 p-6 md:p-10 font-sans">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6 flex items-end justify-between border-b-2 border-dashed border-stone-400 pb-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-700">RQF-012</p>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Registro de nuevas entradas</h1>
          </div>
          <Truck className="hidden text-stone-400 md:block" size={28} />
        </header>

        <form onSubmit={handleSubmit} className="mb-6 rounded-lg border border-stone-300 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block font-medium text-stone-700">Proveedor</span>
              <select
                value={form.proveedor}
                onChange={(e) => update("proveedor", e.target.value)}
                className="w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
              >
                {PROVEEDORES.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </label>

            <label className="text-sm">
              <span className="mb-1 block font-medium text-stone-700">Producto</span>
              <select
                value={form.productoId}
                onChange={(e) => update("productoId", e.target.value)}
                className="w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2 font-mono text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
              >
                {PRODUCTOS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.id} — {p.nombre}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm">
              <span className="mb-1 flex items-center gap-1 font-medium text-stone-700">
                <Boxes size={14} /> Cantidad recibida
              </span>
              <input
                type="number"
                min="1"
                value={form.cantidad}
                onChange={(e) => update("cantidad", e.target.value)}
                placeholder="0"
                className="w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2 font-mono text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
              />
            </label>

            <label className="text-sm">
              <span className="mb-1 flex items-center gap-1 font-medium text-stone-700">
                <DollarSign size={14} /> Costo unitario
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.costoUnitario}
                onChange={(e) => update("costoUnitario", e.target.value)}
                placeholder="0.00"
                className="w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2 font-mono text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
              />
            </label>

            <label className="text-sm">
              <span className="mb-1 block font-medium text-stone-700">No. de lote / factura</span>
              <input
                type="text"
                value={form.lote}
                onChange={(e) => update("lote", e.target.value)}
                placeholder="Ej. FAC-00231"
                className="w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2 font-mono text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
              />
            </label>

            <label className="text-sm">
              <span className="mb-1 flex items-center gap-1 font-medium text-stone-700">
                <Calendar size={14} /> Fecha de recepción
              </span>
              <input
                type="date"
                value={form.fecha}
                onChange={(e) => update("fecha", e.target.value)}
                className="w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2 font-mono text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
              />
            </label>
          </div>

          {error && <p className="mt-3 text-sm font-medium text-orange-800">{error}</p>}

          <button
            type="submit"
            className="mt-4 flex items-center gap-2 rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800"
          >
            <PackageCheck size={16} /> Confirmar entrada
          </button>

          {confirmacion && (
            <p className="mt-3 rounded-md bg-teal-50 px-3 py-2 text-sm font-medium text-teal-800">
              Entrada {confirmacion.id} registrada: {confirmacion.cantidad} u. de {nombreProducto(confirmacion.productoId)}.
            </p>
          )}
        </form>

        <div className="mb-4 grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-stone-300 bg-white p-4">
            <p className="font-mono text-xs uppercase text-stone-400">Unidades recibidas (sesión)</p>
            <p className="text-2xl font-bold text-stone-900">{unidadesSesion}</p>
          </div>
          <div className="rounded-lg border border-stone-300 bg-white p-4">
            <p className="font-mono text-xs uppercase text-stone-400">Valor recibido (sesión)</p>
            <p className="text-2xl font-bold text-stone-900">
              ${totalSesion.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-stone-300 bg-white shadow-sm">
          <div className="border-b border-stone-200 px-5 py-3">
            <h2 className="font-semibold text-stone-800">Entradas registradas en esta sesión</h2>
          </div>
          {entradas.length === 0 ? (
            <p className="px-5 py-6 text-sm text-stone-400">Aún no se han capturado entradas.</p>
          ) : (
            <div className="divide-y divide-stone-100">
              {entradas.map((e) => (
                <div key={e.id} className="flex flex-wrap items-center gap-3 px-5 py-3 text-sm">
                  <span className="font-mono text-xs text-stone-400">{e.id}</span>
                  <span className="font-medium text-stone-700">{nombreProducto(e.productoId)}</span>
                  <span className="text-stone-500">{e.proveedor}</span>
                  <span className="font-mono text-stone-900">{e.cantidad} u.</span>
                  <span className="font-mono text-stone-500">${e.costoUnitario.toFixed(2)} c/u</span>
                  <span className="ml-auto font-mono text-xs text-stone-400">Lote {e.lote}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
