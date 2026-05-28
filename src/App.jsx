import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Inicio from "./pages/Inicio";
import Pedidos from "./pages/Pedidos";
import Clientes from "./pages/Clientes";
import Productos from "./pages/Productos";
import Proveedores from "./pages/Proveedores";
import MovimientosStock from "./pages/MovimientosStock";
import Reportes from "./pages/Reportes";

import "./App.css";

function App() {
  const usuarioLogueado = JSON.parse(
    localStorage.getItem("usuarioLogueado")
  );

  if (!usuarioLogueado) {
    return <Login />;
  }

  return (
    <div className="app-shell">
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/inicio" replace />} />

        <Route path="/inicio" element={<Inicio />} />

        <Route path="/pedidos" element={<Pedidos />} />

        <Route path="/clientes" element={<Clientes />} />

        <Route path="/productos" element={<Productos />} />

        <Route path="/proveedores" element={<Proveedores />} />

        <Route
          path="/movimientos-stock"
          element={<MovimientosStock />}
          
        />
        <Route
  path="/reportes"
  element={<Reportes />}
/>
      </Routes>
    </div>
  );
}

export default App;