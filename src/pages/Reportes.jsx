import { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const API_URL = "http://localhost:5095/api";

function Reportes() {
  const [productos, setProductos] = useState([]);
  const [productosMasVendidos, setProductosMasVendidos] = useState([]);

 useEffect(() => {
  cargarProductos();
  cargarProductosMasVendidos();
}, []);
 

  const cargarProductos = async () => {
    try {
      const response = await fetch(`${API_URL}/Productos`, {
        cache: "no-store",
      });

      const data = await response.json();

      setProductos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("No se pudieron cargar los productos");
    }
  };
  const cargarProductosMasVendidos = async () => {
  try {
    const response = await fetch(
      `${API_URL}/Reportes/productos-mas-vendidos`,
      {
        cache: "no-store",
      }
    );

    const data = await response.json();

    setProductosMasVendidos(
      Array.isArray(data) ? data : []
    );
  } catch (error) {
    console.error(
      "No se pudieron cargar los productos más vendidos"
    );
  }
};

  const productosStockBajo = useMemo(() => {
  return productos.filter(
    (p) =>
      Number(p.stockActual || 0) <=
      Number(p.stockMinimo || 0)
  );
}, [productos]);

const datosGraficoStock = useMemo(() => {
  return productosStockBajo.map((p) => ({
    nombre: p.nombreProducto,
    stockActual: Number(p.stockActual || 0),
    stockMinimo: Number(p.stockMinimo || 0),
  }));
}, [productosStockBajo]);
  const exportarPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(20);

  doc.text("StockIt! - Reporte de Stock Bajo", 14, 20);

  doc.setFontSize(11);

  doc.text(
    `Fecha: ${new Date().toLocaleDateString()}`,
    14,
    30
  );

  autoTable(doc, {
    startY: 40,

    head: [
      [
        "Producto",
        "Marca",
        "Presentación",
        "Stock Actual",
        "Stock Mínimo",
      ],
    ],

    body: productosStockBajo.map((p) => [
      p.nombreProducto,
      p.marca || "-",
      p.presentacion || "-",
      p.stockActual,
      p.stockMinimo,
    ]),
  });

  doc.save("reporte-stock-bajo.pdf");
};

  return (
    <main className="container py-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <button
  className="btn btn-danger"
  onClick={exportarPDF}
>
  Exportar PDF
</button>
        <div>
          <h2 className="mb-1">Reportes</h2>

          <p className="text-muted mb-0">
            Productos con stock crítico.
          </p>
        </div>

        <span className="badge bg-danger fs-6 px-3 py-2">
          {productosStockBajo.length} productos críticos
        </span>
      </div>
      <div className="card shadow-sm border-0 mb-4">
  <div className="card-body">
    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
      <div>
        <h4 className="mb-1">
          Productos más vendidos
        </h4>

        <p className="text-muted mb-0">
          Top productos con mayor cantidad vendida.
        </p>
      </div>
    </div>

    {productosMasVendidos.length > 0 ? (
      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>
  <PieChart>
    <Pie
      data={productosMasVendidos}
      dataKey="cantidadVendida"
      nameKey="producto"
      cx="50%"
      cy="50%"
      outerRadius={120}
      label
    >
      {productosMasVendidos.map((entry, index) => {
        const colores = [
          "#2563eb",
          "#dc2626",
          "#16a34a",
          "#ca8a04",
          "#9333ea",
          "#0891b2",
          "#ea580c",
          "#4f46e5",
        ];

        return (
          <Cell
            key={`cell-${index}`}
            fill={colores[index % colores.length]}
          />
        );
      })}
    </Pie>

    <Tooltip />

    <Legend />
  </PieChart>
</ResponsiveContainer>
      </div>
    ) : (
      <div className="text-center py-5 text-muted">
        No hay ventas registradas.
      </div>
    )}
  </div>
</div>
<div className="card shadow-sm border-0 mb-4">
  <div className="card-body">
    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
      <div>
        <h4 className="mb-1">
          Gráfico de stock crítico
        </h4>

        <p className="text-muted mb-0">
          Comparación entre stock actual y stock mínimo.
        </p>
      </div>
    </div>

    {datosGraficoStock.length > 0 ? (
      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>
          <BarChart data={datosGraficoStock}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="nombre" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="stockActual"
              fill="#dc3545"
              name="Stock actual"
              radius={[10, 10, 0, 0]}
            />

            <Bar
              dataKey="stockMinimo"
              fill="#facc15"
              name="Stock mínimo"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    ) : (
      <div className="text-center py-5 text-muted">
        No hay productos con stock bajo para graficar.
      </div>
    )}
  </div>
</div>
      <div className="card shadow-sm border-0">
        <div className="card-body">
          {productosStockBajo.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Producto</th>
                    <th>Marca</th>
                    <th>Presentación</th>
                    <th className="text-center">
                      Stock actual
                    </th>
                    <th className="text-center">
                      Stock mínimo
                    </th>
                    <th className="text-center">
                      Estado
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {productosStockBajo.map((producto) => (
                    <tr key={producto.idProducto}>
                      <td>
                        <div className="fw-semibold">
                          {producto.nombreProducto}
                        </div>
                      </td>

                      <td>
                        {producto.marca || "-"}
                      </td>

                      <td>
                        {producto.presentacion || "-"}
                      </td>

                      <td className="text-center">
                        <span className="badge bg-danger">
                          {producto.stockActual}
                        </span>
                      </td>

                      <td className="text-center">
                        {producto.stockMinimo}
                      </td>

                      <td className="text-center">
                        <span className="badge bg-warning text-dark">
                          Stock bajo
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5 text-muted">
              No hay productos con stock bajo.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Reportes;