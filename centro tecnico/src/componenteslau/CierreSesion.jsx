import React, { useState } from "react";

// RQF005 - Cierre de sesión
// Botón de cierre de sesión con confirmación.

export default function CierreSesion({ nombreUsuario = "Laura Gómez" }) {
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [sesionCerrada, setSesionCerrada] = useState(false);

  const cerrarSesion = () => {
    // Aquí se limpiaría el token/sesión y se redirigiría al login
    console.log("Sesión cerrada");
    setSesionCerrada(true);
    setMostrarConfirmacion(false);
  };

  if (sesionCerrada) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-slate-800 mb-2">
            Sesión cerrada
          </h1>
          <p className="text-sm text-slate-500">Has salido del sistema correctamente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md border border-slate-200 p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Conectado como</p>
          <p className="font-medium text-slate-800">{nombreUsuario}</p>
        </div>

        <button
          onClick={() => setMostrarConfirmacion(true)}
          className="text-sm font-medium text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 rounded-lg px-3 py-2 transition-colors"
        >
          Cerrar sesión
        </button>
      </div>

      {mostrarConfirmacion && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">
              ¿Cerrar sesión?
            </h2>
            <p className="text-sm text-slate-500 mb-5">
              Tendrás que volver a iniciar sesión para acceder al sistema.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setMostrarConfirmacion(false)}
                className="px-4 py-2 text-sm rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={cerrarSesion}
                className="px-4 py-2 text-sm rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
