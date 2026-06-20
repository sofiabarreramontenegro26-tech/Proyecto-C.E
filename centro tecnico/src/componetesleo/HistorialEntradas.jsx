import React, { useMemo, useState } from "react";
import { Search, CalendarRange, Filter, Download } from "lucide-react";

/**
 * RQF014 — Historial de entradas
 * Lista filtrable de entradas de inventario por fecha, producto y proveedor.
 */

const HISTORIAL = [
  { id: "EN-184022", fecha: "2026-06-10", producto: "Cable HDMI 2m", proveedor: "Distribuidora Aurora", cantidad: 60, costo: 45.0, lote: "FAC-00211" },
  { id: "EN-184108", fecha: "2026-06-12", producto: "Mouse inalámbrico", proveedor: "ImporTech S.A.", cantidad: 40, costo: 89.5, lote: "FAC-00218" },
  { id: "EN-184230", fecha: "2026-06-13", producto: "Teclado mecánico", proveedor: "Comercial del Norte", cantidad: 20, costo: 320.0, lote: "FAC-00223" },
  { id: "EN-184390", fecha: "2026-06-15", producto: "Monitor 24''", proveedor: "ImporTech S.A.", cantidad: 15, costo: 1450.0, lote: "FAC-00229" },
  { id: "EN-184501", fecha: "2026-06-16", producto: "Cargador USB-C 65W", proveedor: "Distribuidora Aurora", cantidad: 50, costo: 210.0, lote: "FAC-00233" },
  { id: "EN-184602", fecha: "2026-06-18", producto: "Cable HDMI 2m", proveedor: "Comercial del Norte", cantidad: 30, costo: 44.0, lote: "FAC-00237" },
  { id: "EN-184715", fecha: "2026-06-19", producto: "Mouse inalámbrico", proveedor: "ImporTech S.A.", cantidad: 25, costo: 88.0, lote: "FAC-00241" },
];

const PROVEEDORES = ["Todos", ...new Set(HISTORIAL.map((h) => h.proveedor))];

export default function HistorialEntradas() {
  const [busqueda, setBusqueda] = useState("");
  const [proveedor, setProveedor] = useState("Todos");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const filtrado = useMemo(() => {
    return HISTORIAL.filter((h) => {
      const coincideTexto =
        h.producto.toLowerCase().includes(busqueda.toLowerCase()) ||
        h.id.toLowerCase().includes(busqueda.toLowerCase()) ||
        h.lote.toLowerCase().includes(busqueda.toLowerCase());
      const coincideProveedor = proveedor === "Todos" || h.proveedor === proveedor;
      const coincideDesde = !desde || h.fecha >= desde;
      const coincideHasta = !hasta || h.fecha <= hasta;
      return coincideTexto && coincideProveedor && coincideDesde && coincideHasta;
    }).sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
  }, [busqueda, proveedor, desde, hasta]);

  const totalUnidades = filtrado.reduce((acc, h) => acc + h.cantidad, 0);
  const totalValor = filtrado.reduce((acc, h) => acc + h.cantidad * h.costo, 0);

  return (
    <div className="min-h-screen bg-stone-100 p-6 md:p-10 font-sans">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex items-end justify-between border-b-2 border-dashed border-stone-400 pb-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-700">RQF-014</p>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Historial de entradas</h1>
          </div>
          <button className="hidden items-center gap-2 rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-stone-600 hover:border-stone-400 md:flex">
            <Download size={15} /> Exportar
          </button>
        </header>

        {/* Filtros */}
        <div className="mb-5 grid gap-3 rounded-lg border border-stone-300 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm">
            <span className="mb-1 flex items-center gap-1 font-medium text-stone-700">
              <Search size={14} /> Buscar
            </span>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Producto, folio o lote"
              className="w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
            />
          </label>

          <label className="text-sm">
            <span className="mb-1 flex items-center gap-1 font-medium text-stone-700">
              <Filter size={14} /> Proveedor
            </span>
            <select
              value={proveedor}
              onChange={(e) => setProveedor(e.target.value)}
              className="w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
            >
              {PROVEEDORES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>

          <label className="text-sm">
            <span className="mb-1 flex items-center gap-1 font-medium text-stone-700">
              <CalendarRange size={14} /> Desde
            </span>
            <input
              type="date"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
              className="w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2 font-mono text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
            />
          </label>

          <label className="text-sm">
            <span className="mb-1 flex items-center gap-1 font-medium text-stone-700">
              <CalendarRange size={14} /> Hasta
            </span>
            <input
              type="date"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
              className="w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2 font-mono text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
            />
          </label>
        </div>

        <div className="mb-4 flex gap-4 font-mono text-xs text-stone-500">
          <span>{filtrado.length} resultados</span>
          <span>{totalUnidades} unidades</span>
          <span>${totalValor.toLocaleString("es-MX", { minimumFractionDigits: 2 })} valor total</span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-stone-300 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 font-mono text-xs uppercase text-stone-500">
                <th className="px-4 py-3">Folio</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Proveedor</th>
                <th className="px-4 py-3 text-right">Cantidad</th>
                <th className="px-4 py-3 text-right">Costo u.</th>
                <th className="px-4 py-3">Lote</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtrado.map((h) => (
                <tr key={h.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 font-mono text-xs text-stone-400">{h.id}</td>
                  <td className="px-4 py-3 font-mono text-stone-600">{h.fecha}</td>
                  <td className="px-4 py-3 font-medium text-stone-800">{h.producto}</td>
                  <td className="px-4 py-3 text-stone-500">{h.proveedor}</td>
                  <td className="px-4 py-3 text-right font-mono text-stone-900">{h.cantidad}</td>
                  <td className="px-4 py-3 text-right font-mono text-stone-500">${h.costo.toFixed(2)}</td>
                  <td className="px-4 py-3 font-mono text-xs text-stone-400">{h.lote}</td>
                </tr>
              ))}
              {filtrado.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-stone-400">
                    No hay entradas que coincidan con los filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
