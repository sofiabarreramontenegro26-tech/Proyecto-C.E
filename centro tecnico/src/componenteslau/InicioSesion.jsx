import React, { useState } from "react";

// RQF004 - Inicio de sesión
// Formulario de autenticación de usuarios.

export default function InicioSesion() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!correo || !password) {
      setError("Completa todos los campos.");
      return;
    }

    setCargando(true);
    // Simulación de llamada al backend de autenticación
    setTimeout(() => {
      setCargando(false);
      console.log("Intento de inicio de sesión:", { correo, password });
      // Aquí se validaría la respuesta del servidor
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md border border-slate-200 p-8">
        <h1 className="text-2xl font-semibold text-slate-800 mb-1">Iniciar sesión</h1>
        <p className="text-sm text-slate-500 mb-6">
          Ingresa tus credenciales para acceder al sistema.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="ejemplo@correo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>

          <p className="text-center text-sm text-slate-500">
            ¿Olvidaste tu contraseña?{" "}
            <a href="#" className="text-indigo-600 hover:underline">
              Recuperarla
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
