import { useState } from "react";

/**
 * RQF021 — Registro de Ventas
 * Formulario para registrar una venta + tabla de ventas recientes.
 * Ver paleta y tipografía en el comentario de ProductosFavoritos.jsx.
 */

const VENTAS_INICIALES = [
  { id: 1, producto: "Filtro de aceite HD-12", cantidad: 3, precioUnitario: 38500, fecha: "2026-06-22", cliente: "Taller Norte" },
  { id: 2, producto: "Aceite hidráulico 20L", cantidad: 1, precioUnitario: 96000, fecha: "2026-06-23", cliente: "Industrias Páez" },
];

const formatoCOP = (valor) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(valor);

const hoyISO = () => new Date().toISOString().slice(0, 10);

export default function RegistroVentas() {
  const [ventas, setVentas] = useState(VENTAS_INICIALES);
  const [form, setForm] = useState({
    producto: "",
    cantidad: 1,
    precioUnitario: "",
    cliente: "",
    fecha: hoyISO(),
  });
  const [error, setError] = useState("");

  const actualizarCampo = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

  const registrarVenta = (e) => {
    e.preventDefault();
    if (!form.producto.trim() || !form.precioUnitario || Number(form.cantidad) <= 0) {
      setError("Completa producto, cantidad y precio unitario.");
      return;
    }
    setError("");
    const nuevaVenta = {
      id: Date.now(),
      producto: form.producto.trim(),
      cantidad: Number(form.cantidad),
      precioUnitario: Number(form.precioUnitario),
      cliente: form.cliente.trim() || "Cliente general",
      fecha: form.fecha,
    };
    setVentas((prev) => [nuevaVenta, ...prev]);
    setForm({ producto: "", cantidad: 1, precioUnitario: "", cliente: "", fecha: hoyISO() });
  };

  const totalGeneral = ventas.reduce((acc, v) => acc + v.cantidad * v.precioUnitario, 0);

  return (
    <div className="min-h-screen w-full bg-[#1C1B19] text-[#F2EFE9] p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <span className="font-mono text-xs tracking-widest text-[#E8732C]">RQF021 — VENTAS</span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-1">Registro de ventas</h1>
          <p className="text-[#9A958A] mt-1 text-sm">Registra cada venta para alimentar reportes y ganancias.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-6">
          {/* Formulario */}
          <form
            onSubmit={registrarVenta}
            className="bg-[#25241F] border border-white/10 rounded-2xl p-6 flex flex-col gap-4 self-start"
          >
            <h2 className="font-semibold text-sm uppercase tracking-wide text-[#9A958A]">Nueva venta</h2>

            <label className="flex flex-col gap-1.5 text-sm">
              Producto
              <input
                type="text"
                value={form.producto}
                onChange={(e) => actualizarCampo("producto", e.target.value)}
                placeholder="Ej: Filtro de aceite HD-12"
                className="bg-[#1C1B19] border border-white/10 rounded-lg px-3 py-2 outline-none
                           focus:border-[#E8732C] transition-colors"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5 text-sm">
                Cantidad
                <input
                  type="number"
                  min="1"
                  value={form.cantidad}
                  onChange={(e) => actualizarCampo("cantidad", e.target.value)}
                  className="bg-[#1C1B19] border border-white/10 rounded-lg px-3 py-2 outline-none
                             focus:border-[#E8732C] transition-colors font-mono"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                Precio unitario
                <input
                  type="number"
                  min="0"
                  value={form.precioUnitario}
                  onChange={(e) => actualizarCampo("precioUnitario", e.target.value)}
                  placeholder="0"
                  className="bg-[#1C1B19] border border-white/10 rounded-lg px-3 py-2 outline-none
                             focus:border-[#E8732C] transition-colors font-mono"
                />
              </label>
            </div>

            <label className="flex flex-col gap-1.5 text-sm">
              Cliente
              <input
                type="text"
                value={form.cliente}
                onChange={(e) => actualizarCampo("cliente", e.target.value)}
                placeholder="Cliente general"
                className="bg-[#1C1B19] border border-white/10 rounded-lg px-3 py-2 outline-none
                           focus:border-[#E8732C] transition-colors"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              Fecha
              <input
                type="date"
                value={form.fecha}
                onChange={(e) => actualizarCampo("fecha", e.target.value)}
                className="bg-[#1C1B19] border border-white/10 rounded-lg px-3 py-2 outline-none
                           focus:border-[#E8732C] transition-colors font-mono"
              />
            </label>

            {error && <p className="text-sm text-[#C1493B]">{error}</p>}

            <button
              type="submit"
              className="bg-[#E8732C] text-[#1C1B19] font-semibold rounded-lg py-2.5 mt-1
                         hover:brightness-110 transition-all"
            >
              Registrar venta
            </button>
          </form>

          {/* Tabla de ventas */}
          <div className="bg-[#25241F] border border-white/10 rounded-2xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sm uppercase tracking-wide text-[#9A958A]">
                Ventas recientes
              </h2>
              <span className="font-mono text-[#4A7C6F] text-lg">{formatoCOP(totalGeneral)}</span>
            </div>

            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm min-w-[480px]">
                <thead>
                  <tr className="text-left text-[#9A958A] text-xs uppercase tracking-wide border-b border-white/10">
                    <th className="px-2 py-2">Producto</th>
                    <th className="px-2 py-2">Cliente</th>
                    <th className="px-2 py-2 text-right">Cant.</th>
                    <th className="px-2 py-2 text-right">Total</th>
                    <th className="px-2 py-2 text-right">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {ventas.map((v) => (
                    <tr key={v.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                      <td className="px-2 py-2.5">{v.producto}</td>
                      <td className="px-2 py-2.5 text-[#9A958A]">{v.cliente}</td>
                      <td className="px-2 py-2.5 text-right font-mono">{v.cantidad}</td>
                      <td className="px-2 py-2.5 text-right font-mono text-[#4A7C6F]">
                        {formatoCOP(v.cantidad * v.precioUnitario)}
                      </td>
                      <td className="px-2 py-2.5 text-right text-[#9A958A] font-mono">{v.fecha}</td>
                    </tr>
                  ))}
                  {ventas.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-[#9A958A]">
                        Aún no hay ventas registradas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
