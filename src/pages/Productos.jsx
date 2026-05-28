import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:5095/api";

const catalogoProductos = {
  Gaseosas: {
    subcategorias: {
      Descartable: {
        marcas: {
          "Coca-Cola": ["500 ml", "1 L", "1.5 L", "2.25 L"],
          Sprite: ["500 ml", "1 L", "1.5 L", "2.25 L"],
          Fanta: ["500 ml", "1 L", "1.5 L", "2.25 L"],
          Pepsi: ["500 ml", "1 L", "1.5 L", "2.25 L"],
          "7Up": ["500 ml", "1 L", "1.5 L", "2.25 L"],
        },
      },
      Retornable: {
        marcas: {
          "Coca-Cola": ["1 L", "1.5 L", "2.25 L"],
          Sprite: ["1 L", "1.5 L", "2.25 L"],
          Fanta: ["1 L", "1.5 L", "2.25 L"],
        },
      },
    },
  },
  Jugos: {
    subcategorias: {
      Caja: {
        marcas: {
          Cepita: ["200 ml", "1 L"],
          Baggio: ["200 ml", "1 L"],
          Citric: ["1 L"],
        },
      },
      Botella: {
        marcas: {
          Cepita: ["500 ml", "1.5 L"],
          Baggio: ["500 ml", "1.5 L"],
        },
      },
    },
  },
  "Bebidas energéticas": {
    subcategorias: {
      Lata: {
        marcas: {
          "Red Bull": ["250 ml"],
          Monster: ["473 ml"],
          Speed: ["250 ml", "473 ml"],
        },
      },
      Botella: {
        marcas: {
          Monster: ["1 L"],
          Speed: ["1 L"],
          Rockstar: ["1 L"],
        },
      },
    },
  },
  Aguas: {
    subcategorias: {
      "Sin gas": {
        marcas: {
          Bonaqua: ["500 ml", "1.5 L", "2 L"],
          "Villa del Sur": ["500 ml", "1.5 L", "2 L"],
          "Eco de los Andes": ["500 ml", "1.5 L"],
        },
      },
      "Con gas": {
        marcas: {
          Bonaqua: ["500 ml", "1.5 L"],
          "Villa del Sur": ["500 ml", "1.5 L"],
        },
      },
      Saborizada: {
        marcas: {
          Aquarius: ["500 ml", "1.5 L"],
          Levité: ["500 ml", "1.5 L"],
        },
      },
    },
  },
  "Bebidas con alcohol": {
    subcategorias: {
      Cerveza: {
        marcas: {
          Quilmes: ["473 ml", "1 L"],
          Brahma: ["473 ml", "1 L"],
          Heineken: ["473 ml", "1 L"],
        },
      },
      Fernet: {
        marcas: {
          Branca: ["750 ml", "1 L"],
          "1882": ["750 ml"],
        },
      },
      Vodka: {
        marcas: {
          Smirnoff: ["700 ml", "1 L"],
          Absolut: ["750 ml"],
        },
      },
      Vino: {
        marcas: {
          Toro: ["1 L"],
          Termidor: ["1 L"],
        },
      },
    },
  },
};

