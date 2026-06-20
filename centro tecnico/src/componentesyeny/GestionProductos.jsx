import { useState } from "react";
import {
  Settings2,
  Pencil,
  Trash2,
  X,
  Save,
  Search,
  AlertTriangle,
} from "lucide-react";

/**
 * RQF008 - Gestión de productos
 * Listado administrable: editar, eliminar y actualizar productos existentes.
 */
const PRODUCTOS_INICIALES = [
  { id: 1, nombre: "Audífonos inalámbricos", sku: "AUD-0234", categoria: "Electrónica", precioVenta: 89.9, stock: 42, estado: "activo" },
  { id: 2, nombre: "Silla ergonómica", sku: "SIL-0099", categoria: "Hogar", precioVenta: 159.0, stock: 8, estado: "activo" },
  { id: 3, nombre: "Cafetera de goteo", sku: "CAF-0145", categoria: "Hogar", precioVenta: 64.5, stock: 0, estado: "inactivo" },
  { id: 4, nombre: "Mochila urbana", sku: "MOC-0312", categoria: "Ropa", precioVenta: 45.0, stock: 23, estado: "activo" },
  { id: 5, nombre: "Lámpara de escritorio", sku: "LAM-0078", categoria: "Oficina", precioVenta: 32.99, stock: 5, estado: "activo" },
];

export default function GestionProductos() {
  const [productos, setProductos] = useState(PRODUCTOS_INICIALES);
  const [busqueda, setBusqueda] = useState("");
  const [editando, setEditando] = useState(null);
  const [borrarId, setBorrarId] = useState(null);
  const [formEdit, setFormEdit] = useState({});

  const filtrados = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.sku.toLowerCase().includes(busqueda.toLowerCase())
  );

  function iniciarEdicion(producto) {
    setEditando(producto.id);
    setFormEdit({ ...producto });
  }

  function guardarEdicion() {
    setProductos((prev) =>
      prev.map((p) => (p.id === editando ? { ...formEdit } : p))
    );
    setEditando(null);
  }

  function confirmarEliminar(id) {
    setProductos((prev) => prev.filter((p) => p.id !== id));
    setBorrarId(null);
  }

  function alternarEstado(id) {
    setProductos((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, estado: p.estado === "activo" ? "inactivo" : "activo" }
          : p
      )
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900">
              <Settings2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                Gestión de productos
              </h1>
              <p className="text-sm text-slate-500">
                {productos.length} productos en el catálogo
              </p>
            </div>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o SKU..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10"
            />
          </div>
        </header>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3">Producto</th>
                <th className="px-5 py-3">SKU</th>
                <th className="px-5 py-3">Categoría</th>
                <th className="px-5 py-3 text-right">Precio</th>
                <th className="px-5 py-3 text-right">Stock</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtrados.map((producto) => (
                <tr key={producto.id} className="group hover:bg-slate-50/60">
                  {editando === producto.id ? (
                    <FilaEdicion
                      form={formEdit}
                      setForm={setFormEdit}
                      onGuardar={guardarEdicion}
                      onCancelar={() => setEditando(null)}
                    />
                  ) : (
                    <>
                      <td className="px-5 py-3.5 font-medium text-slate-800">
                        {producto.nombre}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-slate-500">
                        {producto.sku}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        {producto.categoria}
                      </td>
                      <td className="px-5 py-3.5 text-right tabular-nums text-slate-700">
                        ${producto.precioVenta.toFixed(2)}
                      </td>
                      <td className="px-5 py-3.5 text-right tabular-nums">
                        <span
                          className={
                            producto.stock === 0
                              ? "font-semibold text-red-600"
                              : producto.stock <= 10
                              ? "font-semibold text-amber-600"
                              : "text-slate-700"
                          }
                        >
                          {producto.stock}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => alternarEstado(producto.id)}
                          className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                            producto.estado === "activo"
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          }`}
                        >
                          {producto.estado === "activo" ? "Activo" : "Inactivo"}
                        </button>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-70 transition group-hover:opacity-100">
                          <button
                            onClick={() => iniciarEdicion(producto)}
                            className="rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                            aria-label={`Editar ${producto.nombre}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setBorrarId(producto.id)}
                            className="rounded-md p-1.5 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                            aria-label={`Eliminar ${producto.nombre}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}

              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-400">
                    No se encontraron productos para "{busqueda}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {borrarId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="mb-1 text-base font-semibold text-slate-900">
              Eliminar producto
            </h2>
            <p className="mb-5 text-sm text-slate-500">
              Esta acción no se puede deshacer. El producto será eliminado del
              catálogo de forma permanente.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setBorrarId(null)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                onClick={() => confirmarEliminar(borrarId)}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilaEdicion({ form, setForm, onGuardar, onCancelar }) {
  return (
    <>
      <td className="px-5 py-2">
        <input
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-slate-500"
        />
      </td>
      <td className="px-5 py-2 font-mono text-xs text-slate-500">{form.sku}</td>
      <td className="px-5 py-2">
        <input
          value={form.categoria}
          onChange={(e) => setForm({ ...form, categoria: e.target.value })}
          className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-slate-500"
        />
      </td>
      <td className="px-5 py-2">
        <input
          type="number"
          step="0.01"
          value={form.precioVenta}
          onChange={(e) =>
            setForm({ ...form, precioVenta: Number(e.target.value) })
          }
          className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-right text-sm outline-none focus:border-slate-500"
        />
      </td>
      <td className="px-5 py-2">
        <input
          type="number"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
          className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-right text-sm outline-none focus:border-slate-500"
        />
      </td>
      <td className="px-5 py-2 text-xs text-slate-400">—</td>
      <td className="px-5 py-2">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={onGuardar}
            className="rounded-md p-1.5 text-emerald-600 transition hover:bg-emerald-50"
            aria-label="Guardar cambios"
          >
            <Save className="h-4 w-4" />
          </button>
          <button
            onClick={onCancelar}
            className="rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100"
            aria-label="Cancelar edición"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </td>
    </>
  );
}
