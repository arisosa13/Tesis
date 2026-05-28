import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:5095/api";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const [idEditando, setIdEditando] = useState(null);

  const [nombreCliente, setNombreCliente] = useState("");
  const [cuit, setCuit] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");

  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("info");
  const [cargando, setCargando] = useState(false);

  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);

  const mostrarMensaje = (texto, tipo = "info") => {
    setMensaje(texto);
    setTipoMensaje(tipo);
  };

  const cargarClientes = async () => {
    try {
      const response = await fetch(`${API_URL}/Clientes`, { cache: "no-store" });
      if (!response.ok) throw new Error();

      const data = await response.json();
      setClientes(Array.isArray(data) ? data : []);
    } catch {
      mostrarMensaje("No se pudieron cargar los clientes.", "danger");
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

const clientesFiltrados = useMemo(() => {
  const texto = busqueda.toLowerCase().trim();

  if (!texto) return clientes;

  return clientes.filter((c) => {
    const nombre = c.nombreCliente?.toLowerCase() || "";
    const numeroCliente = String(c.idCliente || "");
    const cuit = c.cuit?.toLowerCase() || "";
    const telefono = c.telefono?.toLowerCase() || "";
    const ciudad = c.ciudad?.toLowerCase() || "";
    const email = c.email?.toLowerCase() || "";

    return (
      nombre.includes(texto) ||
      numeroCliente.includes(texto) ||
      cuit.includes(texto) ||
      telefono.includes(texto) ||
      ciudad.includes(texto) ||
      email.includes(texto)
    );
  });
}, [clientes, busqueda]);

  const limpiarFormulario = () => {
    setIdEditando(null);
    setNombreCliente("");
    setCuit("");
    setTelefono("");
    setEmail("");
    setDireccion("");
    setCiudad("");
  };

  const cargarEnFormulario = (cliente) => {
    setIdEditando(cliente.idCliente);
    setNombreCliente(cliente.nombreCliente || "");
    setCuit(cliente.cuit || "");
    setTelefono(cliente.telefono || "");
    setEmail(cliente.email || "");
    setDireccion(cliente.direccion || "");
    setCiudad(cliente.ciudad || "");
    mostrarMensaje(`Editando cliente: ${cliente.nombreCliente}`, "info");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const guardarCliente = async () => {
    if (!nombreCliente.trim()) {
      mostrarMensaje("Ingresá el nombre del cliente.", "warning");
      return;
    }

    try {
      setCargando(true);

      const payload = {
        nombreCliente: nombreCliente.trim(),
        cuit: cuit.trim() || null,
        telefono: telefono.trim() || null,
        email: email.trim() || null,
        direccion: direccion.trim() || null,
        ciudad: ciudad.trim() || null,
      };

      let response;

      if (idEditando) {
        response = await fetch(`${API_URL}/Clientes/${idEditando}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(`${API_URL}/Clientes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.mensaje || "No se pudo guardar el cliente");
      }

      mostrarMensaje(
        data.mensaje ||
          (idEditando
            ? "Cliente modificado correctamente."
            : "Cliente agregado correctamente."),
        "success"
      );

      limpiarFormulario();
      await cargarClientes();
    } catch (error) {
      mostrarMensaje(error.message || "No se pudo guardar el cliente.", "danger");
    } finally {
      setCargando(false);
    }
  };

  const pedirEliminarCliente = (cliente) => {
    setClienteAEliminar(cliente);
    setMostrarModalEliminar(true);
  };

  const confirmarEliminarCliente = async () => {
    if (!clienteAEliminar) return;

    try {
      setCargando(true);

      const response = await fetch(`${API_URL}/Clientes/${clienteAEliminar.idCliente}`, {
        method: "DELETE",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.mensaje || "No se pudo eliminar el cliente");
      }

      mostrarMensaje(data.mensaje || "Cliente eliminado correctamente.", "success");

      if (idEditando === clienteAEliminar.idCliente) {
        limpiarFormulario();
      }

      await cargarClientes();
    } catch (error) {
      mostrarMensaje(error.message || "No se pudo eliminar el cliente.", "danger");
    } finally {
      setCargando(false);
      setMostrarModalEliminar(false);
      setClienteAEliminar(null);
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
            <p className="clientes-kicker">Gestión de clientes</p>
            <h2 className="clientes-title">
              {idEditando ? `Modificar cliente #${idEditando}` : "Agregar cliente"}
            </h2>
          </div>
          <span className="section-step">{idEditando ? "Edición" : "Alta"}</span>
        </div>

        <div className="row g-3 mt-1">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Nombre del cliente</label>
            <input
              type="text"
              className="form-control"
              value={nombreCliente}
              onChange={(e) => setNombreCliente(e.target.value)}
              placeholder="Ej: Juan Pérez"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">CUIT</label>
            <input
              type="text"
              className="form-control"
              value={cuit}
              onChange={(e) => setCuit(e.target.value)}
              placeholder="Ej: 20-12345678-9"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Teléfono</label>
            <input
              type="text"
              className="form-control"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Ej: 3811234567"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ej: cliente@email.com"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Dirección</label>
            <input
              type="text"
              className="form-control"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Ej: Av. Siempre Viva 123"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Ciudad</label>
            <input
              type="text"
              className="form-control"
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              placeholder="Ej: San Miguel de Tucumán"
            />
          </div>
        </div>

        <div className="d-flex gap-2 flex-wrap mt-4">
          <button className="btn btn-success" onClick={guardarCliente} disabled={cargando}>
            {idEditando ? "Guardar cambios" : "Agregar cliente"}
          </button>

          <button className="btn btn-outline-secondary" onClick={limpiarFormulario}>
            Limpiar
          </button>
        </div>
      </section>

      <section className="custom-card clientes-section-bottom">
        <div className="clientes-block-header">
          <div>
            <p className="clientes-kicker">Listado</p>
            <h2 className="clientes-title">Registro de clientes</h2>
          </div>
          <span className="section-step">{clientesFiltrados.length} resultados</span>
        </div>

        <div className="mb-4 mt-2">
          <label className="form-label fw-semibold">Buscar cliente</label>
          <input
            type="text"
            className="form-control"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, número, email o ciudad"
          />
        </div>

        <div className="clientes-listado">
          {clientesFiltrados.length > 0 ? (
            clientesFiltrados.map((cliente) => (
              <article key={cliente.idCliente} className="cliente-card cliente-card-separated">
                <div className="cliente-card-header">
                  <div className="cliente-header-left">
                    <h5 className="cliente-nombre">{cliente.nombreCliente}</h5>
                    <span className="cliente-id-real">ID: {cliente.idCliente}</span>
                  </div>

                  <div className="cliente-actions">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => cargarEnFormulario(cliente)}
                    >
                      Modificar
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => pedirEliminarCliente(cliente)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                <div className="cliente-info-grid">
                  <div className="cliente-info-item">
                    <span className="cliente-label">CUIT</span>
                    <span className="cliente-value">{cliente.cuit || "-"}</span>
                  </div>

                  <div className="cliente-info-item">
                    <span className="cliente-label">Teléfono</span>
                    <span className="cliente-value">{cliente.telefono || "-"}</span>
                  </div>

                  <div className="cliente-info-item">
                    <span className="cliente-label">Email</span>
                    <span className="cliente-value break-text">{cliente.email || "-"}</span>
                  </div>

                  <div className="cliente-info-item">
                    <span className="cliente-label">Ciudad</span>
                    <span className="cliente-value">{cliente.ciudad || "-"}</span>
                  </div>

                  <div className="cliente-info-item full-width">
                    <span className="cliente-label">Dirección</span>
                    <span className="cliente-value">{cliente.direccion || "-"}</span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <p>No se encontraron clientes.</p>
              <small>Probá con otro criterio de búsqueda.</small>
            </div>
          )}
        </div>
      </section>

      {mostrarModalEliminar && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content shadow">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title">Eliminar cliente</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setMostrarModalEliminar(false);
                      setClienteAEliminar(null);
                    }}
                  ></button>
                </div>

                <div className="modal-body pt-2">
                  <p className="mb-2">¿Deseás eliminar este cliente?</p>
                  <div className="p-3 rounded bg-light border">
                    <strong>{clienteAEliminar?.nombreCliente}</strong>
                  </div>
                </div>

                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setMostrarModalEliminar(false);
                      setClienteAEliminar(null);
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={confirmarEliminarCliente}
                    disabled={cargando}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </main>
  );
}

export default Clientes;