function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const [idEditando, setIdEditando] = useState(null);

  const [nombreProducto, setNombreProducto] = useState("");
  const [marca, setMarca] = useState("");
  const [presentacion, setPresentacion] = useState("");
  const [precio, setPrecio] = useState("");
  const [stockActual, setStockActual] = useState("");
  const [stockMinimo, setStockMinimo] = useState("");
  const [idCategoria, setIdCategoria] = useState("");
  const [idProveedor, setIdProveedor] = useState("");

  const [categoriaVisual, setCategoriaVisual] = useState("");
  const [subcategoriaVisual, setSubcategoriaVisual] = useState("");
  const [marcaVisual, setMarcaVisual] = useState("");
  const [tamanoVisual, setTamanoVisual] = useState("");

  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("info");
  const [cargando, setCargando] = useState(false);

  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const mostrarMensaje = (texto, tipo = "info") => {
    setMensaje(texto);
    setTipoMensaje(tipo);
  };

  const obtenerImagenProducto = (imagenUrl) => {
    if (!imagenUrl || imagenUrl === "NULL" || imagenUrl === "null") {
      return "https://via.placeholder.com/120?text=Sin+imagen";
    }

    if (imagenUrl.startsWith("http")) {
      return imagenUrl;
    }

    return `http://localhost:5095${imagenUrl}`;
  };

  const cargarProductos = async () => {
    try {
      const response = await fetch(`${API_URL}/Productos`, { cache: "no-store" });
      if (!response.ok) throw new Error();
      const data = await response.json();
      setProductos(Array.isArray(data) ? data : []);
    } catch {
      mostrarMensaje("No se pudieron cargar los productos.", "danger");
    }
  };

  const cargarCategorias = async () => {
    try {
      const response = await fetch(`${API_URL}/Categorias`, { cache: "no-store" });
      if (!response.ok) throw new Error();
      const data = await response.json();
      setCategorias(Array.isArray(data) ? data : []);
    } catch {
      mostrarMensaje("No se pudieron cargar las categorías.", "danger");
    }
  };

  const cargarSubcategorias = async () => {
    try {
      const response = await fetch(`${API_URL}/Subcategorias`, { cache: "no-store" });
      if (!response.ok) throw new Error();
      const data = await response.json();
      setSubcategorias(Array.isArray(data) ? data : []);
    } catch {
      mostrarMensaje("No se pudieron cargar las subcategorías.", "danger");
    }
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

  const recargarTodo = async () => {
    await Promise.all([
      cargarProductos(),
      cargarCategorias(),
      cargarSubcategorias(),
      cargarProveedores(),
    ]);
  };

  useEffect(() => {
    recargarTodo();
  }, []);

  useEffect(() => {
    if (!marcaVisual) {
      setNombreProducto("");
      setMarca("");
      setPresentacion("");
      return;
    }

    setNombreProducto(marcaVisual);
    setMarca(marcaVisual);

    const partes = [subcategoriaVisual, tamanoVisual].filter(Boolean);
    setPresentacion(partes.join(" - "));
  }, [marcaVisual, subcategoriaVisual, tamanoVisual]);

  useEffect(() => {
    if (!categoriaVisual) {
      setIdCategoria("");
      return;
    }

    const categoriaEncontrada = categorias.find(
      (c) => c.nombreCategoria?.toLowerCase() === categoriaVisual.toLowerCase()
    );

    if (categoriaEncontrada) {
      setIdCategoria(String(categoriaEncontrada.idCategoria));
    } else {
      setIdCategoria("");
    }
  }, [categoriaVisual, categorias]);

  const nombreCategoria = (idCategoriaProducto) => {
    const categoria = categorias.find(
      (c) => Number(c.idCategoria) === Number(idCategoriaProducto)
    );
    return categoria ? categoria.nombreCategoria : `ID ${idCategoriaProducto}`;
  };

  const nombreProveedor = (idProveedorProducto) => {
    const proveedor = proveedores.find(
      (p) => Number(p.idProveedor) === Number(idProveedorProducto)
    );
    return proveedor ? proveedor.razonSocial : `ID ${idProveedorProducto}`;
  };

  const productosFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();
    if (!texto) return productos;

    return productos.filter((producto) => {
      const nombre = producto.nombreProducto?.toLowerCase() || "";
      const id = String(producto.idProducto || "");
      const marcaTexto = producto.marca?.toLowerCase() || "";
      const presentacionTexto = producto.presentacion?.toLowerCase() || "";
      const categoriaTexto = nombreCategoria(producto.idCategoria).toLowerCase();
      const proveedorTexto = nombreProveedor(producto.idProveedor).toLowerCase();

      return (
        nombre.includes(texto) ||
        id.includes(texto) ||
        marcaTexto.includes(texto) ||
        presentacionTexto.includes(texto) ||
        categoriaTexto.includes(texto) ||
        proveedorTexto.includes(texto)
      );
    });
  }, [productos, busqueda, categorias, proveedores]);

  const subcategoriasDisponibles = subcategorias.filter(
    (s) => s.nombreCategoria?.toLowerCase() === categoriaVisual.toLowerCase()
  );

  const marcasDisponibles =
    categoriaVisual && subcategoriaVisual
      ? Object.keys(
          catalogoProductos[categoriaVisual]?.subcategorias?.[subcategoriaVisual]?.marcas || {}
        )
      : [];

  const tamanosDisponibles =
    categoriaVisual && subcategoriaVisual && marcaVisual
      ? catalogoProductos[categoriaVisual]?.subcategorias?.[subcategoriaVisual]?.marcas?.[
          marcaVisual
        ] || []
      : [];

  const limpiarFormulario = () => {
    setIdEditando(null);
    setNombreProducto("");
    setMarca("");
    setPresentacion("");
    setPrecio("");
    setStockActual("");
    setStockMinimo("");
    setIdCategoria("");
    setIdProveedor("");
    setCategoriaVisual("");
    setSubcategoriaVisual("");
    setMarcaVisual("");
    setTamanoVisual("");
  };

  const cargarEnFormulario = (producto) => {
    setIdEditando(producto.idProducto);
    setNombreProducto(producto.nombreProducto || "");
    setMarca(producto.marca || "");
    setPresentacion(producto.presentacion || "");
    setPrecio(producto.precio ?? "");
    setStockActual(producto.stockActual ?? "");
    setStockMinimo(producto.stockMinimo ?? "");
    setIdCategoria(String(producto.idCategoria ?? ""));
    setIdProveedor(String(producto.idProveedor ?? ""));

    const categoriaNombre = nombreCategoria(producto.idCategoria);
    setCategoriaVisual(categoriaNombre);

    const partes = (producto.presentacion || "").split(" - ");
    setSubcategoriaVisual(partes[0] || "");
    setTamanoVisual(partes[1] || "");
    setMarcaVisual(producto.marca || "");

    mostrarMensaje(`Editando producto: ${producto.nombreProducto}`, "info");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const guardarProducto = async () => {
    if (!nombreProducto.trim()) {
      mostrarMensaje("Ingresá el nombre del producto.", "warning");
      return;
    }

    if (!precio || Number(precio) <= 0) {
      mostrarMensaje("Ingresá un precio válido.", "warning");
      return;
    }

    if (!idCategoria || Number(idCategoria) <= 0) {
      mostrarMensaje("Seleccioná una categoría válida.", "warning");
      return;
    }

    if (!idProveedor || Number(idProveedor) <= 0) {
      mostrarMensaje("Seleccioná un proveedor válido.", "warning");
      return;
    }

    try {
      setCargando(true);

      const payload = {
        nombreProducto: nombreProducto.trim(),
        marca: marca.trim() || null,
        presentacion: presentacion.trim() || null,
        precio: Number(precio),
        stockActual: Number(stockActual || 0),
        stockMinimo: Number(stockMinimo || 0),
        idCategoria: Number(idCategoria),
        idProveedor: Number(idProveedor),
      };

      let response;

      if (idEditando) {
        response = await fetch(`${API_URL}/Productos/${idEditando}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(`${API_URL}/Productos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.mensaje || "No se pudo guardar el producto");
      }

      await recargarTodo();
      limpiarFormulario();

      mostrarMensaje(
        data.mensaje ||
          (idEditando
            ? "Producto modificado correctamente."
            : "Producto agregado correctamente."),
        "success"
      );
    } catch (error) {
      mostrarMensaje(error.message || "No se pudo guardar el producto.", "danger");
    } finally {
      setCargando(false);
    }
  };

  const pedirEliminarProducto = (producto) => {
    setProductoAEliminar(producto);
    setMostrarModalEliminar(true);
  };

  const confirmarEliminarProducto = async () => {
    if (!productoAEliminar) return;

    try {
      setCargando(true);

      const response = await fetch(`${API_URL}/Productos/${productoAEliminar.idProducto}`, {
        method: "DELETE",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.mensaje || "No se pudo eliminar el producto");
      }

      await recargarTodo();

      if (idEditando === productoAEliminar.idProducto) {
        limpiarFormulario();
      }

      mostrarMensaje(data.mensaje || "Producto eliminado correctamente.", "success");
    } catch (error) {
      mostrarMensaje(error.message || "No se pudo eliminar el producto.", "danger");
    } finally {
      setCargando(false);
      setMostrarModalEliminar(false);
      setProductoAEliminar(null);
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
            <p className="clientes-kicker">Gestión de productos</p>
            <h2 className="clientes-title">
              {idEditando ? `Modificar producto #${idEditando}` : "Agregar producto"}
            </h2>
          </div>
          <span className="section-step">{idEditando ? "Edición" : "Alta"}</span>
        </div>

        <div className="row g-3 mt-1">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Categoría</label>
            <select
              className="form-select"
              value={categoriaVisual}
              onChange={(e) => {
                setCategoriaVisual(e.target.value);
                setSubcategoriaVisual("");
                setMarcaVisual("");
                setTamanoVisual("");
              }}
            >
              <option value="">Seleccionar categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.idCategoria} value={categoria.nombreCategoria}>
                  {categoria.nombreCategoria}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Subcategoría</label>
            <select
              className="form-select"
              value={subcategoriaVisual}
              onChange={(e) => {
                setSubcategoriaVisual(e.target.value);
                setMarcaVisual("");
                setTamanoVisual("");
              }}
              disabled={!categoriaVisual}
            >
              <option value="">Seleccionar subcategoría</option>
              {subcategoriasDisponibles.map((sub) => (
                <option key={sub.idSubcategoria} value={sub.nombreSubcategoria}>
                  {sub.nombreSubcategoria}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Marca</label>
            <select
              className="form-select"
              value={marcaVisual}
              onChange={(e) => {
                setMarcaVisual(e.target.value);
                setTamanoVisual("");
              }}
              disabled={!subcategoriaVisual}
            >
              <option value="">Seleccionar marca</option>
              {marcasDisponibles.map((marcaItem) => (
                <option key={marcaItem} value={marcaItem}>
                  {marcaItem}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Tamaño</label>
            <select
              className="form-select"
              value={tamanoVisual}
              onChange={(e) => setTamanoVisual(e.target.value)}
              disabled={!marcaVisual}
            >
              <option value="">Seleccionar tamaño</option>
              {tamanosDisponibles.map((tamano) => (
                <option key={tamano} value={tamano}>
                  {tamano}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Proveedor</label>
            <select
              className="form-select"
              value={idProveedor}
              onChange={(e) => setIdProveedor(e.target.value)}
            >
              <option value="">Seleccionar proveedor</option>
              {proveedores.map((proveedor) => (
                <option key={proveedor.idProveedor} value={proveedor.idProveedor}>
                  {proveedor.razonSocial}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold">Precio</label>
            <input
              type="number"
              className="form-control"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="Ej: 2500"
            />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold">Stock actual</label>
            <input
              type="number"
              className="form-control"
              value={stockActual}
              onChange={(e) => setStockActual(e.target.value)}
              placeholder="Ej: 20"
            />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold">Stock mínimo</label>
            <input
              type="number"
              className="form-control"
              value={stockMinimo}
              onChange={(e) => setStockMinimo(e.target.value)}
              placeholder="Ej: 5"
            />
          </div>
        </div>

        <div className="d-flex gap-2 flex-wrap mt-4">
          <button className="btn btn-success" onClick={guardarProducto} disabled={cargando}>
            {idEditando ? "Guardar cambios" : "Agregar producto"}
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
            <h2 className="clientes-title">Registro de productos</h2>
          </div>
          <span className="section-step">{productosFiltrados.length} resultados</span>
        </div>

        <div className="mb-4 mt-2">
          <label className="form-label fw-semibold">Buscar producto</label>
          <input
            type="text"
            className="form-control"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, número, marca, presentación, categoría o proveedor"
          />
        </div>

        <div className="productos-grid">
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map((producto) => (
              <article key={producto.idProducto} className="cliente-card cliente-card-separated">
                <div className="text-center mb-3">
                  <img
                    src={obtenerImagenProducto(producto.imagenUrl)}
                    alt={producto.nombreProducto}
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

                <div className="cliente-card-header">
                  <div className="cliente-header-left">
                    <h5 className="cliente-nombre">{producto.nombreProducto}</h5>
                    <span className="cliente-id-real">ID: {producto.idProducto}</span>
                  </div>

                  <div className="cliente-actions">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => cargarEnFormulario(producto)}
                    >
                      Modificar
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => pedirEliminarProducto(producto)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                <div className="cliente-info-grid">
                  <div className="cliente-info-item">
                    <span className="cliente-label">Marca</span>
                    <span className="cliente-value">{producto.marca || "-"}</span>
                  </div>

                  <div className="cliente-info-item">
                    <span className="cliente-label">Presentación</span>
                    <span className="cliente-value">{producto.presentacion || "-"}</span>
                  </div>

                  <div className="cliente-info-item">
                    <span className="cliente-label">Precio</span>
                    <span className="cliente-value">${Number(producto.precio).toFixed(2)}</span>
                  </div>

                  <div className="cliente-info-item">
                    <span className="cliente-label">Stock actual</span>
                    <span className="cliente-value">{producto.stockActual}</span>
                  </div>

                  <div className="cliente-info-item">
                    <span className="cliente-label">Stock mínimo</span>
                    <span className="cliente-value">{producto.stockMinimo}</span>
                  </div>

                  <div className="cliente-info-item">
                    <span className="cliente-label">Categoría</span>
                    <span className="cliente-value">{nombreCategoria(producto.idCategoria)}</span>
                  </div>

                  <div className="cliente-info-item full-width">
                    <span className="cliente-label">Proveedor</span>
                    <span className="cliente-value">{nombreProveedor(producto.idProveedor)}</span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <p>No se encontraron productos.</p>
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
                  <h5 className="modal-title">Eliminar producto</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setMostrarModalEliminar(false);
                      setProductoAEliminar(null);
                    }}
                  ></button>
                </div>

                <div className="modal-body pt-2">
                  <p className="mb-2">¿Deseás eliminar este producto?</p>
                  <div className="p-3 rounded bg-light border">
                    <strong>{productoAEliminar?.nombreProducto}</strong>
                  </div>
                </div>

                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setMostrarModalEliminar(false);
                      setProductoAEliminar(null);
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={confirmarEliminarProducto}
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

export default Productos;