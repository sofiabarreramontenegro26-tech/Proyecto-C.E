import React, { useMemo, useState } from "react";
import { MessageCircle, Plus, Trash2, Phone, Send } from "lucide-react";

/**
 * RQF019 — Cotización por WhatsApp
 * Permite armar una cotización con productos del catálogo y
 * enviarla al cliente a través de un enlace directo de WhatsApp.
 */

const CATALOGO = [
  { id: "SKU-1042", nombre: "Cable HDMI 2m", precio: 75 },
  { id: "SKU-2078", nombre: "Mouse inalámbrico", precio: 149 },
  { id: "SKU-3310", nombre: "Teclado mecánico", precio: 520 },
  { id: "SKU-4456", nombre: "Monitor 24''", precio: 2390 },
  { id: "SKU-5521", nombre: "Cargador USB-C 65W", precio: 349 },
];

export default function CotizacionWhatsApp() {
  const [items, setItems] = useState([{ productoId: CATALOGO[0].id, cantidad: 1 }]);
  const [cliente, setCliente] = useState("");
  const [telefono, setTelefono] = useState("");
  const [notas, setNotas] = useState("");

  const agregarItem = () => {
    setItems((prev) => [...prev, { productoId: CATALOGO[0].id, cantidad: 1 }]);
  };

  const quitarItem = (idx) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const actualizarItem = (idx, campo, valor) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [campo]: valor } : it)));
  };

  const detalle = useMemo(
    () =>
      items.map((it) => {
        const producto = CATALOGO.find((p) => p.id === it.productoId);
        const cantidad = Number(it.cantidad) || 0;
        return { ...it, producto, subtotal: producto ? producto.precio * cantidad : 0 };
      }),
    [items]
  );

  const total = detalle.reduce((acc, d) => acc + d.subtotal, 0);

  const mensaje = useMemo(() => {
    const lineas = detalle
      .filter((d) => d.cantidad > 0)
      .map((d) => `• ${d.cantidad} x ${d.producto.nombre} — $${d.subtotal.toLocaleString("es-MX")}`)
      .join("\n");
    const saludo = cliente ? `Hola ${cliente}, ` : "Hola, ";
    return (
      `${saludo}aquí tienes tu cotización:\n\n${lineas}\n\n` +
      `Total: $${total.toLocaleString("es-MX", { minimumFractionDigits: 2 })}` +
      (notas ? `\n\nNotas: ${notas}` : "") +
      `\n\n¿Deseas confirmar el pedido?`
    );
  }, [detalle, total, cliente, notas]);

  const telefonoLimpio = telefono.replace(/[^0-9]/g, "");
  const enlaceWhatsApp = `https://wa.me/${telefonoLimpio}?text=${encodeURIComponent(mensaje)}`;
  const puedeEnviar = telefonoLimpio.length >= 10 && detalle.some((d) => d.cantidad > 0);

  return (
    <div className="min-h-screen bg-stone-100 p-6 md:p-10 font-sans">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6 flex items-end justify-between border-b-2 border-dashed border-stone-400 pb-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-700">RQF-019</p>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Cotización por WhatsApp</h1>
          </div>
          <MessageCircle className="hidden text-teal-700 md:block" size={26} />
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Columna izquierda: datos y productos */}
          <div className="space-y-5">
            <div className="rounded-lg border border-stone-300 bg-white p-5 shadow-sm">
              <h2 className="mb-3 font-semibold text-stone-800">Datos del cliente</h2>
              <label className="mb-3 block text-sm">
                <span className="mb-1 block font-medium text-stone-700">Nombre</span>
                <input
                  type="text"
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  placeholder="Nombre del cliente"
                  className="w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 flex items-center gap-1 font-medium text-stone-700">
                  <Phone size={14} /> WhatsApp (con código de país)
                </span>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Ej. 521234567890"
                  className="w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2 font-mono text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
                />
              </label>
            </div>

            <div className="rounded-lg border border-stone-300 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold text-stone-800">Productos</h2>
                <button
                  onClick={agregarItem}
                  className="flex items-center gap-1 rounded-md border border-teal-700 px-2.5 py-1 text-xs font-semibold text-teal-700 hover:bg-teal-50"
                >
                  <Plus size={14} /> Agregar
                </button>
              </div>
              <div className="space-y-2">
                {items.map((it, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <select
                      value={it.productoId}
                      onChange={(e) => actualizarItem(idx, "productoId", e.target.value)}
                      className="flex-1 rounded-md border border-stone-300 bg-stone-50 px-2 py-1.5 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
                    >
                      {CATALOGO.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nombre} — ${p.precio}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={it.cantidad}
                      onChange={(e) => actualizarItem(idx, "cantidad", e.target.value)}
                      className="w-16 rounded-md border border-stone-300 bg-stone-50 px-2 py-1.5 text-right font-mono text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
                    />
                    <button
                      onClick={() => quitarItem(idx)}
                      disabled={items.length === 1}
                      className="rounded-md p-1.5 text-stone-400 hover:bg-orange-50 hover:text-orange-800 disabled:opacity-30"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
              <label className="mt-3 block text-sm">
                <span className="mb-1 block font-medium text-stone-700">Notas adicionales</span>
                <textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  rows={2}
                  placeholder="Ej. precio válido por 5 días, incluye envío..."
                  className="w-full rounded-md border border-stone-300 bg-stone-50 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
                />
              </label>
            </div>
          </div>

          {/* Columna derecha: vista previa del mensaje */}
          <div className="rounded-lg border border-stone-300 bg-white p-5 shadow-sm">
            <h2 className="mb-3 font-semibold text-stone-800">Vista previa del mensaje</h2>
            <div className="rounded-lg bg-[#e9f8e7] p-4 font-mono text-sm leading-relaxed text-stone-800 whitespace-pre-wrap">
              {mensaje}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-dashed border-stone-300 pt-3">
              <span className="text-sm font-medium text-stone-600">Total</span>
              <span className="text-xl font-bold text-stone-900">
                ${total.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
              </span>
            </div>

            <a
              href={puedeEnviar ? enlaceWhatsApp : undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!puedeEnviar}
              onClick={(e) => !puedeEnviar && e.preventDefault()}
              className={`mt-4 flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition ${
                puedeEnviar
                  ? "bg-teal-700 text-white hover:bg-teal-800"
                  : "cursor-not-allowed bg-stone-200 text-stone-400"
              }`}
            >
              <Send size={16} /> Enviar cotización por WhatsApp
            </a>
            {!puedeEnviar && (
              <p className="mt-2 text-center text-xs text-stone-400">
                Captura un número de WhatsApp y al menos un producto con cantidad.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
