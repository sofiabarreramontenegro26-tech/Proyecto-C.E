import React, { useState } from "react";

// RQF002 - Gestión de usuarios
// Listado, búsqueda, activación/desactivación y eliminación de usuarios.

const usuariosIniciales = [
  { id: 1, nombre: "Laura Gómez", correo: "laura@correo.com", rol: "Administrador", activo: true },
  { id: 2, nombre: "Carlos Ruiz", correo: "carlos@correo.com", rol: "Vendedor", activo: true },
  { id: 3, nombre: "Ana Torres", correo: "ana@correo.com", rol: "Almacén", activo: false },
];

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState(usuariosIniciales);
  const [busqueda, setBusqueda] = useState("");

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.correo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const toggleActivo = (id) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === id ? { ...u, activo: !u.activo } : u))
    );
  };

  const eliminarUsuario = (id) => {
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Gestión de usuarios</h1>
            <p className="text-sm text-slate-500">Administra las cuentas registradas en el sistema.</p>
          </div>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o correo..."
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
          />
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Correo</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usuariosFiltrados.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{u.nombre}</td>
                  <td className="px-4 py-3 text-slate-600">{u.correo}</td>
                  <td className="px-4 py-3 text-slate-600">{u.rol}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        u.activo
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {u.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => toggleActivo(u.id)}
                      className="text-indigo-600 hover:text-indigo-800 text-xs font-medium"
                    >
                      {u.activo ? "Desactivar" : "Activar"}
                    </button>
                    <button
                      onClick={() => eliminarUsuario(u.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {usuariosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center text-slate-400">
                    No se encontraron usuarios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
