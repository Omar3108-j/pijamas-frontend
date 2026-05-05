import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

function LoginPage() {
  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      setLoading(true)

      const res = await api.post("/auth/login", {
        username,
        password,
      })

      localStorage.setItem("token", res.data.token)
      navigate("/admin")
    } catch (err) {
      console.error(err)
      setError("Usuario o contraseña incorrectos")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background:
          "radial-gradient(circle at top, rgba(59,130,246,0.18), transparent 30%), linear-gradient(135deg, #020617, #0f172a 55%, #111827)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "rgba(15, 23, 42, 0.78)",
          border: "1px solid rgba(148, 163, 184, 0.18)",
          borderRadius: "28px",
          padding: "34px",
          boxShadow: "0 30px 60px rgba(0,0,0,0.28)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "44px", marginBottom: "10px" }}>🔐</div>
          <h1
            style={{
              margin: 0,
              color: "#f8fafc",
              fontSize: "38px",
              fontWeight: 800,
            }}
          >
            Acceso Admin
          </h1>
          <p
            style={{
              marginTop: "10px",
              marginBottom: 0,
              color: "#94a3b8",
              fontSize: "16px",
            }}
          >
            Ingresa para administrar pedidos de la tienda.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Usuario</label>
            <input
              type="text"
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Contraseña</label>
            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          {error && (
            <div
              style={{
                background: "rgba(239, 68, 68, 0.12)",
                border: "1px solid rgba(239, 68, 68, 0.25)",
                color: "#fca5a5",
                borderRadius: "14px",
                padding: "12px 14px",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "6px",
              background: "linear-gradient(135deg, #2563eb, #3b82f6)",
              color: "#fff",
              border: "none",
              borderRadius: "16px",
              padding: "14px 18px",
              fontSize: "16px",
              fontWeight: 800,
              cursor: "pointer",
              opacity: loading ? 0.7 : 1,
              boxShadow: "0 14px 28px rgba(37, 99, 235, 0.28)",
            }}
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  )
}

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  color: "#cbd5e1",
  fontSize: "14px",
  fontWeight: 700,
}

const inputStyle = {
  width: "100%",
  background: "rgba(2, 6, 23, 0.75)",
  color: "#f8fafc",
  border: "1px solid rgba(148, 163, 184, 0.18)",
  borderRadius: "14px",
  padding: "14px 16px",
  outline: "none",
  fontSize: "15px",
  boxSizing: "border-box",
}

export default LoginPage