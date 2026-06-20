import { useMemo, useState } from "react";
import { ClipboardList, Filter, ArrowUpDown, Boxes } from "lucide-react";

/**
 * RQF009 - Consulta de inventario
 * Vista de solo lectura para consultar niveles de stock, ubicación y movimiento.
 */
const INVENTARIO = [
  { id: 1, nombre: "Audífonos inalámbricos", sku: "AUD-0234", categoria: "Electrónica", stock: 42, stockMinimo: 15, ubicacion: "A-12", ultimoMovimiento: "2026-06-18" },
  { id: 2, nombre: "Silla ergonómica", sku: "SIL-0099", categoria: "Hogar", stock: 8, stockMinimo: 10, ubicacion: "B-04", ultimoMovimiento: "2026-06-17" },
  { id: 3, nombre: "Cafetera de goteo", sku: "CAF-0145", categoria: "Hogar", stock: 0, stockMinimo: 5, ubicacion: "B-09", ultimoMovimiento: "2026-06-10" },
  { id: 4, nombre: "Mochila urbana", sku: "MOC-0312", categoria: "Ropa", stock: 23, stockMinimo: 12, ubicacion: "C-02", ultimoMovimiento: "2026-06-19" },
  { id: 5, nombre: "Lámpara de escritorio", sku: "LAM-0078", categoria: "Oficina", stock: 5, stockMinimo: 8, ubicacion: "D-15", ultimoMovimiento: "2026-06-15" },
  { id: 6, nombre: "Teclado mecánico", sku: "TEC-0501", categoria: "Electrónica", stock: 31, stockMinimo: 10, ubicacion: "A-08", ultimoMovimiento: "2026-06-20" },
  { id: 7, nombre: "Set de ollas", sku: "OLL-0220", categoria: "Hogar", stock: 14, stockMinimo: 6, ubicacion: "B-11", ultimoMovimiento: "2026-06-14" },
];

export default function ConsultaInventario() {
  const [categoria, setCategoria] = useState("todas");
  const [orden, setOrden] = useState({ campo: "nombre", asc: true });

  const categorias = ["todas", ...new Set(INVENTARIO.map((p) => p.categoria))];

  const datos = useMemo(() => {
    let lista = [...INVENTARIO];
    if (categoria !== "todas") {
      lista = lista.filter((p) => p.categoria === categoria);
    }
    lista.sort((a, b) => {
      const valA = a[orden.campo];
      const valB = b[orden.campo];
      if (typeof valA === "number") {
        return orden.asc ? valA - valB : valB - valA;
      }
      return orden.asc
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
    return lista;
  }, [categoria, orden]);

  function cambiarOrden(campo) {
    setOrden((prev) =>
      prev.campo === campo ? { campo, asc: !prev.asc } : { campo, asc: true }
    );
  }

  const totalUnidades = datos.reduce((acc, p) => acc + p.stock, 0);
  const bajoMinimo = datos.filter((p) => p.stock < p.stockMinimo).length;

  function estadoStock(p) {
    if (p.stock === 0) return { texto: "Agotado", color: "bg-red-500" };
    if (p.stock < p.stockMinimo) return { texto: "Bajo", color: "bg-amber-500" };
    return { texto: "Óptimo", color: "bg-emerald-500" };
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900">
            <ClipboardList className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Consulta de inventario
            </h1>
            <p className="text-sm text-slate-500">
              Niveles de stock actuales por producto y ubicación
            </p>
          </div>
        </header>

        {/* Resumen */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TarjetaResumen
            icono={<Boxes className="h-4 w-4" />}
            etiqueta="Referencias"
            valor={datos.length}
          />
          <TarjetaResumen
            icono={<Boxes className="h-4 w-4" />}
            etiqueta="Unidades totales"
            valor={totalUnidades.toLocaleString("es-CO")}
          />
          <TarjetaResumen
            icono={<Boxes className="h-4 w-4" />}
            etiqueta="Bajo el mínimo"
            valor={bajoMinimo}
            acento={bajoMinimo > 0}
          />
        </div>

        {/* Filtros */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoria(cat)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition ${
                categoria === cat
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                <EncabezadoOrdenable campo="nombre" label="Producto" orden={orden} onClick={cambiarOrden} />
                <th className="px-5 py-3">SKU</th>
                <EncabezadoOrdenable campo="ubicacion" label="Ubicación" orden={orden} onClick={cambiarOrden} />
                <EncabezadoOrdenable campo="stock" label="Stock" orden={orden} onClick={cambiarOrden} align="right" />
                <th className="px-5 py-3">Estado</th>
                <EncabezadoOrdenable campo="ultimoMovimiento" label="Último movimiento" orden={orden} onClick={cambiarOrden} />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {datos.map((p) => {
                const estado = estadoStock(p);
                const porcentaje = Math.min(100, Math.round((p.stock / (p.stockMinimo * 2)) * 100));
                return (
                  <tr key={p.id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3.5 font-medium text-slate-800">{p.nombre}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{p.sku}</td>
                    <td className="px-5 py-3.5 text-slate-600">{p.ubicacion}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <span className="w-6 text-right tabular-nums font-semibold text-slate-800">
                          {p.stock}
                        </span>
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full ${estado.color}`}
                            style={{ width: `${porcentaje}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                          estado.texto === "Agotado"
                            ? "bg-red-50 text-red-700"
                            : estado.texto === "Bajo"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${estado.color}`} />
                        {estado.texto}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">
                      {new Date(p.ultimoMovimiento).toLocaleDateString("es-CO", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TarjetaResumen({ etiqueta, valor, acento }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {etiqueta}
      </p>
      <p
        className={`mt-1.5 text-2xl font-semibold tabular-nums ${
          acento ? "text-amber-600" : "text-slate-900"
        }`}
      >
        {valor}
      </p>
    </div>
  );
}

function EncabezadoOrdenable({ campo, label, orden, onClick, align = "left" }) {
  const activo = orden.campo === campo;
  return (
    <th
      className={`cursor-pointer select-none px-5 py-3 transition hover:text-slate-700 ${
        align === "right" ? "text-right" : "text-left"
      }`}
      onClick={() => onClick(campo)}
    >
      <span className={`inline-flex items-center gap-1 ${align === "right" ? "flex-row-reverse" : ""}`}>
        {label}
        <ArrowUpDown
          className={`h-3 w-3 ${activo ? "text-slate-700" : "text-slate-300"}`}
        />
      </span>
    </th>
  );
}
