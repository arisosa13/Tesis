import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:5095/api";

const motivosPorTipo = {
  Entrada: [
    "Ingreso de mercadería",
    "Devolución de cliente",
    "Ajuste positivo",
  ],
  Salida: [
    "Rotura",
    "Vencimiento",
    "Pérdida",
    "Robo",
    "Consumo interno",
    "Devolución a proveedor",
    "Ajuste negativo",
  ],
};

function MovimientosStock() {
  const [productos, setProductos] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const [idProducto, setIdProducto] = useState("");
  const [tipoMovimiento, setTipoMovimiento] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [motivo, setMotivo] = useState("");
  const [observacion, setObservacion] = useState("");

  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("info");
  const [cargando, setCargando] = useState(false);

  const mostrarMensaje = (texto, tipo = "info") => {
    setMensaje(texto);
    setTipoMensaje(tipo);
  };

  const cargarProductos = async () => {
    try {
      const response = await fetch(`${API_URL}/Productos`, {
        cache: "no-store",
      });

      if (!response.ok) throw new Error();

      const data = await response.json();
      setProductos(Array.isArray(data) ? data : []);
    } catch {
      mostrarMensaje("No se pudieron cargar los productos.", "danger");
    }
  };

  const cargarMovimientos = async () => {
    try {
      const response = await fetch(`${API_URL}/MovimientosStock`, {
        cache: "no-store",
      });

      if (!response.ok) throw new Error();

      const data = await response.json();
      setMovimientos(Array.isArray(data) ? data : []);
    } catch {
      mostrarMensaje("No se pudieron cargar los movimientos de stock.", "danger");
    }
  };

  const recargarTodo = async () => {
    await Promise.all([cargarProductos(), cargarMovimientos()]);
  };

  useEffect(() => {
    recargarTodo();
  }, []);

  useEffect(() => {
    setMotivo("");
  }, [tipoMovimiento]);

  const limpiarFormulario = () => {
    setIdProducto("");
    setTipoMovimiento("");
    setCantidad("");
    setMotivo("");
    setObservacion("");
  };

  const movimientosFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();
    if (!texto) return movimientos;

    return movimientos.filter((mov) => {
      const producto = mov.nombreProducto?.toLowerCase() || "";
      const tipo = mov.tipoMovimiento?.toLowerCase() || "";
      const motivoTexto = mov.motivo?.toLowerCase() || "";

      return (
        producto.includes(texto) ||
        tipo.includes(texto) ||
        motivoTexto.includes(texto)
      );
    });
  }, [movimientos, busqueda]);

  const registrarMovimiento = async () => {
    if (!idProducto) {
      mostrarMensaje("Seleccioná un producto.", "warning");
      return;
    }

    if (!tipoMovimiento) {
      mostrarMensaje("Seleccioná el tipo de movimiento.", "warning");
      return;
    }

    if (!cantidad || Number(cantidad) <= 0) {
      mostrarMensaje("Ingresá una cantidad válida.", "warning");
      return;
    }

    if (!motivo) {
      mostrarMensaje("Seleccioná un motivo.", "warning");
      return;
    }

    try {
      setCargando(true);

      const response = await fetch(`${API_URL}/MovimientosStock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idProducto: Number(idProducto),
          tipoMovimiento,
          cantidad: Number(cantidad),
          motivo,
          observacion: observacion.trim() || null,
          idUsuario: 1,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.mensaje || "No se pudo registrar el movimiento");
      }

      mostrarMensaje(data.mensaje || "Movimiento registrado correctamente.", "success");
      limpiarFormulario();
      await recargarTodo();
    } catch (error) {
      mostrarMensaje(error.message || "No se pudo registrar el movimiento.", "danger");
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="container py-4">
      {mensaje && (
        <div className={`alert alert-${tipoMensaje} shadow-sm`} role="alert">
          {mensaje}
        </div>
      )}

      <section className="custom-card clientes-section-top mb-4">
        <div className="clientes-block-header">
          <div>
            <p className="clientes-kicker">Control de stock</p>
            <h2 className="clientes-title">Registrar movimiento</h2>
          </div>
          <span className="section-step">Stock</span>
        </div>

        <div className="row g-3 mt-1">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Producto</label>
            <select
              className="form-select"
              value={idProducto}
              onChange={(e) => setIdProducto(e.target.value)}
            >
              <option value="">Seleccionar producto</option>
              {productos.map((producto) => (
                <option key={producto.idProducto} value={producto.idProducto}>
                  {producto.nombreProducto} - {producto.presentacion || "Sin presentación"}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold">Tipo de movimiento</label>
            <select
              className="form-select"
              value={tipoMovimiento}
              onChange={(e) => setTipoMovimiento(e.target.value)}
            >
              <option value="">Seleccionar</option>
              <option value="Entrada">Entrada</option>
              <option value="Salida">Salida</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold">Cantidad</label>
            <input
              type="number"
              className="form-control"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              placeholder="Ej: 3"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Motivo</label>
            <select
              className="form-select"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              disabled={!tipoMovimiento}
            >
              <option value="">Seleccionar motivo</option>
              {(motivosPorTipo[tipoMovimiento] || []).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Observación</label>
            <input
              type="text"
              className="form-control"
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              placeholder="Ej: Botellas dañadas en depósito"
            />
          </div>
        </div>

        <div className="d-flex gap-2 flex-wrap mt-4">
          <button
            className="btn btn-success"
            onClick={registrarMovimiento}
            disabled={cargando}
          >
            Registrar movimiento
          </button>

          <button className="btn btn-outline-secondary" onClick={limpiarFormulario}>
            Limpiar
          </button>
        </div>
      </section>

      <section className="custom-card clientes-section-bottom">
        <div className="clientes-block-header">
          <div>
            <p className="clientes-kicker">Historial</p>
            <h2 className="clientes-title">Movimientos registrados</h2>
          </div>
          <span className="section-step">{movimientosFiltrados.length} resultados</span>
        </div>

        <div className="mb-4 mt-2">
          <label className="form-label fw-semibold">Buscar movimiento</label>
          <input
            type="text"
            className="form-control"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por producto, tipo o motivo"
          />
        </div>

        <div className="clientes-listado">
          {movimientosFiltrados.length > 0 ? (
            movimientosFiltrados.map((mov) => (
              <article key={mov.idMovimiento} className="cliente-card cliente-card-separated">
                <div className="cliente-card-header">
                  <div className="cliente-header-left">
                    <h5 className="cliente-nombre">{mov.nombreProducto}</h5>
                    <span className="cliente-id-real">Movimiento #{mov.idMovimiento}</span>
                  </div>

                  <div className="d-flex gap-2 flex-wrap">
                    <span
                      className={`badge ${
                        mov.tipoMovimiento === "Entrada" ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {mov.tipoMovimiento}
                    </span>
                  </div>
                </div>

                <div className="cliente-info-grid">
                  <div className="cliente-info-item">
                    <span className="cliente-label">Cantidad</span>
                    <span className="cliente-value">{mov.cantidad}</span>
                  </div>

                  <div className="cliente-info-item">
                    <span className="cliente-label">Motivo</span>
                    <span className="cliente-value">{mov.motivo}</span>
                  </div>

                  <div className="cliente-info-item">
                    <span className="cliente-label">Fecha</span>
                    <span className="cliente-value">
                      {new Date(mov.fechaMovimiento).toLocaleString()}
                    </span>
                  </div>

                  <div className="cliente-info-item full-width">
                    <span className="cliente-label">Observación</span>
                    <span className="cliente-value">{mov.observacion || "-"}</span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <p>No se encontraron movimientos.</p>
              <small>Registrá un movimiento para comenzar.</small>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default MovimientosStock;