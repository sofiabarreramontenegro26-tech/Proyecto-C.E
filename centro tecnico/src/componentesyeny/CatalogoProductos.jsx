import { useState } from "react";
import { LayoutGrid, List, ShoppingBag, Tag } from "lucide-react";

/**
 * RQF017 - Catálogo de productos
 * Vista tipo galería para explorar el catálogo, con cambio entre grid y lista.
 */
const CATALOGO = [
  { id: 1, nombre: "Audífonos inalámbricos", sku: "AUD-0234", categoria: "Electrónica", precio: 89.9, stock: 42, color: "from-indigo-400 to-indigo-600" },
  { id: 2, nombre: "Silla ergonómica", sku: "SIL-0099", categoria: "Hogar", precio: 159.0, stock: 8, color: "from-amber-400 to-amber-600" },
  { id: 3, nombre: "Cafetera de goteo", sku: "CAF-0145", categoria: "Hogar", precio: 64.5, stock: 0, color: "from-rose-400 to-rose-600" },
  { id: 4, nombre: "Mochila urbana", sku: "MOC-0312", categoria: "Ropa", precio: 45.0, stock: 23, color: "from-emerald-400 to-emerald-600" },
  { id: 5, nombre: "Lámpara de escritorio", sku: "LAM-0078", categoria: "Oficina", precio: 32.99, stock: 5, color: "from-sky-400 to-sky-600" },
  { id: 6, nombre: "Teclado mecánico", sku: "TEC-0501", categoria: "Electrónica", precio: 112.0, stock: 31, color: "from-violet-400 to-violet-600" },
];

export default function CatalogoProductos() {
  const [vista, setVista] = useState("grid");
  const [categoria, setCategoria] = useState("todas");

  const categorias = ["todas", ...new Set(CATALOGO.map((p) => p.categoria))];
  const productos =
    categoria === "todas"
      ? CATALOGO
      : CATALOGO.filter((p) => p.categoria === categoria);

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                Catálogo de productos
              </h1>
              <p className="text-sm text-slate-500">
                {productos.length} productos disponibles
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-white p-1 ring-1 ring-slate-200">
            <button
              onClick={() => setVista("grid")}
              className={`rounded-md p-1.5 transition ${
                vista === "grid"
                  ? "bg-slate-900 text-white"
                  : "text-slate-400 hover:text-slate-700"
              }`}
              aria-label="Ver como cuadrícula"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setVista("lista")}
              className={`rounded-md p-1.5 transition ${
                vista === "lista"
                  ? "bg-slate-900 text-white"
                  : "text-slate-400 hover:text-slate-700"
              }`}
              aria-label="Ver como lista"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="mb-6 flex flex-wrap gap-2">
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

        {vista === "grid" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {productos.map((p) => (
              <TarjetaProducto key={p.id} producto={p} />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {productos.map((p, i) => (
              <FilaProducto key={p.id} producto={p} ultima={i === productos.length - 1} />
            ))}
          </div>
        )}

        {productos.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-400">
            No hay productos en esta categoría.
          </div>
        )}
      </div>
    </div>
  );
}

function TarjetaProducto({ producto }) {
  const agotado = producto.stock === 0;
  return (
    <div className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className={`relative h-32 bg-gradient-to-br ${producto.color}`}>
        {agotado && (
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-red-600">
            Agotado
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-400">
          <Tag className="h-3 w-3" />
          {producto.categoria}
        </div>
        <h3 className="mb-1 truncate font-semibold text-slate-900">
          {producto.nombre}
        </h3>
        <p className="mb-3 font-mono text-xs text-slate-400">{producto.sku}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold tabular-nums text-slate-900">
            ${producto.precio.toFixed(2)}
          </span>
          <span
            className={`text-xs font-medium ${
              agotado ? "text-red-500" : "text-slate-500"
            }`}
          >
            {agotado ? "Sin stock" : `${producto.stock} disp.`}
          </span>
        </div>
      </div>
    </div>
  );
}

function FilaProducto({ producto, ultima }) {
  const agotado = producto.stock === 0;
  return (
    <div
      className={`flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/60 ${
        !ultima ? "border-b border-slate-100" : ""
      }`}
    >
      <div className={`h-10 w-10 shrink-0 rounded-lg bg-gradient-to-br ${producto.color}`} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-800">
          {producto.nombre}
        </p>
        <p className="font-mono text-xs text-slate-400">{producto.sku}</p>
      </div>
      <span className="hidden text-xs text-slate-500 sm:block">
        {producto.categoria}
      </span>
      <span
        className={`text-xs font-medium ${
          agotado ? "text-red-500" : "text-slate-500"
        }`}
      >
        {agotado ? "Sin stock" : `${producto.stock} disp.`}
      </span>
      <span className="w-16 text-right text-sm font-semibold tabular-nums text-slate-900">
        ${producto.precio.toFixed(2)}
      </span>
    </div>
  );
}
