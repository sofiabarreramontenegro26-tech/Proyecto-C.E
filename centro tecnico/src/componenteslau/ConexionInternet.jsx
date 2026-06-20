import React, { useState, useEffect } from "react";

// RQF026 - Conexión a internet
// Indicador del estado de conexión a internet del usuario.

export default function ConexionInternet() {
  const [enLinea, setEnLinea] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setEnLinea(true);
    const handleOffline = () => setEnLinea(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md border border-slate-200 p-6 text-center">
        <div
          className={`mx-auto mb-4 w-14 h-14 rounded-full flex items-center justify-center ${
            enLinea ? "bg-emerald-100" : "bg-red-100"
          }`}
        >
          <span
            className={`w-4 h-4 rounded-full ${
              enLinea ? "bg-emerald-500" : "bg-red-500"
            }`}
          ></span>
        </div>

        <h1 className="text-lg font-semibold text-slate-800 mb-1">
          {enLinea ? "Conectado a internet" : "Sin conexión a internet"}
        </h1>
        <p className="text-sm text-slate-500">
          {enLinea
            ? "El sistema está sincronizando datos correctamente."
            : "Verifica tu red. Algunas funciones pueden no estar disponibles."}
        </p>

        {!enLinea && (
          <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2 text-xs">
            Los cambios se guardarán localmente y se sincronizarán cuando vuelva la conexión.
          </div>
        )}
      </div>
    </div>
  );
}
