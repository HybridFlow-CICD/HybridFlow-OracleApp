import React from "react";  
import CrearReporte from "./CrearReporte";
import CrearUsuario from "./CrearUsuario";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Sistema de Administración</h1>
        <div className="app-header-line"></div>
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
