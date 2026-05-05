import { useState } from "react"
import { useNavigate } from "react-router-dom"
import AdminProductosPage from "./AdminProductosPage"
import PedidosPage from "./PedidosPage"

function AdminDashboardPage() {
  const [tab, setTab] = useState("productos")
  const navigate = useNavigate()

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>

        {/* HEADER */}
        <div style={headerStyle}>
  <h1 style={titleStyle}>Panel Administrador</h1>

  <div style={{ display: "flex", gap: "10px" }}>
    <button onClick={() => navigate("/")} style={secondaryBtn}>
      Ver tienda
    </button>

    <button
      onClick={() => {
        localStorage.removeItem("token")
        navigate("/login")
      }}
      style={dangerBtn}
    >
      Cerrar sesión
    </button>
  </div>
</div>

        {/* TABS */}
        <div style={tabsStyle}>
          <button
            onClick={() => setTab("productos")}
            style={tab === "productos" ? activeTab : tabBtn}
          >
            Productos
          </button>

          <button
            onClick={() => setTab("pedidos")}
            style={tab === "pedidos" ? activeTab : tabBtn}
          >
            Pedidos
          </button>
        </div>

        {/* CONTENIDO */}
        <div style={{ marginTop: "20px" }}>
          {tab === "productos" && <AdminProductosPage />}
          {tab === "pedidos" && <PedidosPage />}
        </div>

      </div>
    </div>
  )
}

const pageStyle = {
  minHeight: "100vh",
  background: "#020617",
  padding: "20px",
}

const containerStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
}

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}

const titleStyle = {
  color: "#fff",
  fontSize: "32px",
}

const tabsStyle = {
  display: "flex",
  gap: "10px",
  marginTop: "20px",
}

const tabBtn = {
  padding: "10px 16px",
  borderRadius: "10px",
  border: "1px solid #334155",
  background: "#0f172a",
  color: "#94a3b8",
  cursor: "pointer",
}

const activeTab = {
  ...tabBtn,
  background: "#2563eb",
  color: "#fff",
}

const dangerBtn = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "10px 16px",
  borderRadius: "10px",
  cursor: "pointer",
}
const secondaryBtn = {
  background: "#0f172a",
  color: "#fff",
  border: "1px solid #334155",
  padding: "10px 16px",
  borderRadius: "10px",
  cursor: "pointer",
}

export default AdminDashboardPage