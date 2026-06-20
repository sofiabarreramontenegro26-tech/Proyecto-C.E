import { useState } from "react";
import {
  Bell,
  BellOff,
  AlertTriangle,
  TrendingDown,
  Clock,
  PackageX,
  CheckCircle2,
  Settings,
} from "lucide-react";

/**
 * RQF010 - Alertas automáticas
 * Centro de notificaciones generadas por el sistema (stock, vencimientos, movimientos inusuales).
 */
const ALERTAS_INICIALES = [
  {
    id: 1,
    tipo: "stock_bajo",
    titulo: "Stock bajo: Silla ergonómica",
    detalle: "Quedan 8 unidades, por debajo del mínimo de 10.",
    fecha: "Hace 12 min",
    leida: false,
  },
  {
    id: 2,
    tipo: "agotado",
    titulo: "Producto agotado: Cafetera de goteo",
    detalle: "El stock llegó a 0 unidades. Se recomienda reabastecer.",
    fecha: "Hace 1 h",
    leida: false,
  },
  {
    id: 3,
    tipo: "vencimiento",
    titulo: "Próximo a vencer: Lote #4521",
    detalle: "120 unidades vencen en 5 días.",
    fecha: "Hace 3 h",
    leida: false,
  },
  {
    id: 4,
    tipo: "movimiento",
    titulo: "Salida inusual detectada",
    detalle: "Mochila urbana: 50 unidades retiradas en una sola operación.",
    fecha: "Hace 5 h",
    leida: true,
  },
  {
    id: 5,
    tipo: "stock_bajo",
    titulo: "Stock bajo: Lámpara de escritorio",
    detalle: "Quedan 5 unidades, por debajo del mínimo de 8.",
    fecha: "Ayer",
    leida: true,
  },
];

const CONFIG_TIPO = {
  stock_bajo: { icono: TrendingDown, color: "text-amber-600", bg: "bg-amber-50" },
  agotado: { icono: PackageX, color: "text-red-600", bg: "bg-red-50" },
  vencimiento: { icono: Clock, color: "text-orange-600", bg: "bg-orange-50" },
  movimiento: { icono: AlertTriangle, color: "text-violet-600", bg: "bg-violet-50" },
};

export default function AlertasAutomaticas() {
  const [alertas, setAlertas] = useState(ALERTAS_INICIALES);
  const [filtro, setFiltro] = useState("todas");
  const [notificacionesActivas, setNotificacionesActivas] = useState(true);

  const noLeidas = alertas.filter((a) => !a.leida).length;

  const visibles = alertas.filter((a) => {
    if (filtro === "todas") return true;
    if (filtro === "no_leidas") return !a.leida;
    return a.tipo === filtro;
  });

  function marcarLeida(id) {
    setAlertas((prev) =>
      prev.map((a) => (a.id === id ? { ...a, leida: true } : a))
    );
  }

  function marcarTodasLeidas() {
    setAlertas((prev) => prev.map((a) => ({ ...a, leida: true })));
  }

  const filtros = [
    { id: "todas", label: "Todas" },
    { id: "no_leidas", label: "No leídas" },
    { id: "stock_bajo", label: "Stock bajo" },
    { id: "agotado", label: "Agotados" },
    { id: "vencimiento", label: "Vencimientos" },
    { id: "movimiento", label: "Movimientos" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="mx-auto max-w-2xl">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900">
              <Bell className="h-5 w-5 text-white" />
              {noLeidas > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-slate-50">
                  {noLeidas}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                Alertas automáticas
              </h1>
              <p className="text-sm text-slate-500">
                {noLeidas > 0
                  ? `${noLeidas} alerta${noLeidas !== 1 ? "s" : ""} sin leer`
                  : "Todo al día"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setNotificacionesActivas((v) => !v)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
              notificacionesActivas
                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            {notificacionesActivas ? (
              <Bell className="h-3.5 w-3.5" />
            ) : (
              <BellOff className="h-3.5 w-3.5" />
            )}
            {notificacionesActivas ? "Activas" : "Silenciadas"}
          </button>
        </header>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {filtros.map((f) => (
              <button
                key={f.id}
                onClick={() => setFiltro(f.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  filtro === f.id
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          {noLeidas > 0 && (
            <button
              onClick={marcarTodasLeidas}
              className="text-xs font-medium text-slate-500 hover:text-slate-800"
            >
              Marcar todas como leídas
            </button>
          )}
        </div>

        <div className="space-y-2">
          {visibles.map((alerta) => {
            const config = CONFIG_TIPO[alerta.tipo];
            const Icono = config.icono;
            return (
              <div
                key={alerta.id}
                className={`flex items-start gap-3 rounded-xl border p-4 transition ${
                  alerta.leida
                    ? "border-slate-200 bg-white"
                    : "border-slate-200 bg-white shadow-sm ring-1 ring-slate-900/5"
                }`}
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${config.bg}`}>
                  <Icono className={`h-4.5 w-4.5 ${config.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {!alerta.leida && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                    )}
                    <p className="truncate text-sm font-medium text-slate-800">
                      {alerta.titulo}
                    </p>
                  </div>
                  <p className="mt-0.5 text-sm text-slate-500">{alerta.detalle}</p>
                  <p className="mt-1.5 text-xs text-slate-400">{alerta.fecha}</p>
                </div>
                {!alerta.leida && (
                  <button
                    onClick={() => marcarLeida(alerta.id)}
                    className="shrink-0 rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-emerald-600"
                    aria-label="Marcar como leída"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            );
          })}

          {visibles.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
              <CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-slate-300" />
              <p className="text-sm font-medium text-slate-500">
                No hay alertas en esta categoría
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-3 text-xs text-slate-500">
          <Settings className="h-3.5 w-3.5 shrink-0" />
          Las alertas se generan automáticamente según las reglas de inventario configuradas.
        </div>
      </div>
    </div>
  );
}
