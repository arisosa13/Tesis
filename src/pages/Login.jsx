import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const ingresar = () => {
    if (
      usuario === "admin" &&
      password === "1234"
    ) {
      localStorage.setItem(
        "usuarioLogueado",
        JSON.stringify({
          nombre: "Administrador",
          rol: "Administrador",
        })
      );

      window.location.href = "/inicio";
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  };

  return (
    <main
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="card shadow border-0 p-4"
        style={{
          width: "100%",
          maxWidth: "420px",
          borderRadius: "24px",
        }}
      >
        <div className="text-center mb-4">
          <h1 className="fw-bold mb-1">StockIt!</h1>

          <p className="text-muted mb-0">
            Sistema de Gestión
          </p>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">
            Usuario
          </label>

          <input
            type="text"
            className="form-control"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="Ingresá tu usuario"
          />
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">
            Contraseña
          </label>

          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresá tu contraseña"
          />
        </div>

        <button
          className="btn btn-dark w-100"
          onClick={ingresar}
        >
          Ingresar
        </button>

        <div className="text-center mt-3">
          <small className="text-muted">
            Usuario: admin | Contraseña: 1234
          </small>
        </div>
      </div>
    </main>
  );
}

export default Login;