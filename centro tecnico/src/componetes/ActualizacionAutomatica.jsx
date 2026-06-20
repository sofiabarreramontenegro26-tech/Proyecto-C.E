import React, { useEffect, useRef, useState } from "react";
import { RefreshCw, Pause, Play, Wifi } from "lucide-react";

/**
 * RQF013 — Actualización automática
 * Simula la sincronización periódica de niveles de stock,
 * mostrando última hora de actualización y variación reciente.
 */

const STOCK_INICIAL = [
  { id: "SKU-1042", nombre: "Cable HDMI 2m", stock: 86, minimo: 30, max: 150 },
  { id: "SKU-2078", nombre: "Mouse inalámbrico", stock: 24, minimo: 25, max: 100 },
  { id: "SKU-3310", nombre: "Teclado mecánico", stock: 12, minimo: 15, max: 60 },
  { id: "SKU-4456", nombre: "Monitor 24''", stock: 41, minimo: 10, max: 80 },
  { id: "SKU-5521", nombre: "Cargador USB-C 65W", stock: 58, minimo: 20, max: 120 },
];

const INTERVALO_MS = 4000;

export default function ActualizacionAutomatica() {
  const [productos, setProductos] = useState(STOCK_INICIAL);
  const [activo, setActivo] = useState(true);
  const [ultimaSync, setUltimaSync] = useState(new Date());
  const [segundos, setSegundos] = useState(0);
  const tickRef = useRef(null);

  // Simula sincronización periódica con el sistema central
  useEffect(() => {
    if (!activo) return;
    const id = setInterval(() => {
      setProductos((prev) =>
        prev.map((p) => {
          const delta = Math.round((Math.random() - 0.55) * 6);
          const nuevoStock = Math.max(0, Math.min(p.max, p.stock + delta));
          return { ...p, stock: nuevoStock, delta };
        })
      );
      setUltimaSync(new Date());
      setSegundos(0);
    }, INTERVALO_MS);
    return () => clearInterval(id);
  }, [activo]);

  // Contador de "hace X segundos"
  useEffect(() => {
    tickRef.current = setInterval(() => setSegundos((s) => s + 1), 1000);
    return () => clearInterval(tickRef.current);
  }, []);

  const bajoMinimo = productos.filter((p) => p.stock <= p.minimo).length;

  return (
    <div className="min-h-screen bg-stone-100 p-6 md:p-10 font-sans">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6 flex items-end justify-between border-b-2 border-dashed border-stone-400 pb-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-700">RQF-013</p>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Actualización automática</h1>
          </div>
          <button
            onClick={() => setActivo((a) => !a)}
            className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition ${
              activo
                ? "border-teal-700 bg-teal-700 text-white"
                : "border-stone-300 bg-white text-stone-600 hover:border-stone-400"
            }`}
          >
            {activo ? <Pause size={15} /> : <Play size={15} />}
            {activo ? "Sincronización activa" : "En pausa"}
          </button>
        </header>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-stone-300 bg-white p-4">
            <p className="font-mono text-xs uppercase text-stone-400">Productos monitoreados</p>
            <p className="text-2xl font-bold text-stone-900">{productos.length}</p>
          </div>
          <div className="rounded-lg border border-stone-300 bg-white p-4">
            <p className="font-mono text-xs uppercase text-stone-400">Bajo el mínimo</p>
            <p className={`text-2xl font-bold ${bajoMinimo > 0 ? "text-orange-800" : "text-stone-900"}`}>
              {bajoMinimo}
            </p>
          </div>
          <div className="rounded-lg border border-stone-300 bg-white p-4">
            <p className="flex items-center gap-1 font-mono text-xs uppercase text-stone-400">
              <Wifi size={12} /> Última sincronización
            </p>
            <p className="text-lg font-bold text-stone-900">
              hace {segundos}s
              <span className="ml-2 font-mono text-xs font-normal text-stone-400">
                {ultimaSync.toLocaleTimeString("es-MX")}
              </span>
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-stone-300 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-200 px-5 py-3">
            <h2 className="font-semibold text-stone-800">Niveles de stock en tiempo real</h2>
            <RefreshCw size={16} className={`text-teal-700 ${activo ? "animate-spin" : ""}`} style={{ animationDuration: "2.5s" }} />
          </div>
          <div className="divide-y divide-stone-100">
            {productos.map((p) => {
              const pct = Math.round((p.stock / p.max) * 100);
              const critico = p.stock <= p.minimo;
              return (
                <div key={p.id} className="px-5 py-3">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-stone-700">
                      <span className="mr-2 font-mono text-xs text-stone-400">{p.id}</span>
                      {p.nombre}
                    </span>
                    <span className="flex items-center gap-2">
                      {typeof p.delta === "number" && p.delta !== 0 && (
                        <span className={`font-mono text-xs ${p.delta > 0 ? "text-teal-700" : "text-orange-800"}`}>
                          {p.delta > 0 ? `+${p.delta}` : p.delta}
                        </span>
                      )}
                      <span className={`font-mono font-semibold ${critico ? "text-orange-800" : "text-stone-900"}`}>
                        {p.stock} u.
                      </span>
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        critico ? "bg-orange-700" : "bg-teal-700"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  {critico && (
                    <p className="mt-1 font-mono text-xs text-orange-800">
                      Por debajo del mínimo ({p.minimo} u.)
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
