import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:5095/api";

function Pedidos() {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  const [busquedaPedido, setBusquedaPedido] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");

  const [idPedidoActual, setIdPedidoActual] = useState(null);
  const [estadoPedidoActual, setEstadoPedidoActual] = useState("");
  const [fechaPedidoActual, setFechaPedidoActual] = useState("");
  const [clientePedidoActual, setClientePedidoActual] = useState("");
  const [usuarioPedidoActual, setUsuarioPedidoActual] = useState("");

  const [idCliente, setIdCliente] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [pedidoDetalle, setPedidoDetalle] = useState([]);
  const [mostrarClientes, setMostrarClientes] = useState(false);

  const [busquedaCliente, setBusquedaCliente] = useState("");

  const [filtroNombreProducto, setFiltroNombreProducto] = useState("");
  const [filtroMarcaProducto, setFiltroMarcaProducto] = useState("");
  const [filtroPresentacionProducto, setFiltroPresentacionProducto] = useState("");

  const [idProductoSeleccionado, setIdProductoSeleccionado] = useState("");
  const [cantidadProducto, setCantidadProducto] = useState("");

  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("info");
  const [cargando, setCargando] = useState(false);

  const [mostrarModalCancelar, setMostrarModalCancelar] = useState(false);
  const [pedidoACancelar, setPedidoACancelar] = useState(null);

  const [mostrarModalConfirmar, setMostrarModalConfirmar] = useState(false);

  const [idProductoEditando, setIdProductoEditando] = useState(null);
  const [cantidadEditando, setCantidadEditando] = useState("");

  const mostrarMensaje = (texto, tipo = "info") => {
    setMensaje(texto);
    setTipoMensaje(tipo);
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleDateString();
  };

  const formatearFechaHora = (fecha) => {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleString();
  };

  const textoActivo = (valor) => {
    if (valor === true) return "Sí";
    if (valor === false) return "No";
    return "-";
  };

  const cargarClientes = async () => {
    const response = await fetch(`${API_URL}/Clientes`, { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudieron cargar los clientes");
    const data = await response.json();
    setClientes(Array.isArray(data) ? data : []);
  };
 const obtenerImagenProducto = (imagenUrl) => {
  if (!imagenUrl || imagenUrl === "NULL" || imagenUrl === "null") {
    return "https://via.placeholder.com/100?text=Sin+imagen";
  }

  if (imagenUrl.startsWith("http")) {
    return imagenUrl;
  }

  return `http://localhost:5095${imagenUrl}`;
};

  const cargarProductos = async () => {
    const response = await fetch(`${API_URL}/Productos`, { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudieron cargar los productos");
    const data = await response.json();
    setProductos(Array.isArray(data) ? data : []);
  };

 const cargarPedidos = async () => {
  const params = new URLSearchParams();

  if (busquedaPedido.trim()) {
    params.append("busqueda", busquedaPedido.trim());
  }

  if (estadoFiltro.trim()) {
    params.append("estado", estadoFiltro.trim());
  }

  const response = await fetch(`${API_URL}/Pedidos?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) throw new Error("No se pudieron cargar los pedidos");

  const data = await response.json();
  const pedidosArray = Array.isArray(data) ? data : [];

  const pedidosOrdenados = pedidosArray.sort((a, b) => {
    return new Date(b.fecha) - new Date(a.fecha);
  });

  if (busquedaPedido.trim() || estadoFiltro.trim()) {
    setPedidos(pedidosOrdenados);
  } else {
    setPedidos(pedidosOrdenados.slice(0, 10));
  }
};
  const cargarPedido = async (idPedido) => {
    const response = await fetch(`${API_URL}/Pedidos/${idPedido}`, {
      cache: "no-store",
    });

    if (!response.ok) throw new Error("No se pudo cargar el pedido");

    const data = await response.json();

    setIdPedidoActual(data.idPedido);
    setEstadoPedidoActual(data.estado || "");
    setFechaPedidoActual(data.fecha || "");
    setClientePedidoActual(data.cliente || "");
    setUsuarioPedidoActual(data.usuario || "");
    setIdCliente(String(data.idCliente));
    setObservaciones(data.observaciones || "");
    setPedidoDetalle(Array.isArray(data.detalle) ? data.detalle : []);
    setIdProductoEditando(null);
    setCantidadEditando("");

    const clienteEncontrado = clientes.find(
      (c) => Number(c.idCliente) === Number(data.idCliente)
    );

    if (clienteEncontrado) {
      setBusquedaCliente(clienteEncontrado.nombreCliente || "");
    }
  };

  const recargarTodo = async () => {
    await Promise.all([cargarClientes(), cargarProductos(), cargarPedidos()]);
  };

  useEffect(() => {
    recargarTodo().catch(() =>
      mostrarMensaje("No se pudieron cargar los datos iniciales.", "danger")
    );
  }, []);

  useEffect(() => {
    cargarPedidos().catch(() =>
      mostrarMensaje("No se pudieron cargar los pedidos.", "danger")
    );
  }, [estadoFiltro]);

  const limpiarFormularioPedido = () => {
    setIdPedidoActual(null);
    setEstadoPedidoActual("");
    setFechaPedidoActual("");
    setClientePedidoActual("");
    setUsuarioPedidoActual("");
    setIdCliente("");
    setObservaciones("");
    setPedidoDetalle([]);
    setBusquedaCliente("");

    setFiltroNombreProducto("");
    setFiltroMarcaProducto("");
    setFiltroPresentacionProducto("");

    setIdProductoSeleccionado("");
    setCantidadProducto("");
    setMostrarModalConfirmar(false);
    setIdProductoEditando(null);
    setCantidadEditando("");
  };

  const clienteSeleccionado = clientes.find(
    (c) => Number(c.idCliente) === Number(idCliente)
  );

  const productoSeleccionado = productos.find(
    (p) => Number(p.idProducto) === Number(idProductoSeleccionado)
  );

  const hayFiltroProducto =
    filtroNombreProducto.trim() !== "" ||
    filtroMarcaProducto.trim() !== "" ||
    filtroPresentacionProducto.trim() !== "";

  const productosFiltrados = useMemo(() => {
    const nombre = filtroNombreProducto.toLowerCase().trim();
    const marca = filtroMarcaProducto.toLowerCase().trim();
    const presentacion = filtroPresentacionProducto.toLowerCase().trim();

    if (nombre) {
      return productos.filter((p) =>
        (p.nombreProducto?.toLowerCase() || "").includes(nombre)
      );
    }

    if (marca) {
      return productos.filter((p) =>
        (p.marca?.toLowerCase() || "").includes(marca)
      );
    }

    if (presentacion) {
      return productos.filter((p) =>
        (p.presentacion?.toLowerCase() || "").includes(presentacion)
      );
    }

    return [];
  }, [
    productos,
    filtroNombreProducto,
    filtroMarcaProducto,
    filtroPresentacionProducto,
  ]);

const clientesFiltrados = useMemo(() => {
  const texto = busquedaCliente.toLowerCase().trim();

  if (!texto) return [];

  return clientes.filter((c) => {
    const nombre = c.nombreCliente?.toLowerCase() || "";
    const numeroCliente = String(c.idCliente || "");
    const cuit = c.cuit?.toLowerCase() || "";
    const telefono = c.telefono?.toLowerCase() || "";
    const ciudad = c.ciudad?.toLowerCase() || "";

    return (
      nombre.includes(texto) ||
      numeroCliente.includes(texto) ||
      cuit.includes(texto) ||
      telefono.includes(texto) ||
      ciudad.includes(texto)
    );
  });
}, [clientes, busquedaCliente]);

 const obtenerSubtotalItem = (item) => {
  const precio = Number(
    item.precio ??
    item.precioUnitario ??
    item.PrecioUnitario ??
    item.precioUnitarioDetalle ??
    0
  );

  const cantidad = Number(
    item.cantidad ??
    item.Cantidad ??
    0
  );

  const subtotalDirecto = Number(
    item.subtotal ??
    item.subTotal ??
    item.Subtotal ??
    item.subtotalProducto ??
    item.total ??
    0
  );

  if (subtotalDirecto > 0) {
    return subtotalDirecto;
  }

  return precio * cantidad;
};

  const totalPedido = useMemo(() => {
    return pedidoDetalle.reduce((acc, item) => {
      return acc + obtenerSubtotalItem(item);
    }, 0);
  }, [pedidoDetalle]);

  const cantidadTotalProductos = useMemo(() => {
    return pedidoDetalle.reduce((acc, item) => acc + Number(item.cantidad || 0), 0);
  }, [pedidoDetalle]);

  const esBorrador = estadoPedidoActual === "Borrador";

  const crearPedido = async () => {
    if (!idCliente) {
      mostrarMensaje("Seleccioná un cliente.", "warning");
      return null;
    }

    const response = await fetch(`${API_URL}/Pedidos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idCliente: Number(idCliente),
        idUsuario: 1,
        observaciones: observaciones.trim() || null,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.mensaje || "No se pudo crear el pedido");
    }

    return data.idPedido;
  };

  const actualizarCabeceraInternamente = async () => {
    if (!idPedidoActual || !esBorrador) return;

    const response = await fetch(`${API_URL}/Pedidos/${idPedidoActual}/cabecera`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idCliente: Number(idCliente),
        observaciones: observaciones.trim() || null,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.mensaje || "No se pudo actualizar el pedido");
    }
  };

  const agregarProducto = async () => {
    if (!idCliente) {
      mostrarMensaje("Primero seleccioná un cliente.", "warning");
      return;
    }

    if (!idProductoSeleccionado) {
      mostrarMensaje("Seleccioná un producto.", "warning");
      return;
    }

    if (!cantidadProducto || Number(cantidadProducto) <= 0) {
      mostrarMensaje("Ingresá una cantidad válida.", "warning");
      return;
    }

    try {
      setCargando(true);

      let pedidoId = idPedidoActual;

      if (!pedidoId) {
        pedidoId = await crearPedido();
      } else {
        await actualizarCabeceraInternamente();
      }

      const response = await fetch(`${API_URL}/Pedidos/detalle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idPedido: Number(pedidoId),
          idProducto: Number(idProductoSeleccionado),
          cantidad: Number(cantidadProducto),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.mensaje || "No se pudo agregar el producto");
      }

      mostrarMensaje(data.mensaje || "Producto agregado correctamente.", "success");

      setFiltroNombreProducto("");
      setFiltroMarcaProducto("");
      setFiltroPresentacionProducto("");
      setIdProductoSeleccionado("");
      setCantidadProducto("");

      await cargarPedidos();
      await cargarPedido(pedidoId);
    } catch (error) {
      mostrarMensaje(error.message || "No se pudo agregar el producto.", "danger");
    } finally {
      setCargando(false);
    }
  };

  const eliminarDetalle = async (idProducto) => {
    if (!esBorrador) {
      mostrarMensaje("Solo se pueden eliminar productos de pedidos en borrador.", "warning");
      return;
    }

    try {
      setCargando(true);

      const response = await fetch(
        `${API_URL}/Pedidos/${idPedidoActual}/detalle/${idProducto}`,
        { method: "DELETE" }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.mensaje || "No se pudo eliminar el producto");
      }

      mostrarMensaje(data.mensaje || "Producto eliminado correctamente.", "success");

      if (idProductoEditando === idProducto) {
        setIdProductoEditando(null);
        setCantidadEditando("");
      }

      await cargarPedidos();
      await cargarPedido(idPedidoActual);
    } catch (error) {
      mostrarMensaje(error.message || "No se pudo eliminar el producto.", "danger");
    } finally {
      setCargando(false);
    }
  };

  const iniciarEdicionCantidad = (item) => {
    setIdProductoEditando(item.idProducto);
    setCantidadEditando(String(item.cantidad));
  };

  const cancelarEdicionCantidad = () => {
    setIdProductoEditando(null);
    setCantidadEditando("");
  };

  const guardarEdicionCantidad = async (idProducto) => {
    if (!esBorrador) {
      mostrarMensaje("Solo se puede editar un pedido en borrador.", "warning");
      return;
    }

    if (!cantidadEditando || Number(cantidadEditando) <= 0) {
      mostrarMensaje("Ingresá una cantidad válida.", "warning");
      return;
    }

    try {
      setCargando(true);

      const response = await fetch(
        `${API_URL}/Pedidos/${idPedidoActual}/detalle/${idProducto}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cantidad: Number(cantidadEditando),
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.mensaje || "No se pudo actualizar la cantidad");
      }

      mostrarMensaje(data.mensaje || "Cantidad actualizada correctamente.", "success");
      setIdProductoEditando(null);
      setCantidadEditando("");

      await cargarPedidos();
      await cargarPedido(idPedidoActual);
    } catch (error) {
      mostrarMensaje(error.message || "No se pudo actualizar la cantidad.", "danger");
    } finally {
      setCargando(false);
    }
  };

  const abrirConfirmacionPedido = async () => {
    if (!idPedidoActual) {
      mostrarMensaje("Primero agregá al menos un producto al pedido.", "warning");
      return;
    }

    if (!esBorrador) {
      mostrarMensaje("Solo se puede confirmar un pedido en borrador.", "warning");
      return;
    }

    if (pedidoDetalle.length === 0) {
      mostrarMensaje("Agregá al menos un producto antes de confirmar.", "warning");
      return;
    }

    if (idProductoEditando !== null) {
      mostrarMensaje("Primero guardá o cancelá la edición de cantidad.", "warning");
      return;
    }

    try {
      setCargando(true);
      await actualizarCabeceraInternamente();
      await cargarPedido(idPedidoActual);
      setMostrarModalConfirmar(true);
    } catch (error) {
      mostrarMensaje(error.message || "No se pudo preparar el pedido.", "danger");
    } finally {
      setCargando(false);
    }
  };

  const confirmarPedido = async () => {
    if (!idPedidoActual) return;

    try {
      setCargando(true);

      const response = await fetch(`${API_URL}/Pedidos/${idPedidoActual}/confirmar`, {
        method: "PUT",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.mensaje || "No se pudo confirmar el pedido");
      }

      mostrarMensaje(data.mensaje || "Pedido confirmado correctamente.", "success");
      setMostrarModalConfirmar(false);

      await cargarPedidos();
      limpiarFormularioPedido();
    } catch (error) {
      mostrarMensaje(error.message || "No se pudo confirmar el pedido.", "danger");
    } finally {
      setCargando(false);
    }
  };

  const pedirCancelarPedido = (pedido) => {
    setPedidoACancelar(pedido);
    setMostrarModalCancelar(true);
  };

  const confirmarCancelarPedido = async () => {
    if (!pedidoACancelar) return;

    try {
      setCargando(true);

      const response = await fetch(
        `${API_URL}/Pedidos/${pedidoACancelar.idPedido}/cancelar`,
        { method: "PUT" }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.mensaje || "No se pudo cancelar el pedido");
      }

      mostrarMensaje(data.mensaje || "Pedido cancelado correctamente.", "success");

      if (idPedidoActual === pedidoACancelar.idPedido) {
        await cargarPedido(idPedidoActual);
      }

      await cargarPedidos();
    } catch (error) {
      mostrarMensaje(error.message || "No se pudo cancelar el pedido.", "danger");
    } finally {
      setCargando(false);
      setMostrarModalCancelar(false);
      setPedidoACancelar(null);
    }
  };

  const seleccionarCliente = (cliente) => {
    setIdCliente(String(cliente.idCliente));
    setBusquedaCliente(cliente.nombreCliente || "");
  };

  const seleccionarProducto = (producto) => {
    setIdProductoSeleccionado(String(producto.idProducto));
    setFiltroNombreProducto("");
    setFiltroMarcaProducto("");
    setFiltroPresentacionProducto("");
  };

  const limpiarBusquedaProducto = () => {
  setFiltroNombreProducto("");
  setFiltroMarcaProducto("");
  setFiltroPresentacionProducto("");
  setIdProductoSeleccionado("");
  setCantidadProducto("");
};

  const badgeEstadoClase = (estado) => {
    switch ((estado || "").toLowerCase()) {
      case "confirmado":
        return "bg-success-subtle text-success border border-success-subtle";
      case "cancelado":
        return "bg-danger-subtle text-danger border border-danger-subtle";
      default:
        return "bg-warning-subtle text-warning-emphasis border border-warning-subtle";
    }
  };

  return (
    <main className="container py-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h2 className="mb-1">Pedidos</h2>
          <p className="text-muted mb-0">
            Cargá el pedido, revisalo y confirmalo cuando esté listo.
          </p>
        </div>

        <button
          className="btn btn-outline-secondary"
          onClick={limpiarFormularioPedido}
          disabled={cargando}
        >
          Nuevo pedido
        </button>
      </div>

      {mensaje && (
        <div className={`alert alert-${tipoMensaje} shadow-sm`} role="alert">
          {mensaje}
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="card-title mb-3">
                {idPedidoActual ? `Pedido #${idPedidoActual}` : "Datos del pedido"}
              </h5>
<div className="mb-3 position-relative">
  <label className="form-label fw-semibold">
    Buscar cliente
  </label>

  <div className="input-group">
    <input
      type="text"
      className="form-control"
      value={busquedaCliente}
      onChange={(e) => {
        setBusquedaCliente(e.target.value);
        setIdCliente("");
        setMostrarClientes(true);
      }}
      placeholder="Nombre, número, CUIT, teléfono o ciudad"
      disabled={idPedidoActual && !esBorrador}
    />

    <button
      type="button"
      className="btn btn-outline-secondary"
      onClick={() => setMostrarClientes(!mostrarClientes)}
      disabled={idPedidoActual && !esBorrador}
    >
      {mostrarClientes ? "▲" : "▼"}
    </button>
  </div>

  <small className="text-muted">
    Buscá y seleccioná un cliente.
  </small>

  {!(idPedidoActual && !esBorrador) &&
    mostrarClientes &&
    busquedaCliente.trim() !== "" && (
      <div
        className="position-absolute w-100 bg-white border rounded shadow-sm mt-1"
        style={{
          zIndex: 20,
          maxHeight: "260px",
          overflowY: "auto",
        }}
      >
        {clientesFiltrados.length > 0 ? (
          clientesFiltrados.slice(0, 8).map((cliente) => (
            <button
              key={cliente.idCliente}
              type="button"
              className={`list-group-item list-group-item-action text-start border-0 w-100 ${
                Number(idCliente) === Number(cliente.idCliente)
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                seleccionarCliente(cliente);
                setMostrarClientes(false);
              }}
            >
              <div className="fw-semibold">
                {cliente.nombreCliente}
              </div>

              <small>
                Cliente #{cliente.idCliente}

                {cliente.cuit
                  ? ` | CUIT: ${cliente.cuit}`
                  : ""}

                {cliente.telefono
                  ? ` | Tel: ${cliente.telefono}`
                  : ""}

                {cliente.ciudad
                  ? ` | ${cliente.ciudad}`
                  : ""}
              </small>
            </button>
          ))
        ) : (
          <div className="p-3 text-muted">
            No se encontraron clientes.
          </div>
        )}
      </div>
    )}
</div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Observaciones</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Observaciones del pedido"
                  disabled={idPedidoActual && !esBorrador}
                />
              </div>

              {clienteSeleccionado && (
                <div className="rounded border bg-light p-3">
                  <div className="fw-semibold mb-3">Cliente seleccionado</div>

                  <div className="row g-2">
                    <div className="col-12">
                      <strong>Número de cliente:</strong> {clienteSeleccionado.idCliente}
                    </div>
                    <div className="col-12">
                      <strong>Nombre:</strong> {clienteSeleccionado.nombreCliente || "-"}
                    </div>
                    <div className="col-12">
                      <strong>CUIT:</strong> {clienteSeleccionado.cuit || "-"}
                    </div>
                    <div className="col-12">
                      <strong>Teléfono:</strong> {clienteSeleccionado.telefono || "-"}
                    </div>
                    <div className="col-12">
                      <strong>Email:</strong> {clienteSeleccionado.email || "-"}
                    </div>
                    <div className="col-12">
                      <strong>Dirección:</strong> {clienteSeleccionado.direccion || "-"}
                    </div>
                    <div className="col-12">
                      <strong>Ciudad:</strong> {clienteSeleccionado.ciudad || "-"}
                    </div>
                    <div className="col-6">
                      <strong>Activo:</strong> {textoActivo(clienteSeleccionado.activo)}
                    </div>
                    <div className="col-6">
                      <strong>Fecha de alta:</strong> {formatearFechaHora(clienteSeleccionado.fechaAlta)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">Agregar producto</h5>

              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={filtroNombreProducto}
                    onChange={(e) => {
                      setFiltroNombreProducto(e.target.value);
                      setFiltroMarcaProducto("");
                      setFiltroPresentacionProducto("");
                      setIdProductoSeleccionado("");
                    }}
                    placeholder="Buscar por nombre"
                    disabled={idPedidoActual && !esBorrador}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">Marca</label>
                  <input
                    type="text"
                    className="form-control"
                    value={filtroMarcaProducto}
                    onChange={(e) => {
                      setFiltroMarcaProducto(e.target.value);
                      setFiltroNombreProducto("");
                      setFiltroPresentacionProducto("");
                      setIdProductoSeleccionado("");
                    }}
                    placeholder="Buscar por marca"
                    disabled={idPedidoActual && !esBorrador}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">Presentación</label>
                  <input
                    type="text"
                    className="form-control"
                    value={filtroPresentacionProducto}
                    onChange={(e) => {
                      setFiltroPresentacionProducto(e.target.value);
                      setFiltroNombreProducto("");
                      setFiltroMarcaProducto("");
                      setIdProductoSeleccionado("");
                    }}
                    placeholder="Buscar por presentación"
                    disabled={idPedidoActual && !esBorrador}
                  />
                </div>
              </div>

              {!(idPedidoActual && !esBorrador) && hayFiltroProducto && (
                <div
                  className="border rounded mt-3"
                  style={{
                    maxHeight: "220px",
                    overflowY: "auto",
                  }}
                >
                  {productosFiltrados.length > 0 ? (
                    productosFiltrados.map((producto) => (
                      <button
                        key={producto.idProducto}
                        type="button"
                        className={`list-group-item list-group-item-action text-start border-0 w-100 ${
                          Number(idProductoSeleccionado) === Number(producto.idProducto)
                            ? "active"
                            : ""
                        }`}
                        onClick={() => seleccionarProducto(producto)}
                      >
                        <div className="fw-semibold">{producto.nombreProducto}</div>
                        <small>
                          {producto.marca ? `Marca: ${producto.marca}` : "Marca: -"}
                          {producto.presentacion
                            ? ` | Presentación: ${producto.presentacion}`
                            : " | Presentación: -"}
                        </small>
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-muted">
                      No se encontraron productos con ese filtro.
                    </div>
                  )}
                </div>
              )}

  <div className="row g-3 mt-1">
  <div className="col-md-3">
    <label className="form-label fw-semibold">Cantidad</label>
    <input
      type="number"
      className="form-control"
      value={cantidadProducto}
      onChange={(e) => setCantidadProducto(e.target.value)}
      placeholder="0"
      disabled={idPedidoActual && !esBorrador}
    />
  </div>

  <div className="col-md-3 d-flex align-items-end">
    <button
      className="btn btn-success w-100"
      onClick={agregarProducto}
      disabled={cargando || (idPedidoActual && !esBorrador)}
    >
      Agregar producto
    </button>
  </div>

  <div className="col-md-3 d-flex align-items-end">
    <button
      className="btn btn-outline-secondary w-100"
      onClick={limpiarBusquedaProducto}
      disabled={cargando || (idPedidoActual && !esBorrador)}
      type="button"
    >
      Limpiar
    </button>
  </div>
</div>
              {productoSeleccionado && (
                <div className="rounded border bg-light p-3 mt-3">
                  <div className="fw-semibold mb-3">Producto seleccionado</div>
                  <div className="text-center mb-3">
  <img
    src={obtenerImagenProducto(productoSeleccionado.imagenUrl)}
    alt={productoSeleccionado.nombreProducto}
    style={{
      width: "120px",
      height: "120px",
      objectFit: "cover",
      borderRadius: "10px",
      border: "1px solid #ddd",
      backgroundColor: "#f8f9fa",
    }}
  />
</div>

                  <div className="row g-2">
                    <div className="col-md-6">
                      <strong>Número de producto:</strong> {productoSeleccionado.idProducto}
                    </div>
                    <div className="col-md-6">
                      <strong>Nombre:</strong> {productoSeleccionado.nombreProducto || "-"}
                    </div>
                    <div className="col-md-6">
                      <strong>Marca:</strong> {productoSeleccionado.marca || "-"}
                    </div>
                    <div className="col-md-6">
                      <strong>Presentación:</strong> {productoSeleccionado.presentacion || "-"}
                    </div>
                    <div className="col-md-6">
                      <strong>Precio:</strong> ${Number(productoSeleccionado.precio || 0).toFixed(2)}
                    </div>
                    <div className="col-md-6">
                      <strong>Stock actual:</strong> {productoSeleccionado.stockActual ?? "-"}
                    </div>
                    <div className="col-md-6">
                      <strong>Stock mínimo:</strong> {productoSeleccionado.stockMinimo ?? "-"}
                    </div>
                    <div className="col-md-6">
                      <strong>Activo:</strong> {textoActivo(productoSeleccionado.activo)}
                    </div>
                    <div className="col-md-6">
                      <strong>Fecha de alta:</strong> {formatearFechaHora(productoSeleccionado.fechaAlta)}
                    </div>
                    <div className="col-md-6">
                      <strong>Categoría:</strong> {productoSeleccionado.nombreCategoria || productoSeleccionado.categoria || "-"}
                    </div>
                    <div className="col-md-6">
                      <strong>Proveedor:</strong> {productoSeleccionado.proveedor || productoSeleccionado.razonSocial || "-"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                <div>
                  <h5 className="card-title mb-1">Resumen y detalle del pedido</h5>
                  <p className="text-muted mb-0">
                    Revisá el pedido completo antes de confirmarlo.
                  </p>
                </div>

                <span className={`badge rounded-pill px-3 py-2 ${badgeEstadoClase(estadoPedidoActual || "Borrador")}`}>
                  {idPedidoActual ? estadoPedidoActual : "Sin crear"}
                </span>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <div className="border rounded p-3 h-100">
                    <small className="text-muted d-block">Pedido</small>
                    <strong>{idPedidoActual ? `#${idPedidoActual}` : "-"}</strong>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="border rounded p-3 h-100">
                    <small className="text-muted d-block">Cliente</small>
                    <strong>{clientePedidoActual || clienteSeleccionado?.nombreCliente || "-"}</strong>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="border rounded p-3 h-100">
                    <small className="text-muted d-block">Fecha</small>
                    <strong>{formatearFecha(fechaPedidoActual)}</strong>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">
                    <small className="text-muted d-block">Cantidad de productos</small>
                    <strong>{cantidadTotalProductos}</strong>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded p-3 h-100 bg-light">
                    <small className="text-muted d-block">Total</small>
                    <strong className="fs-5">${totalPedido.toFixed(2)}</strong>
                  </div>
                </div>

                <div className="col-12">
                  <div className="border rounded p-3 h-100">
                    <small className="text-muted d-block">Observaciones</small>
                    <strong>{observaciones?.trim() ? observaciones : "-"}</strong>
                  </div>
                </div>
              </div>

              {pedidoDetalle.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Producto</th>
                        <th>Presentación</th>
                        <th className="text-center">Cantidad</th>
                        <th className="text-end">Precio</th>
                        <th className="text-end">Subtotal</th>
                        <th className="text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedidoDetalle.map((item) => {
                        const estaEditando = idProductoEditando === item.idProducto;

                        return (
                          <tr key={item.idDetallePedido}>
                            <td>
                              <div className="fw-semibold">{item.producto}</div>
                              <small className="text-muted">{item.marca || "-"}</small>
                            </td>

                            <td>{item.presentacion || "-"}</td>

                            <td className="text-center" style={{ maxWidth: "130px" }}>
                              {estaEditando ? (
                                <input
                                  type="number"
                                  className="form-control form-control-sm text-center"
                                  value={cantidadEditando}
                                  onChange={(e) => setCantidadEditando(e.target.value)}
                                  min="1"
                                />
                              ) : (
                                item.cantidad
                              )}
                            </td>

<td className="text-end">
  ${Number(item.precio ?? item.precioUnitario ?? item.PrecioUnitario ?? 0).toFixed(2)}
</td>
                            <td className="text-end fw-semibold">
                              {estaEditando
                                ? `$${(
                                    Number(item.precio ?? item.precioUnitario ?? 0) *
                                    Number(cantidadEditando || 0)
                                  ).toFixed(2)}`
                                : `$${obtenerSubtotalItem(item).toFixed(2)}`}
                            </td>

                            <td className="text-center">
                              {esBorrador ? (
                                estaEditando ? (
                                  <div className="d-flex justify-content-center gap-2 flex-wrap">
                                    <button
                                      className="btn btn-sm btn-success"
                                      onClick={() => guardarEdicionCantidad(item.idProducto)}
                                      disabled={cargando}
                                    >
                                      Guardar
                                    </button>
                                    <button
                                      className="btn btn-sm btn-outline-secondary"
                                      onClick={cancelarEdicionCantidad}
                                      disabled={cargando}
                                    >
                                      Cancelar
                                    </button>
                                  </div>
                                ) : (
                                  <div className="d-flex justify-content-center gap-2 flex-wrap">
                                    <button
                                      className="btn btn-sm btn-outline-primary"
                                      onClick={() => iniciarEdicionCantidad(item)}
                                      disabled={cargando || idProductoEditando !== null}
                                    >
                                      Editar
                                    </button>
                                    <button
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => eliminarDetalle(item.idProducto)}
                                      disabled={cargando || idProductoEditando !== null}
                                    >
                                      Eliminar
                                    </button>
                                  </div>
                                )
                              ) : (
                                <span className="text-muted">Bloqueado</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4 text-muted">
                  Todavía no agregaste productos al pedido.
                </div>
              )}

              <div className="mt-4 d-flex justify-content-end">
                <button
                  className="btn btn-primary px-4"
                  onClick={abrirConfirmacionPedido}
                  disabled={cargando || !idPedidoActual || !esBorrador || pedidoDetalle.length === 0}
                >
                  Confirmar pedido
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 mt-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <div>
              <h5 className="card-title mb-1">Historial de pedidos</h5>
              <p className="text-muted mb-0">
                Consultá, abrí o cancelá pedidos existentes.
              </p>
            </div>
            <span className="badge bg-secondary">{pedidos.length} resultados</span>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-8">
              <label className="form-label fw-semibold">Buscar pedido</label>
              <input
                type="text"
                className="form-control"
                value={busquedaPedido}
                onChange={(e) => setBusquedaPedido(e.target.value)}
                placeholder="Cliente o número de pedido"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Estado</label>
              <select
                className="form-select"
                value={estadoFiltro}
                onChange={(e) => setEstadoFiltro(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="Borrador">Borrador</option>
                <option value="Confirmado">Confirmado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          <div className="d-flex gap-2 flex-wrap mb-3">
            <button
              className="btn btn-primary"
              onClick={() =>
                cargarPedidos().catch(() =>
                  mostrarMensaje("No se pudieron cargar los pedidos.", "danger")
                )
              }
            >
              Buscar
            </button>

            <button
              className="btn btn-outline-secondary"
              onClick={recargarTodo}
            >
              Recargar
            </button>
          </div>

          {pedidos.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Pedido</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th className="text-end">Total</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((pedido) => (
                    <tr key={pedido.idPedido}>
                      <td className="fw-semibold">#{pedido.idPedido}</td>
                      <td>{pedido.cliente}</td>
                      <td>{formatearFecha(pedido.fecha)}</td>
                      <td>
                        <span className={`badge ${badgeEstadoClase(pedido.estado)}`}>
                          {pedido.estado}
                        </span>
                      </td>
                      <td className="text-end">${Number(pedido.total).toFixed(2)}</td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2 flex-wrap">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => cargarPedido(pedido.idPedido)}
                          >
                            Ver
                          </button>

                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => pedirCancelarPedido(pedido)}
                            disabled={pedido.estado === "Cancelado"}
                          >
                            Cancelar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-muted">
              No se encontraron pedidos.
            </div>
          )}
        </div>
      </div>

      {mostrarModalConfirmar && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content shadow">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title">Confirmar pedido</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setMostrarModalConfirmar(false)}
                  ></button>
                </div>

                <div className="modal-body pt-2">
                  <p className="mb-2">¿Desea confirmar el pedido?</p>
                  <div className="p-3 rounded bg-light border">
                    <div><strong>Pedido:</strong> #{idPedidoActual}</div>
                    <div><strong>Cliente:</strong> {clientePedidoActual || clienteSeleccionado?.nombreCliente || "-"}</div>
                    <div><strong>Productos:</strong> {cantidadTotalProductos}</div>
                    <div><strong>Total:</strong> ${totalPedido.toFixed(2)}</div>
                  </div>
                  <small className="text-muted d-block mt-2">
                    Si elegís “No”, volvés al resumen del pedido para modificarlo.
                  </small>
                </div>

                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setMostrarModalConfirmar(false)}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={confirmarPedido}
                    disabled={cargando}
                  >
                    Sí, confirmar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {mostrarModalCancelar && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content shadow">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title">Cancelar pedido</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setMostrarModalCancelar(false);
                      setPedidoACancelar(null);
                    }}
                  ></button>
                </div>

                <div className="modal-body pt-2">
                  <p className="mb-2">¿Deseás cancelar este pedido?</p>
                  <div className="p-3 rounded bg-light border">
                    <strong>Pedido #{pedidoACancelar?.idPedido}</strong>
                    <div>{pedidoACancelar?.cliente}</div>
                  </div>
                </div>

                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setMostrarModalCancelar(false);
                      setPedidoACancelar(null);
                    }}
                  >
                    Volver
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={confirmarCancelarPedido}
                    disabled={cargando}
                  >
                    Cancelar pedido
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


export default Pedidos;