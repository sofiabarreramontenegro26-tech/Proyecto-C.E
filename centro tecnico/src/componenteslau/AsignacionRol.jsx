import React, { useState } from "react";

// RQF003 - Asignación de rol
// Permite asignar o cambiar el rol de un usuario existente.

const usuarios = [
  { id: 1, nombre: "Laura Gómez" },
  { id: 2, nombre: "Carlos Ruiz" },
  { id: 3, nombre: "Ana Torres" },
];

const roles = ["Administrador", "Vendedor", "Almacén", "Invitado"];

export default function AsignacionRol() {
  const [usuarioId, setUsuarioId] = useState("");
  const [rol, setRol] = useState("");
  const [confirmacion, setConfirmacion] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!usuarioId || !rol) return;
    const usuario = usuarios.find((u) => u.id === Number(usuarioId));
    setConfirmacion({ usuario: usuario.nombre, rol });
    // Aquí se enviaría la asignación al backend
    console.log("Rol asignado:", { usuarioId, rol });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-slate-200 p-8">
        <h1 className="text-2xl font-semibold text-slate-800 mb-1">Asignación de rol</h1>
        <p className="text-sm text-slate-500 mb-6">
          Selecciona un usuario y el rol que deseas asignarle.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Usuario</label>
            <select
              value={usuarioId}
              onChange={(e) => setUsuarioId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Selecciona un usuario</option>
              {usuarios.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Rol</label>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRol(r)}
                  className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                    rol === r
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-slate-700 border-slate-300 hover:border-indigo-400"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            Asignar rol
          </button>
        </form>

        {confirmacion && (
          <div className="mt-5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 text-sm">
            Se asignó el rol <strong>{confirmacion.rol}</strong> a{" "}
            <strong>{confirmacion.usuario}</strong>.
          </div>
        )}
      </div>
    </div>
  );
}
