import React, { useState } from "react";
import { Bell, Mail, MessageCircle, Monitor, AlertTriangle, Save } from "lucide-react";

/**
 * RQF016 — Configuración de alertas
 * Define umbrales mínimos por producto y canales de notificación.
 */

const PRODUCTOS_INICIAL = [
  { id: "SKU-1042", nombre: "Cable HDMI 2m", stock: 86, minimo: 30 },
  { id: "SKU-2078", nombre: "Mouse inalámbrico", stock: 24, minimo: 25 },
  { id: "SKU-3310", nombre: "Teclado mecánico", stock: 12, minimo: 15 },
  { id: "SKU-4456", nombre: "Monitor 24''", stock: 41, minimo: 10 },
  { id: "SKU-5521", nombre: "Cargador USB-C 65W", stock: 58, minimo: 20 },
];

export default function ConfiguracionAlertas() {
  const [productos, setProductos] = useState(PRODUCTOS_INICIAL);
  const [canales, setCanales] = useState({ email: true, whatsapp: true, sistema: true });
  const [guardado, setGuardado] = useState(false);

  const actualizarMinimo = (id, valor) => {
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, minimo: Math.max(0, Number(valor)) } : p))
    );
    setGuardado(false);
  };

  const toggleCanal = (canal) => {
    setCanales((prev) => ({ ...prev, [canal]: !prev[canal] }));
    setGuardado(false);
  };

  const guardar = () => {
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2500);
  };

  const enAlerta = productos.filter((p) => p.stock <= p.minimo);

  return (
    <div className="min-h-screen bg-stone-100 p-6 md:p-10 font-sans">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6 flex items-end justify-between border-b-2 border-dashed border-stone-400 pb-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-700">RQF-016</p>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Configuración de alertas</h1>
          </div>
          <Bell className="hidden text-stone-400 md:block" size={26} />
        </header>

        {/* Alertas activas */}
        {enAlerta.length > 0 && (
          <div className="mb-6 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-orange-800">
              <AlertTriangle size={16} /> {enAlerta.length} producto(s) por debajo del mínimo configurado
            </p>
            <p className="mt-1 font-mono text-xs text-orange-700">
              {enAlerta.map((p) => p.id).join(" · ")}
            </p>
          </div>
        )}

        {/* Canales de notificación */}
        <div className="mb-6 rounded-lg border border-stone-300 bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-semibold text-stone-800">Canales de notificación</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { key: "email", label: "Correo electrónico", icon: Mail },
              { key: "whatsapp", label: "WhatsApp", icon: MessageCircle },
              { key: "sistema", label: "Panel del sistema", icon: Monitor },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => toggleCanal(key)}
                className={`flex items-center gap-2 rounded-md border px-3 py-2.5 text-sm font-medium transition ${
                  canales[key]
                    ? "border-teal-700 bg-teal-50 text-teal-800"
                    : "border-stone-300 bg-stone-50 text-stone-400"
                }`}
              >
                <Icon size={16} />
                {label}
                <span
                  className={`ml-auto h-2.5 w-2.5 rounded-full ${canales[key] ? "bg-teal-600" : "bg-stone-300"}`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Umbrales por producto */}
        <div className="rounded-lg border border-stone-300 bg-white shadow-sm">
          <div className="border-b border-stone-200 px-5 py-3">
            <h2 className="font-semibold text-stone-800">Umbral mínimo por producto</h2>
          </div>
          <div className="divide-y divide-stone-100">
            {productos.map((p) => {
              const critico = p.stock <= p.minimo;
              return (
                <div key={p.id} className="flex flex-wrap items-center gap-4 px-5 py-3 text-sm">
                  <span className="w-24 shrink-0 font-mono text-xs text-stone-400">{p.id}</span>
                  <span className="flex-1 min-w-[140px] font-medium text-stone-700">{p.nombre}</span>
                  <span className={`font-mono text-xs ${critico ? "text-orange-800" : "text-stone-500"}`}>
                    stock actual: {p.stock}
                  </span>
                  <label className="flex items-center gap-2">
                    <span className="text-xs text-stone-500">Alertar si ≤</span>
                    <input
                      type="number"
                      min="0"
                      value={p.minimo}
                      onChange={(e) => actualizarMinimo(p.id, e.target.value)}
                      className="w-20 rounded-md border border-stone-300 bg-stone-50 px-2 py-1 text-right font-mono text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
                    />
                  </label>
                  {critico && <span className="font-mono text-xs font-semibold text-orange-800">● en alerta</span>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={guardar}
            className="flex items-center gap-2 rounded-md bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            <Save size={16} /> Guardar configuración
          </button>
          {guardado && <span className="text-sm font-medium text-teal-700">Configuración guardada.</span>}
        </div>
      </div>
    </div>
  );
}
