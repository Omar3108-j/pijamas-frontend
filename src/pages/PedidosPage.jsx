import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import PedidoCard from "../components/PedidoCard"

const ESTADOS = [
  { value: "TODOS", label: "Todos" },
  { value: "PENDIENTE", label: "Pendientes" },
  { value: "CONFIRMADO", label: "Confirmados" },
  { value: "EN_PROCESO", label: "En proceso" },
  { value: "ENTREGADO", label: "Entregados" },
  { value: "ANULADO", label: "Anulados" },
]

function PedidosPage() {
  const navigate = useNavigate()

  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState("TODOS")
  const [busqueda, setBusqueda] = useState("")

  const obtenerPedidos = async () => {
    try {
      setLoading(true)
      const res = await api.get("/pedidos")
      setPedidos(res.data)
    } catch (error) {
      console.error("Error cargando pedidos", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    obtenerPedidos()
  }, [])

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await api.put(`/pedidos/${id}/estado`, {
        estado: nuevoEstado,
      })
      obtenerPedidos()
    } catch (error) {
      console.error("Error actualizando estado", error)
    }
  }

  const cerrarSesion = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  const pedidosFiltrados = useMemo(() => {
    return pedidos.filter((pedido) => {
      const coincideEstado =
        filtroEstado === "TODOS" || pedido.estado === filtroEstado

      const texto = `${pedido.numeroPedido} ${pedido.clienteNombre} ${pedido.clienteTelefono}`
        .toLowerCase()
        .trim()

      const coincideBusqueda = texto.includes(busqueda.toLowerCase().trim())

      return coincideEstado && coincideBusqueda
    })
  }, [pedidos, filtroEstado, busqueda])

  const resumen = useMemo(() => {
    return {
      total: pedidos.length,
      pendientes: pedidos.filter((p) => p.estado === "PENDIENTE").length,
      confirmados: pedidos.filter((p) => p.estado === "CONFIRMADO").length,
      enProceso: pedidos.filter((p) => p.estado === "EN_PROCESO").length,
      entregados: pedidos.filter((p) => p.estado === "ENTREGADO").length,
    }
  }, [pedidos])

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(37,99,235,0.15), transparent 35%), linear-gradient(135deg, #020617, #0f172a 55%, #111827)",
        padding: "40px 20px 60px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            marginBottom: "30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "12px",
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontSize: "44px" }}>📦</span>
              <h1
                style={{
                  margin: 0,
                  color: "#f8fafc",
                  fontSize: "58px",
                  fontWeight: 800,
                  lineHeight: 1.05,
                }}
              >
                Bandeja de Pedidos
              </h1>
            </div>

            <p
              style={{
                margin: 0,
                color: "#94a3b8",
                fontSize: "18px",
              }}
            >
              Administra los pedidos, revisa el detalle y actualiza su estado.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "14px",
            marginBottom: "22px",
          }}
        >
          <ResumenCard title="Total" value={resumen.total} />
          <ResumenCard title="Pendientes" value={resumen.pendientes} />
          <ResumenCard title="Confirmados" value={resumen.confirmados} />
          <ResumenCard title="En proceso" value={resumen.enProceso} />
          <ResumenCard title="Entregados" value={resumen.entregados} />
        </div>

        <div
          style={{
            background: "rgba(15, 23, 42, 0.7)",
            border: "1px solid rgba(148, 163, 184, 0.15)",
            borderRadius: "22px",
            padding: "18px",
            marginBottom: "24px",
            display: "grid",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr",
              gap: "14px",
            }}
          >
            <input
              type="text"
              placeholder="Buscar por cliente, teléfono o número de pedido..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={inputStyle}
            />

            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              style={inputStyle}
            >
              {ESTADOS.map((estado) => (
                <option key={estado.value} value={estado.value}>
                  {estado.label}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            {ESTADOS.map((estado) => {
              const activo = filtroEstado === estado.value

              return (
                <button
                  key={estado.value}
                  onClick={() => setFiltroEstado(estado.value)}
                  style={{
                    border: activo
                      ? "1px solid rgba(96, 165, 250, 0.65)"
                      : "1px solid rgba(148, 163, 184, 0.18)",
                    background: activo
                      ? "rgba(59, 130, 246, 0.18)"
                      : "rgba(15, 23, 42, 0.85)",
                    color: activo ? "#bfdbfe" : "#cbd5e1",
                    borderRadius: "999px",
                    padding: "10px 14px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {estado.label}
                </button>
              )
            })}
          </div>
        </div>

        {loading ? (
          <div style={panelStyle}>Cargando pedidos...</div>
        ) : pedidosFiltrados.length === 0 ? (
          <div style={panelStyle}>No se encontraron pedidos con ese filtro.</div>
        ) : (
          <div style={{ display: "grid", gap: "22px" }}>
            {pedidosFiltrados.map((pedido) => (
              <PedidoCard
                key={pedido.id}
                pedido={pedido}
                onCambiarEstado={cambiarEstado}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ResumenCard({ title, value }) {
  return (
    <div
      style={{
        background: "rgba(15, 23, 42, 0.7)",
        border: "1px solid rgba(148, 163, 184, 0.15)",
        borderRadius: "20px",
        padding: "18px",
      }}
    >
      <div
        style={{
          fontSize: "13px",
          textTransform: "uppercase",
          letterSpacing: "1.2px",
          color: "#94a3b8",
          marginBottom: "8px",
        }}
      >
        {title}
      </div>
      <div
        style={{
          color: "#f8fafc",
          fontSize: "30px",
          fontWeight: 800,
        }}
      >
        {value}
      </div>
    </div>
  )
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
}

const panelStyle = {
  color: "#cbd5e1",
  background: "rgba(15, 23, 42, 0.7)",
  border: "1px solid rgba(148, 163, 184, 0.15)",
  borderRadius: "20px",
  padding: "30px",
}

export default PedidosPage