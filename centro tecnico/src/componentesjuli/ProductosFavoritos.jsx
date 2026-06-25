import { useState } from "react";

/**
 * RQF020 — Productos Favoritos
 * Permite marcar productos como favoritos, buscarlos y filtrar la vista.
 *
 * Sistema visual (compartido entre los 6 componentes del módulo):
 *  - Fondo:      #1C1B19  (carbón cálido)
 *  - Superficie: #25241F
 *  - Acento:     #E8732C  (naranja taller)
 *  - Positivo:   #4A7C6F  (verde/teal)
 *  - Texto:      #F2EFE9
 *  - Texto sutil:#9A958A
 * Tipografía sugerida (opcional, ver nota al final del archivo):
 *  - Encabezados: Space Grotesk
 *  - Cuerpo:      Inter
 *  - Datos/cifras: JetBrains Mono
 */

const PRODUCTOS_INICIALES = [
  { id: 1, nombre: "Filtro de aceite HD-12", categoria: "Repuestos", precio: 38500, favorito: true },
  { id: 2, nombre: "Banda transportadora 2m", categoria: "Repuestos", precio: 152000, favorito: false },
  { id: 3, nombre: "Aceite hidráulico 20L", categoria: "Lubricantes", precio: 96000, favorito: true },
  { id: 4, nombre: "Rodamiento 6204-2RS", categoria: "Repuestos", precio: 21000, favorito: false },
  { id: 5, nombre: "Grasa multipropósito 400g", categoria: "Lubricantes", precio: 18900, favorito: false },
  { id: 6, nombre: "Sensor de presión PT-100", categoria: "Electrónica", precio: 210000, favorito: true },
];

const formatoCOP = (valor) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(valor);

export default function ProductosFavoritos() {
  const [productos, setProductos] = useState(PRODUCTOS_INICIALES);
  const [busqueda, setBusqueda] = useState("");
  const [soloFavoritos, setSoloFavoritos] = useState(false);

  const toggleFavorito = (id) => {
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, favorito: !p.favorito } : p))
    );
  };

  const productosFiltrados = productos.filter((p) => {
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideFiltro = soloFavoritos ? p.favorito : true;
    return coincideBusqueda && coincideFiltro;
  });

  const totalFavoritos = productos.filter((p) => p.favorito).length;

  return (
    <div className="min-h-screen w-full bg-[#1C1B19] text-[#F2EFE9] p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        {/* Encabezado con código de requisito como eyebrow funcional */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <span className="font-mono text-xs tracking-widest text-[#E8732C]">
              RQF020 — INVENTARIO
            </span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-1">
              Productos favoritos
            </h1>
            <p className="text-[#9A958A] mt-1 text-sm">
              Marca los productos de mayor rotación para acceder a ellos rápido.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#25241F] border border-white/10 rounded-xl px-4 py-2">
            <span className="text-[#E8732C]">★</span>
            <span className="font-mono text-sm">
              {totalFavoritos} <span className="text-[#9A958A]">favoritos</span>
            </span>
          </div>
        </div>

        {/* Controles */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar producto..."
            className="flex-1 min-w-[200px] bg-[#25241F] border border-white/10 rounded-xl px-4 py-2.5 text-sm
                       placeholder:text-[#9A958A] outline-none focus:border-[#E8732C] transition-colors"
          />
          <button
            onClick={() => setSoloFavoritos((v) => !v)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors
              ${soloFavoritos
                ? "bg-[#E8732C] border-[#E8732C] text-[#1C1B19]"
                : "bg-[#25241F] border-white/10 text-[#F2EFE9] hover:border-white/30"}`}
          >
            {soloFavoritos ? "Mostrando solo favoritos" : "Mostrar todos"}
          </button>
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {productosFiltrados.map((producto) => (
            <div
              key={producto.id}
              className="bg-[#25241F] border border-white/10 rounded-2xl p-5 flex flex-col gap-3
                         hover:border-white/20 transition-colors"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-mono uppercase tracking-wide text-[#9A958A]">
                  {producto.categoria}
                </span>
                <button
                  onClick={() => toggleFavorito(producto.id)}
                  aria-label={producto.favorito ? "Quitar de favoritos" : "Agregar a favoritos"}
                  className={`text-lg transition-colors ${
                    producto.favorito ? "text-[#E8732C]" : "text-[#9A958A] hover:text-[#E8732C]"
                  }`}
                >
                  {producto.favorito ? "★" : "☆"}
                </button>
              </div>
              <h3 className="text-base font-semibold leading-snug">{producto.nombre}</h3>
              <span className="font-mono text-[#4A7C6F] text-lg">
                {formatoCOP(producto.precio)}
              </span>
            </div>
          ))}

          {productosFiltrados.length === 0 && (
            <div className="col-span-full text-center py-12 text-[#9A958A]">
              No se encontraron productos. Ajusta la búsqueda o el filtro.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * NOTA DE TIPOGRAFÍA (opcional, aplica a los 6 archivos del módulo):
 * Para usar Space Grotesk / Inter / JetBrains Mono tal como fueron diseñados,
 * agrega en tu index.html:
 *   <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
 * y en tailwind.config.js:
 *   theme: { extend: { fontFamily: {
 *     sans: ['Inter', 'sans-serif'],
 *     mono: ['JetBrains Mono', 'monospace'],
 *     display: ['Space Grotesk', 'sans-serif'],
 *   }}}
 * Sin esta configuración, los componentes funcionan igual con las fuentes
 * por defecto de Tailwind (font-sans / font-mono).
 */
