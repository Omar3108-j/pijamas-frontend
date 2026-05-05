import { useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import api from "../services/api"
import PublicHeader from "../components/PublicHeader"
import { paymentConfig } from "../data/paymentConfig"


function CheckoutPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const carrito = location.state?.carrito || obtenerCarritoGuardado()

  const [form, setForm] = useState({
    clienteNombre: "",
    clienteTelefono: "",
    distrito: "",
    direccion: "",
    referencia: "",
    metodoPago: "YAPE",
    numeroOperacion: "",
  })

  const [loading, setLoading] = useState(false)
  // ✅ FIX 1: showQR declarado aquí en CheckoutPage, no dentro de useMemo
  const [showQR, setShowQR] = useState(false)

  // ✅ FIX 2: useMemo limpio, sin hooks adentro
  const total = useMemo(() => {
    return carrito.reduce(
      (sum, item) => sum + Number(item.precio) * item.cantidad,
      0
    )
  }, [carrito])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const confirmarPedido = async (e) => {
    e.preventDefault()

    if (carrito.length === 0) {
      alert("Tu carrito está vacío.")
      navigate("/")
      return
    }

    try {
      setLoading(true)

      const payload = {
        ...form,
        detalles: carrito.map((item) => ({
          productoId: item.id,
          cantidad: item.cantidad,
        })),
      }

      const res = await api.post("/pedidos", payload)

      localStorage.removeItem("carrito_caylu")

      navigate("/pedido-confirmado", {
        state: { pedido: res.data },
      })
    } catch (error) {
      console.error("Error creando pedido", error)
      alert("No se pudo registrar el pedido. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={pageStyle}>
      <PublicHeader carrito={carrito} />
      <main className="checkout-main">
        <button onClick={() => navigate("/catalogo")} style={backBtnStyle}>
          ← Volver al catálogo
        </button>

        <div className="checkout-layout">
          <section className="checkout-box">
            <p style={eyebrowStyle}>Finalizar compra</p>
            <h1 className="checkout-title">Datos para tu pedido</h1>
            <p style={subtitleStyle}>
              Completa tus datos para registrar tu pedido. Luego podrás enviar el
              resumen por WhatsApp.
            </p>

            <form onSubmit={confirmarPedido} style={formStyle}>
              <Input
                label="Nombre completo"
                name="clienteNombre"
                value={form.clienteNombre}
                onChange={handleChange}
                required
              />

              <Input
                label="Teléfono / WhatsApp"
                name="clienteTelefono"
                value={form.clienteTelefono}
                onChange={handleChange}
                required
              />

              <Input
                label="Distrito"
                name="distrito"
                value={form.distrito}
                onChange={handleChange}
                required
              />

              <Input
                label="Dirección"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                required
              />

              <Input
                label="Referencia"
                name="referencia"
                value={form.referencia}
                onChange={handleChange}
              />

              <div>
                <label style={labelStyle}>Método de pago</label>
                <select
                  name="metodoPago"
                  value={form.metodoPago}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="YAPE">Yape</option>
                  <option value="PLIN">Plin</option>
                  <option value="CONTRA_ENTREGA">Contra entrega</option>
                </select>

                {form.metodoPago !== "CONTRA_ENTREGA" && (
                  <div style={qrBoxStyle}>
                    <div style={qrHeaderStyle}>
                      <strong>Paga con {paymentConfig[form.metodoPago].nombre}</strong>
                      <span>Total: S/ {total.toFixed(2)}</span>
                    </div>

                    <div style={qrContentStyle}>
                      <img
                        src={paymentConfig[form.metodoPago].qr}
                        alt={`QR ${paymentConfig[form.metodoPago].nombre}`}
                        style={{ ...qrImageStyle, cursor: "zoom-in" }}
                        onClick={() => setShowQR(true)}
                      />

                      <div style={qrInfoStyle}>
                        <p>
                          <strong>Número:</strong>{" "}
                          {paymentConfig[form.metodoPago].numero}
                        </p>
                        <p>
                          <strong>Titular:</strong>{" "}
                          {paymentConfig[form.metodoPago].titular}
                        </p>
                        <p style={{ marginBottom: 0 }}>
                          Luego de pagar, ingresa el número de operación para validar tu pedido.
                        </p>
                      </div>
                    </div>

                    <Input
                      label="Número de operación"
                      name="numeroOperacion"
                      value={form.numeroOperacion}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading} style={submitBtnStyle}>
                {loading ? "Registrando pedido..." : "Confirmar pedido"}
              </button>
            </form>
          </section>

          <aside className="checkout-summary">
            <h2 style={{ marginTop: 0 }}>Resumen</h2>

            {carrito.map((item) => (
              <div key={item.id} style={summaryItemStyle}>
                <div>
                  <strong>{item.nombre}</strong>
                  <div style={{ color: "#6b7280", fontSize: "14px" }}>
                    S/ {item.precio} x {item.cantidad}
                  </div>
                </div>
                <strong>S/ {(Number(item.precio) * item.cantidad).toFixed(2)}</strong>
              </div>
            ))}

            <div style={totalStyle}>
              <span>Total</span>
              <strong>S/ {total.toFixed(2)}</strong>
            </div>

            <div style={paymentInfoStyle}>
              <strong>Pago:</strong> Si eliges Yape o Plin, escanea el QR, paga el monto exacto e ingresa el número de operación.
            </div>
          </aside>
        </div>
      </main>

      {/* ✅ FIX 3: Modal del QR aquí en CheckoutPage, donde showQR y form están disponibles */}
      {showQR && (
        <div style={modalOverlayStyle} onClick={() => setShowQR(false)}>
          <div style={modalContentStyle}>
            <img
              src={paymentConfig[form.metodoPago].qr}
              alt="QR grande"
              style={modalImageStyle}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function Input({ label, ...props }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input {...props} style={inputStyle} />
    </div>
  )
}

const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #F1E7DB, #AADDE1 55%, #fff)",
  color: "#1f2937",
}

const backBtnStyle = {
  background: "rgba(255,255,255,0.85)",
  border: "1px solid rgba(64,145,242,0.22)",
  color: "#4091F2",
  borderRadius: "999px",
  padding: "12px 16px",
  fontWeight: 900,
  cursor: "pointer",
  marginBottom: "22px",
}

const eyebrowStyle = {
  color: "#FE564B",
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: "1.5px",
  margin: 0,
}

const subtitleStyle = {
  color: "#6b7280",
  marginBottom: "24px",
}

const formStyle = {
  display: "grid",
  gap: "16px",
}

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: 900,
  color: "#374151",
}

const inputStyle = {
  width: "100%",
  border: "1px solid rgba(64,145,242,0.22)",
  borderRadius: "16px",
  padding: "14px 16px",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
}

const submitBtnStyle = {
  marginTop: "8px",
  background: "linear-gradient(135deg, #4091F2, #2563eb)",
  color: "#fff",
  border: "none",
  borderRadius: "18px",
  padding: "15px 18px",
  fontWeight: 950,
  fontSize: "16px",
  cursor: "pointer",
}

const summaryItemStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "14px",
  padding: "14px 0",
  borderBottom: "1px solid rgba(148,163,184,0.25)",
}

const totalStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "18px",
  fontSize: "24px",
}

const paymentInfoStyle = {
  marginTop: "18px",
  background: "#F1E7DB",
  color: "#374151",
  borderRadius: "18px",
  padding: "16px",
  lineHeight: 1.5,
}

const qrBoxStyle = {
  background: "rgba(255,255,255,0.9)",
  border: "1px solid rgba(64,145,242,0.22)",
  borderRadius: "24px",
  padding: "18px",
  boxShadow: "0 14px 30px rgba(64,145,242,0.10)",
}

const qrHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  alignItems: "center",
  marginBottom: "16px",
  color: "#1f2937",
}

const qrContentStyle = {
  display: "grid",
  gridTemplateColumns: "150px 1fr",
  gap: "16px",
  alignItems: "center",
  marginBottom: "16px",
}

const qrImageStyle = {
  width: "150px",
  height: "150px",
  objectFit: "contain",
  background: "#fff",
  borderRadius: "18px",
  padding: "10px",
  border: "1px solid rgba(148,163,184,0.25)",
}

const qrInfoStyle = {
  fontSize: "14px",
  color: "#4b5563",
  lineHeight: 1.5,
}

const modalOverlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.75)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
  backdropFilter: "blur(6px)",
}

const modalContentStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "20px",
  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
}

const modalImageStyle = {
  width: "300px",
  maxWidth: "90vw",
  height: "auto",
}

function obtenerCarritoGuardado() {
  const carritoGuardado = localStorage.getItem("carrito_caylu")
  return carritoGuardado ? JSON.parse(carritoGuardado) : []
}

export default CheckoutPage