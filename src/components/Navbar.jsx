import { NavLink } from "react-router-dom";

function Navbar() {
  const usuario = JSON.parse(
  localStorage.getItem("usuarioLogueado")
);

const cerrarSesion = () => {
  localStorage.removeItem("usuarioLogueado");

  window.location.href = "/";
};
  return (
    <nav className="navbar navbar-expand-lg custom-navbar shadow-sm">
      <div className="container">
        <div className="d-flex flex-column">
          <span className="navbar-brand fw-bold text-white mb-0">
            StockIt!
          </span>

          <small
            style={{
              color: "#d1d5db",
              marginTop: "-8px",
              fontSize: "0.75rem",
              letterSpacing: "0.5px",
            }}
          >
            Sistema de Gestión
          </small>
        </div>

        <button
          className="navbar-toggler bg-light"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContenido"
          aria-controls="navbarContenido"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContenido">
          <div className="navbar-nav ms-auto gap-2 align-items-lg-center">
  <NavLink
    to="/inicio"
    className={({ isActive }) =>
      `nav-link custom-link ${isActive ? "active-link" : ""}`
    }
  >
    Inicio
  </NavLink>

  <NavLink
    to="/pedidos"
    className={({ isActive }) =>
      `nav-link custom-link ${isActive ? "active-link" : ""}`
    }
  >
    Pedidos
  </NavLink>

  <NavLink
    to="/clientes"
    className={({ isActive }) =>
      `nav-link custom-link ${isActive ? "active-link" : ""}`
    }
  >
    Clientes
  </NavLink>

  <NavLink
    to="/productos"
    className={({ isActive }) =>
      `nav-link custom-link ${isActive ? "active-link" : ""}`
    }
  >
    Productos
  </NavLink>

  <NavLink
    to="/proveedores"
    className={({ isActive }) =>
      `nav-link custom-link ${isActive ? "active-link" : ""}`
    }
  >
    Proveedores
  </NavLink>

  <NavLink
    to="/movimientos-stock"
    className={({ isActive }) =>
      `nav-link custom-link ${isActive ? "active-link" : ""}`
    }
  >
    Stock
  </NavLink>

  <NavLink
    to="/reportes"
    className={({ isActive }) =>
      `nav-link custom-link ${isActive ? "active-link" : ""}`
    }
  >
    Reportes
  </NavLink>

  <div className="d-flex align-items-center gap-2 ms-lg-3 mt-3 mt-lg-0">
    <span className="badge bg-primary px-3 py-2">
      {usuario?.rol || "Usuario"}
    </span>

    <button
      className="btn btn-sm btn-outline-light"
      onClick={cerrarSesion}
    >
      Cerrar sesión
    </button>
  </div>
</div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;