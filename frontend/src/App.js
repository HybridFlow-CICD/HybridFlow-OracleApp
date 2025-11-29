import React from "react";
import CrearReporte from "./CrearReporte";
import CrearUsuario from "./CrearUsuario";

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Sistema de Administración</h1>
        <div className="app-header-line"></div>

        {/* 🔥 Botón de prueba */}
        <button
          onClick={() => alert("Frontend funcionando 🚀")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            fontWeight: "bold",
            borderRadius: "8px",
            border: "none",
            marginTop: "10px",
            cursor: "pointer",
          }}
        >
          Probar Frontend
        </button>
      </header>

      <div className="section-container">
        <CrearUsuario />
      </div>

      <div className="separator">
        <div className="separator-line"></div>
      </div>

      <div className="section-container">
        <CrearReporte />
      </div>
    </div>
  );
}

export default App;
