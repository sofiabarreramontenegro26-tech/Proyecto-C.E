import React, { useState } from "react";

// RQF001 - Registro de usuario
// Formulario para crear una cuenta nueva en el sistema.

export default function RegistroUsuario() {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    password: "",
    confirmar: "",
  });
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!form.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio.";
    if (!/^\S+@\S+\.\S+$/.test(form.correo))
      nuevosErrores.correo = "Correo electrónico no válido.";
    if (form.password.length < 6)
      nuevosErrores.password = "La contraseña debe tener mínimo 6 caracteres.";
    if (form.confirmar !== form.password)
      nuevosErrores.confirmar = "Las contraseñas no coinciden.";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validar()) {
      setEnviado(true);
      // Aquí se conectaría con el backend (API de registro)
      console.log("Usuario registrado:", form);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-slate-200 p-8">
        <h1 className="text-2xl font-semibold text-slate-800 mb-1">
          Crear cuenta
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Completa el formulario para registrarte en el sistema.
        </p>

        {enviado ? (
          <div className="rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 text-sm">
            Registro exitoso. Ya puedes iniciar sesión.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ej: Laura Pérez"
              />
              {errores.nombre && (
                <p className="text-xs text-red-500 mt-1">{errores.nombre}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                name="correo"
                value={form.correo}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="ejemplo@correo.com"
              />
              {errores.correo && (
                <p className="text-xs text-red-500 mt-1">{errores.correo}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
              />
              {errores.password && (
                <p className="text-xs text-red-500 mt-1">{errores.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Confirmar contraseña
              </label>
              <input
                type="password"
                name="confirmar"
                value={form.confirmar}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
              />
              {errores.confirmar && (
                <p className="text-xs text-red-500 mt-1">{errores.confirmar}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              Registrarme
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
