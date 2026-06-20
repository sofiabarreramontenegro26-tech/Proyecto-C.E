import React, { useState } from "react";

// RQF006 - Historial de actividad
// Muestra el registro de acciones realizadas por los usuarios en el sistema.

const actividadesIniciales = [
  { id: 1, usuario: "Laura Gómez", accion: "Inicio de sesión", fecha: "2026-06-20 08:15" },
  { id: 2, usuario: "Carlos Ruiz", accion: "Registró una venta #00231", fecha: "2026-06-20 09:02" },
  { id: 3, usuario: "Ana Torres", accion: "Actualizó inventario", fecha: "2026-06-19 17:40" },
  { id: 4, usuario: "Laura Gómez", accion: "Asignó rol a Carlos Ruiz", fecha: "2026-06-19 14:22" },
  { id: 5, usuario: "Carlos Ruiz", accion: "Cierre de sesión", fecha: "2026-06-19 13:58" },
];

export default function HistorialActividad() {
  const [filtro, setFiltro] = useState("");

  const actividadesFiltradas = actividadesIniciales.filter(
    (a) =>
      a.usuario.toLowerCase().includes(filtro.toLowerCase()) ||
      a.accion.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Historial de actividad</h1>
            <p className="text-sm text-slate-500">Registro de acciones realizadas en el sistema.</p>
          </div>
          <input
            type="text"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            placeholder="Buscar por usuario o acción..."
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
          />
        </div>

        <ol className="relative border-l border-slate-200 ml-3">
          {actividadesFiltradas.map((a) => (
            <li key={a.id} className="mb-6 ml-6">
              <span className="absolute -left-1.5 w-3 h-3 bg-indigo-500 rounded-full ring-4 ring-white"></span>
              <p className="text-sm font-medium text-slate-800">{a.accion}</p>
              <p className="text-xs text-slate-500">
                {a.usuario} &middot; {a.fecha}
              </p>
            </li>
          ))}
          {actividadesFiltradas.length === 0 && (
            <p className="text-sm text-slate-400 ml-3">No se encontraron actividades.</p>
          )}
        </ol>
      </div>
    </div>
  );
}
