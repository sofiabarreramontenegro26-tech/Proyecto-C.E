import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

/**
 * RQF018 - Búsqueda de productos
 * Buscador con filtros combinables por categoría, precio y disponibilidad.
 */
const PRODUCTOS = [
  { id: 1, nombre: "Audífonos inalámbricos", sku: "AUD-0234", categoria: "Electrónica", precio: 89.9, stock: 42 },
  { id: 2, nombre: "Silla ergonómica", sku: "SIL-0099", categoria: "Hogar", precio: 159.0, stock: 8 },
  { id: 3, nombre: "Cafetera de goteo", sku: "CAF-0145", categoria: "Hogar", precio: 64.5, stock: 0 },
  { id: 4, nombre: "Mochila urbana", sku: "MOC-0312", categoria: "Ropa", precio: 45.0, stock: 23 },
  { id: 5, nombre: "Lámpara de escritorio", sku: "LAM-0078", categoria: "Oficina", precio: 32.99, stock: 5 },
  { id: 6, nombre: "Teclado mecánico", sku: "TEC-0501", categoria: "Electrónica", precio: 112.0, stock: 31 },
  { id: 7, nombre: "Auriculares con cable", sku: "AUR-0099", categoria: "Electrónica", precio: 19.9, stock: 0 },
  { id: 8, nombre: "Set de ollas", sku: "OLL-0220", categoria: "Hogar", precio: 78.0, stock: 14 },
];

export default function BusquedaProductos() {
  const [consulta, setConsulta] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [precioMax, setPrecioMax] = useState(200);
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  const categorias = ["todas", ...new Set(PRODUCTOS.map((p) => p.categoria))];

  const resultados = useMemo(() => {
    return PRODUCTOS.filter((p) => {
      const coincideTexto =
        p.nombre.toLowerCase().includes(consulta.toLowerCase()) ||
        p.sku.toLowerCase().includes(consulta.toLowerCase());
      const coincideCategoria = categoria === "todas" || p.categoria === categoria;
      const coincidePrecio = p.precio <= precioMax;
      const coincideDisponibilidad = !soloDisponibles || p.stock > 0;
      return (
        coincideTexto && coincideCategoria && coincidePrecio && coincideDisponibilidad
      );
    });
  }, [consulta, categoria, precioMax, soloDisponibles]);

  function limpiarFiltros() {
    setCategoria("todas");
    setPrecioMax(200);
    setSoloDisponibles(false);
  }

  const filtrosActivos =
    categoria !== "todas" || precioMax < 200 || soloDisponibles;

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            Búsqueda de productos
          </h1>
          <p className="text-sm text-slate-500">
            Encuentra productos por nombre, código o filtros específicos
          </p>
        </header>

        {/* Barra de búsqueda */}
        <div className="mb-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={consulta}
              onChange={(e) => setConsulta(e.target.value)}
              placeholder="Buscar por nombre o SKU..."
              autoFocus
              className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10"
            />
          </div>
          <button
            onClick={() => setFiltrosAbiertos((v) => !v)}
            className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition ${
              filtrosAbiertos || filtrosActivos
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filtros</span>
            {filtrosActivos && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-semibold text-slate-900">
                •
              </span>
            )}
          </button>
        </div>

        {/* Panel de filtros */}
        {filtrosAbiertos && (
          <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
                  Categoría
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {categorias.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoria(cat)}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize transition ${
                        categoria === cat
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-wide text-slate-500">
                  <span>Precio máximo</span>
                  <span className="font-mono text-slate-700">${precioMax}</span>
                </label>
                <input
                  type="range"
                  min={10}
                  max={200}
                  step={5}
                  value={precioMax}
                  onChange={(e) => setPrecioMax(Number(e.target.value))}
                  className="w-full accent-slate-900"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
                  Disponibilidad
                </label>
                <button
                  onClick={() => setSoloDisponibles((v) => !v)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    soloDisponibles
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      soloDisponibles ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  />
                  Solo disponibles
                </button>
              </div>
            </div>

            {filtrosActivos && (
              <button
                onClick={limpiarFiltros}
                className="mt-4 flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800"
              >
                <X className="h-3 w-3" />
                Limpiar filtros
              </button>
            )}
          </div>
        )}

        <p className="mb-3 text-sm text-slate-500">
          {resultados.length} resultado{resultados.length !== 1 && "s"}
          {consulta && <> para "<span className="font-medium text-slate-700">{consulta}</span>"</>}
        </p>

        <div className="space-y-2">
          {resultados.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 transition hover:border-slate-300 hover:shadow-sm"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800">
                  {resaltarCoincidencia(p.nombre, consulta)}
                </p>
                <p className="font-mono text-xs text-slate-400">{p.sku} · {p.categoria}</p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`text-xs font-medium ${
                    p.stock === 0 ? "text-red-500" : "text-slate-500"
                  }`}
                >
                  {p.stock === 0 ? "Sin stock" : `${p.stock} disp.`}
                </span>
                <span className="w-16 text-right text-sm font-semibold tabular-nums text-slate-900">
                  ${p.precio.toFixed(2)}
                </span>
              </div>
            </div>
          ))}

          {resultados.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
              <p className="text-sm font-medium text-slate-600">
                No se encontraron productos
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Intenta con otros términos o ajusta los filtros.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function resaltarCoincidencia(texto, consulta) {
  if (!consulta.trim()) return texto;
  const indice = texto.toLowerCase().indexOf(consulta.toLowerCase());
  if (indice === -1) return texto;
  const antes = texto.slice(0, indice);
  const coincidencia = texto.slice(indice, indice + consulta.length);
  const despues = texto.slice(indice + consulta.length);
  return (
    <>
      {antes}
      <span className="rounded bg-amber-100 px-0.5 text-amber-800">
        {coincidencia}
      </span>
      {despues}
    </>
  );
}
