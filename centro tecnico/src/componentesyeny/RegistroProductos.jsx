import { useState } from "react";
import { Package, Upload, Check, AlertCircle } from "lucide-react";

/**
 * RQF007 - Registro de productos
 * Formulario para registrar un nuevo producto en el sistema de inventario.
 */
export default function RegistroProductos() {
  const initialForm = {
    nombre: "",
    sku: "",
    categoria: "",
    descripcion: "",
    precioCompra: "",
    precioVenta: "",
    stockInicial: "",
    stockMinimo: "",
    unidad: "unidad",
    proveedor: "",
  };

  const [form, setForm] = useState(initialForm);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);
  const [imagenPreview, setImagenPreview] = useState(null);

  const categorias = [
    "Electrónica",
    "Hogar",
    "Alimentos",
    "Ropa",
    "Herramientas",
    "Oficina",
    "Otros",
  ];

  const unidades = ["unidad", "caja", "kg", "litro", "paquete", "par"];

  function actualizarCampo(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    if (errores[campo]) {
      setErrores((prev) => ({ ...prev, [campo]: null }));
    }
  }

  function validar() {
    const nuevosErrores = {};
    if (!form.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio.";
    if (!form.sku.trim()) nuevosErrores.sku = "El SKU es obligatorio.";
    if (!form.categoria) nuevosErrores.categoria = "Selecciona una categoría.";
    if (!form.precioCompra || Number(form.precioCompra) <= 0)
      nuevosErrores.precioCompra = "Ingresa un precio de compra válido.";
    if (!form.precioVenta || Number(form.precioVenta) <= 0)
      nuevosErrores.precioVenta = "Ingresa un precio de venta válido.";
    if (form.stockInicial === "" || Number(form.stockInicial) < 0)
      nuevosErrores.stockInicial = "Ingresa el stock inicial.";
    if (form.stockMinimo === "" || Number(form.stockMinimo) < 0)
      nuevosErrores.stockMinimo = "Ingresa el stock mínimo.";
    return nuevosErrores;
  }

  function manejarImagen(e) {
    const archivo = e.target.files?.[0];
    if (archivo) {
      const url = URL.createObjectURL(archivo);
      setImagenPreview(url);
    }
  }

  function manejarEnvio(e) {
    e.preventDefault();
    const nuevosErrores = validar();
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length === 0) {
      setEnviado(true);
      setTimeout(() => setEnviado(false), 3000);
      setForm(initialForm);
      setImagenPreview(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900">
            <Package className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Registro de productos
            </h1>
            <p className="text-sm text-slate-500">
              Añade un nuevo producto al inventario
            </p>
          </div>
        </header>

        {enviado && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <Check className="h-4 w-4 shrink-0" />
            Producto registrado correctamente.
          </div>
        )}

        <form
          onSubmit={manejarEnvio}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          {/* Imagen */}
          <div className="mb-8 flex items-center gap-5">
            <label
              htmlFor="imagen-producto"
              className="flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-slate-400 hover:bg-slate-100"
            >
              {imagenPreview ? (
                <img
                  src={imagenPreview}
                  alt="Vista previa del producto"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Upload className="h-6 w-6 text-slate-400" />
              )}
              <input
                id="imagen-producto"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={manejarImagen}
              />
            </label>
            <div className="text-sm">
              <p className="font-medium text-slate-700">Imagen del producto</p>
              <p className="text-slate-500">PNG o JPG. Tamaño recomendado 800×800.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Campo
              label="Nombre del producto"
              error={errores.nombre}
              required
            >
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => actualizarCampo("nombre", e.target.value)}
                placeholder="Ej. Audífonos inalámbricos"
                className={inputClase(errores.nombre)}
              />
            </Campo>

            <Campo label="SKU / Código" error={errores.sku} required>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => actualizarCampo("sku", e.target.value)}
                placeholder="Ej. AUD-0234"
                className={inputClase(errores.sku)}
              />
            </Campo>

            <Campo label="Categoría" error={errores.categoria} required>
              <select
                value={form.categoria}
                onChange={(e) => actualizarCampo("categoria", e.target.value)}
                className={inputClase(errores.categoria)}
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </Campo>

            <Campo label="Proveedor">
              <input
                type="text"
                value={form.proveedor}
                onChange={(e) => actualizarCampo("proveedor", e.target.value)}
                placeholder="Ej. Distribuidora Andina"
                className={inputClase()}
              />
            </Campo>

            <Campo label="Precio de compra" error={errores.precioCompra} required>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.precioCompra}
                  onChange={(e) => actualizarCampo("precioCompra", e.target.value)}
                  placeholder="0.00"
                  className={`${inputClase(errores.precioCompra)} pl-7`}
                />
              </div>
            </Campo>

            <Campo label="Precio de venta" error={errores.precioVenta} required>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.precioVenta}
                  onChange={(e) => actualizarCampo("precioVenta", e.target.value)}
                  placeholder="0.00"
                  className={`${inputClase(errores.precioVenta)} pl-7`}
                />
              </div>
            </Campo>

            <Campo label="Stock inicial" error={errores.stockInicial} required>
              <input
                type="number"
                min="0"
                value={form.stockInicial}
                onChange={(e) => actualizarCampo("stockInicial", e.target.value)}
                placeholder="0"
                className={inputClase(errores.stockInicial)}
              />
            </Campo>

            <Campo label="Stock mínimo" error={errores.stockMinimo} required>
              <input
                type="number"
                min="0"
                value={form.stockMinimo}
                onChange={(e) => actualizarCampo("stockMinimo", e.target.value)}
                placeholder="0"
                className={inputClase(errores.stockMinimo)}
              />
            </Campo>

            <Campo label="Unidad de medida">
              <select
                value={form.unidad}
                onChange={(e) => actualizarCampo("unidad", e.target.value)}
                className={inputClase()}
              >
                {unidades.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </Campo>

            <div className="sm:col-span-2">
              <Campo label="Descripción">
                <textarea
                  value={form.descripcion}
                  onChange={(e) => actualizarCampo("descripcion", e.target.value)}
                  placeholder="Detalles relevantes del producto..."
                  rows={3}
                  className={`${inputClase()} resize-none`}
                />
              </Campo>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={() => {
                setForm(initialForm);
                setErrores({});
                setImagenPreview(null);
              }}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Limpiar formulario
            </button>
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
            >
              Registrar producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Campo({ label, error, required, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-amber-600">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}

function inputClase(error) {
  return `w-full rounded-lg border px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900/10 ${
    error
      ? "border-red-300 focus:border-red-400"
      : "border-slate-200 focus:border-slate-400"
  }`;
}
