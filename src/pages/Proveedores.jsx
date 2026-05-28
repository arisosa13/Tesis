import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:5095/api";

function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const [idEditando, setIdEditando] = useState(null);

  const [razonSocial, setRazonSocial] = useState("");
  const [nombreContacto, setNombreContacto] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");

  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("info");
  const [cargando, setCargando] = useState(false);

  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [proveedorAEliminar, setProveedorAEliminar] = useState(null);

  const mostrarMensaje = (texto, tipo = "info") => {
    setMensaje(texto);
    setTipoMensaje(tipo);
  };

  const cargarProveedores = async () => {
    try {
      const response = await fetch(`${API_URL}/Proveedores`, { cache: "no-store" });
      if (!response.ok) throw new Error();

      const data = await response.json();
      setProveedores(Array.isArray(data) ? data : []);
    } catch {
      mostrarMensaje("No se pudieron cargar los proveedores.", "danger");
    }
  };

  useEffect(() => {
    cargarProveedores();
  }, []);

  const proveedoresFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();
    if (!texto) return proveedores;

    return proveedores.filter((proveedor) => {
      const razon = proveedor.razonSocial?.toLowerCase() || "";
      const contacto = proveedor.nombreContacto?.toLowerCase() || "";
      const id = String(proveedor.idProveedor || "");
      const mail = proveedor.email?.toLowerCase() || "";

      return (
        razon.includes(texto) ||
        contacto.includes(texto) ||
        id.includes(texto) ||
        mail.includes(texto)
      );
    });
  }, [proveedores, busqueda]);

  const limpiarFormulario = () => {
    setIdEditando(null);
    setRazonSocial("");
    setNombreContacto("");
    setTelefono("");
    setEmail("");
    setDireccion("");
  };

  const cargarEnFormulario = (proveedor) => {
    setIdEditando(proveedor.idProveedor);
    setRazonSocial(proveedor.razonSocial || "");
    setNombreContacto(proveedor.nombreContacto || "");
    setTelefono(proveedor.telefono || "");
    setEmail(proveedor.email || "");
    setDireccion(proveedor.direccion || "");
    mostrarMensaje(`Editando proveedor: ${proveedor.razonSocial}`, "info");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const guardarProveedor = async () => {
    if (!razonSocial.trim()) {
      mostrarMensaje("Ingresá la razón social.", "warning");
      return;
    }

    try {
      setCargando(true);

      const payload = {
        razonSocial: razonSocial.trim(),
        nombreContacto: nombreContacto.trim() || null,
        telefono: telefono.trim() || null,
        email: email.trim() || null,
        direccion: direccion.trim() || null,
      };

      let response;

      if (idEditando) {
        response = await fetch(`${API_URL}/Proveedores/${idEditando}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(`${API_URL}/Proveedores`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.mensaje || "No se pudo guardar el proveedor");
      }

      mostrarMensaje(
        data.mensaje ||
          (idEditando
            ? "Proveedor modificado correctamente."
            : "Proveedor agregado correctamente."),
        "success"
      );

      limpiarFormulario();
      await cargarProveedores();
    } catch (error) {
      mostrarMensaje(error.message || "No se pudo guardar el proveedor.", "danger");
    } finally {
      setCargando(false);
    }
  };

  const pedirEliminarProveedor = (proveedor) => {
    setProveedorAEliminar(proveedor);
    setMostrarModalEliminar(true);
  };

  const confirmarEliminarProveedor = async () => {
    if (!proveedorAEliminar) return;

    try {
      setCargando(true);

      const response = await fetch(`${API_URL}/Proveedores/${proveedorAEliminar.idProveedor}`, {
        method: "DELETE",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.mensaje || "No se pudo eliminar el proveedor");
      }

      mostrarMensaje(data.mensaje || "Proveedor eliminado correctamente.", "success");

      if (idEditando === proveedorAEliminar.idProveedor) {
        limpiarFormulario();
      }

      await cargarProveedores();
    } catch (error) {
      mostrarMensaje(error.message || "No se pudo eliminar el proveedor.", "danger");
    } finally {
      setCargando(false);
      setMostrarModalEliminar(false);
      setProveedorAEliminar(null);
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
            <p className="clientes-kicker">Gestión de proveedores</p>
            <h2 className="clientes-title">
              {idEditando ? `Modificar proveedor #${idEditando}` : "Agregar proveedor"}
            </h2>
          </div>
          <span className="section-step">{idEditando ? "Edición" : "Alta"}</span>
        </div>

        <div className="row g-3 mt-1">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Razón social</label>
            <input
              type="text"
              className="form-control"
              value={razonSocial}
              onChange={(e) => setRazonSocial(e.target.value)}
              placeholder="Ej: Coca Cola SA"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Nombre de contacto</label>
            <input
              type="text"
              className="form-control"
              value={nombreContacto}
              onChange={(e) => setNombreContacto(e.target.value)}
              placeholder="Ej: Juan Pérez"
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
              placeholder="Ej: proveedor@email.com"
            />
          </div>

          <div className="col-12">
            <label className="form-label fw-semibold">Dirección</label>
            <input
              type="text"
              className="form-control"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Ej: Av. Industrial 456"
            />
          </div>
        </div>

        <div className="d-flex gap-2 flex-wrap mt-4">
          <button className="btn btn-success" onClick={guardarProveedor} disabled={cargando}>
            {idEditando ? "Guardar cambios" : "Agregar proveedor"}
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
            <h2 className="clientes-title">Registro de proveedores</h2>
          </div>
          <span className="section-step">{proveedoresFiltrados.length} resultados</span>
        </div>

        <div className="mb-4 mt-2">
          <label className="form-label fw-semibold">Buscar proveedor</label>
          <input
            type="text"
            className="form-control"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por razón social, contacto, número o email"
          />
        </div>

        <div className="clientes-listado">
          {proveedoresFiltrados.length > 0 ? (
            proveedoresFiltrados.map((proveedor) => (
              <article key={proveedor.idProveedor} className="cliente-card cliente-card-separated">
                <div className="cliente-card-header">
                  <div className="cliente-header-left">
                    <h5 className="cliente-nombre">{proveedor.razonSocial}</h5>
                    <span className="cliente-id-real">ID: {proveedor.idProveedor}</span>
                  </div>

                  <div className="cliente-actions">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => cargarEnFormulario(proveedor)}
                    >
                      Modificar
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => pedirEliminarProveedor(proveedor)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                <div className="cliente-info-grid">
                  <div className="cliente-info-item">
                    <span className="cliente-label">Contacto</span>
                    <span className="cliente-value">{proveedor.nombreContacto || "-"}</span>
                  </div>

                  <div className="cliente-info-item">
                    <span className="cliente-label">Teléfono</span>
                    <span className="cliente-value">{proveedor.telefono || "-"}</span>
                  </div>

                  <div className="cliente-info-item">
                    <span className="cliente-label">Email</span>
                    <span className="cliente-value break-text">{proveedor.email || "-"}</span>
                  </div>

                  <div className="cliente-info-item full-width">
                    <span className="cliente-label">Dirección</span>
                    <span className="cliente-value">{proveedor.direccion || "-"}</span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <p>No se encontraron proveedores.</p>
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
                  <h5 className="modal-title">Eliminar proveedor</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setMostrarModalEliminar(false);
                      setProveedorAEliminar(null);
                    }}
                  ></button>
                </div>

                <div className="modal-body pt-2">
                  <p className="mb-2">¿Deseás eliminar este proveedor?</p>
                  <div className="p-3 rounded bg-light border">
                    <strong>{proveedorAEliminar?.razonSocial}</strong>
                  </div>
                </div>

                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setMostrarModalEliminar(false);
                      setProveedorAEliminar(null);
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={confirmarEliminarProveedor}
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

export default Proveedores;