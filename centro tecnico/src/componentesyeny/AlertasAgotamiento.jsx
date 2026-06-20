import { useMemo, useState } from "react";
import { PackageX, AlertOctagon, TrendingDown, RefreshCw, ArrowRight } from "lucide-react";

/**
 * RQF015 - Alertas de agotamiento
 * Panel dedicado a productos agotados o en riesgo crítico de agotamiento,
 * con priorización y acción rápida de reabastecimiento.
 */
const PRODUCTOS = [
  { id: 1, nombre: "Cafetera de goteo", sku: "CAF-0145", stock: 0, stockMinimo: 5, diasParaAgotarse: 0, ventaDiaria: 1.2 },
  { id: 2, nombre: "Auriculares con cable", sku: "AUR-0099", stock: 0, stockMinimo: 8, diasParaAgotarse: 0, ventaDiaria: 0.8 },
  { id: 3, nombre: "Lámpara de escritorio", sku: "LAM-0078", stock: 5, stockMinimo: 8, diasParaAgotarse: 3, ventaDiaria: 1.6 },
  { id: 4, nombre: "Silla ergonómica", sku: "SIL-0099", stock: 8, stockMinimo: 10, diasParaAgotarse: 6, ventaDiaria: 1.3 },
  { id: 5, nombre: "Set de ollas", sku: "OLL-0220", stock: 14, stockMinimo: 6, diasParaAgotarse: 9, ventaDiaria: 1.5 },
];

export default function AlertasAgotamiento() {
  const [reabastecidos, setReabastecidos] = useState(new Set());

  const productos = useMemo(
    () => PRODUCTOS.filter((p) => !reabastecidos.has(p.id)),
    [reabastecidos]
  );

  const clasificados = useMemo(() => {
    return productos
      .map((p) => ({
        ...p,
        nivel:
          p.stock === 0
            ? "critico"
            : p.diasParaAgotarse <= 4
            ? "urgente"
            : "atencion",
      }))
      .sort((a, b) => a.diasParaAgotarse - b.diasParaAgotarse);
  }, [productos]);

  const agotados = clasificados.filter((p) => p.nivel === "critico").length;
  const urgentes = clasificados.filter((p) => p.nivel === "urgente").length;

  function reabastecer(id) {
    setReabastecidos((prev) => new Set(prev).add(id));
  }

  const config = {
    critico: {
      etiqueta: "Agotado",
      borde: "border-red-200",
      fondo: "bg-red-50",
      texto: "text-red-700",
      icono: PackageX,
      barra: "bg-red-500",
    },
    urgente: {
      etiqueta: "Urgente",
      borde: "border-orange-200",
      fondo: "bg-orange-50",
      texto: "text-orange-700",
      icono: AlertOctagon,
      barra: "bg-orange-500",
    },
    atencion: {
      etiqueta: "Atención",
      borde: "border-amber-200",
      fondo: "bg-amber-50",
      texto: "text-amber-700",
      icono: TrendingDown,
      barra: "bg-amber-500",
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-600">
            <PackageX className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Alertas de agotamiento
            </h1>
            <p className="text-sm text-slate-500">
              Productos agotados o en riesgo crítico de quedarse sin stock
            </p>
          </div>
        </header>

        {/* Resumen */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-red-100 bg-red-50/60 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-red-500">
              Agotados ahora
            </p>
            <p className="mt-1 text-2xl font-semibold text-red-700">{agotados}</p>
          </div>
          <div className="rounded-xl border border-orange-100 bg-orange-50/60 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-orange-500">
              Riesgo urgente
            </p>
            <p className="mt-1 text-2xl font-semibold text-orange-700">{urgentes}</p>
          </div>
          <div className="col-span-2 rounded-xl border border-slate-200 bg-white p-4 sm:col-span-1">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Total monitoreado
            </p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {PRODUCTOS.length}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {clasificados.map((p) => {
            const c = config[p.nivel];
            const Icono = c.icono;
            return (
              <div
                key={p.id}
                className={`flex items-center gap-4 rounded-xl border ${c.borde} bg-white p-4 shadow-sm`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${c.fondo}`}>
                  <Icono className={`h-5 w-5 ${c.texto}`} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium text-slate-800">{p.nombre}</p>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${c.fondo} ${c.texto}`}>
                      {c.etiqueta}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-slate-400">{p.sku}</p>

                  <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                    <span>
                      Stock actual:{" "}
                      <span className="font-semibold text-slate-700">{p.stock}</span>
                      {" "}/ mín. {p.stockMinimo}
                    </span>
                    <span>·</span>
                    <span>
                      {p.stock === 0
                        ? "Sin unidades disponibles"
                        : `Se agota en ~${p.diasParaAgotarse} día${p.diasParaAgotarse !== 1 ? "s" : ""}`}
                    </span>
                  </div>

                  <div className="mt-2 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full ${c.barra}`}
                      style={{
                        width: `${Math.min(100, (p.stock / (p.stockMinimo * 1.5)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => reabastecer(p.id)}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-slate-800"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Reabastecer
                </button>
              </div>
            );
          })}

          {clasificados.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
              <PackageX className="mx-auto mb-2 h-6 w-6 text-slate-300" />
              <p className="text-sm font-medium text-slate-500">
                No hay productos en riesgo de agotamiento
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Todos los niveles de stock están por encima del mínimo.
              </p>
            </div>
          )}
        </div>

        {clasificados.length > 0 && (
          <button className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
            Ver historial de reabastecimiento
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
