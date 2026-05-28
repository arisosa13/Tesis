import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5095/api";

function Inicio() {
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    cargarDatosDashboard();
  }, []);

  const cargarDatosDashboard = async () => {
  try {
    const [resProductos, resClientes, resPedidos] = await Promise.all([
      fetch(`${API_URL}/Productos`, { cache: "no-store" }),
      fetch(`${API_URL}/Clientes`, { cache: "no-store" }),
      fetch(`${API_URL}/Pedidos`, { cache: "no-store" }),
    ]);

    if (!resProductos.ok) throw new Error("Productos no responde");
    if (!resClientes.ok) throw new Error("Clientes no responde");
    if (!resPedidos.ok) throw new Error("Pedidos no responde");

    const dataProductos = await resProductos.json();
    const dataClientes = await resClientes.json();
    const dataPedidos = await resPedidos.json();

    console.log("Productos:", dataProductos);
    console.log("Clientes:", dataClientes);
    console.log("Pedidos:", dataPedidos);

    setProductos(Array.isArray(dataProductos) ? dataProductos : []);
    setClientes(Array.isArray(dataClientes) ? dataClientes : []);
    setPedidos(Array.isArray(dataPedidos) ? dataPedidos : []);
  } catch (error) {
    console.error("Error dashboard:", error);
  }
};

  const stockBajo = productos.filter(
    (p) => Number(p.stockActual || 0) <= Number(p.stockMinimo || 0)
  ).length;

  return (
    <main className="container py-4">
      <section className="hero-panel mb-4">
        <div className="hero-panel-content">
          <p className="hero-badge">StockIt! / Sistema de Gestión</p>
          <h1>StockIt!</h1>
          <p className="hero-text">
            La forma más inteligente de stockear tu negocio.
          </p>
        </div>
      </section>

      <section className="row g-4 mb-4">
  <div className="col-md-3">
    <div className="dashboard-stats-card card-productos">
      <div className="dashboard-icon">📦</div>

      <h2>{productos.length}</h2>

      <p>Productos registrados</p>
    </div>
  </div>

  <div className="col-md-3">
    <div className="dashboard-stats-card card-clientes">
      <div className="dashboard-icon">👥</div>

      <h2>{clientes.length}</h2>

      <p>Clientes activos</p>
    </div>
  </div>

  <div className="col-md-3">
    <div className="dashboard-stats-card card-pedidos">
      <div className="dashboard-icon">🛒</div>

      <h2>{pedidos.length}</h2>

      <p>Pedidos registrados</p>
    </div>
  </div>

  <div className="col-md-3">
    <div className="dashboard-stats-card card-stock">
      <div className="dashboard-icon">⚠</div>

      <h2>{stockBajo}</h2>

      <p>Stock bajo</p>
    </div>
  </div>
</section>

      <section className="row g-4">
        <div className="col-md-6 col-xl-3">
          <div className="dashboard-card h-100">
            <h3>🛒 Pedidos</h3>
            <p>Crear pedidos, agregar productos y consultar el historial.</p>
            <button className="btn btn-primary" onClick={() => navigate("/pedidos")}>
              Ir a Pedidos
            </button>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="dashboard-card h-100">
            <h3>👥 Clientes</h3>
            <p>Registrar clientes, modificar sus datos y buscar información.</p>
            <button className="btn btn-success" onClick={() => navigate("/clientes")}>
              Ir a Clientes
            </button>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="dashboard-card h-100">
            <h3>📦 Productos</h3>
            <p>Gestionar productos, precios, stock, categorías e imágenes.</p>
            <button
              className="btn btn-warning text-dark"
              onClick={() => navigate("/productos")}
            >
              Ir a Productos
            </button>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="dashboard-card h-100">
            <h3>🚚 Proveedores</h3>
            <p>Mantener actualizado el registro de proveedores.</p>
            <button
              className="btn btn-info text-dark"
              onClick={() => navigate("/proveedores")}
            >
              Ir a Proveedores
            </button>
          </div>
        </div>

       <div className="col-md-6 col-xl-3">
  <div className="dashboard-card h-100">
    <h3>📊 Movimientos de stock</h3>
    <p>Registrar ingresos, ajustes, roturas y vencimientos.</p>
    <button
      className="btn btn-dark"
      onClick={() => navigate("/movimientos-stock")}
    >
      Ir a Stock
    </button>
  </div>
</div>

<div className="col-md-6 col-xl-3">
  <div className="dashboard-card h-100">
    <h3>📈 Reportes</h3>
    <p>
      Consultar productos con stock bajo y analizar información importante del sistema.
    </p>
    <button
      className="btn btn-secondary"
      onClick={() => navigate("/reportes")}
    >
      Ir a Reportes
    </button>
  </div>
</div>
      </section>
    </main>
  );
}

export default Inicio;