import { useLocation, useNavigate } from "react-router-dom"
import PublicHeader from "../components/PublicHeader"

function PedidoConfirmadoPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const pedido = location.state?.pedido

  if (!pedido) {
    return (
      <div style={pageStyle}>
        <PublicHeader />
        <main style={mainStyle}>
          <div style={boxStyle}>
            <h1>Pedido no encontrado</h1>
            <button onClick={() => navigate("/catalogo")} style={primaryBtnStyle}>
              Volver al catálogo
            </button>
          </div>
        </main>
      </div>
    )
  }

  const mensajeWhatsApp = construirMensajeWhatsApp(pedido)
  const numeroWhatsApp = "51999999999"
  const whatsappUrl = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
    mensajeWhatsApp
  )}`

  return (
    <div style={pageStyle}>
      <PublicHeader />

      <main style={mainStyle}>
        <div style={boxStyle}>
          <div style={checkCircleStyle}>✓</div>

          <p style={eyebrowStyle}>Pedido registrado</p>

          <h1 style={titleStyle}>¡Tu pedido fue recibido!</h1>

          <p style={subtitleStyle}>
            Registramos tu pedido <strong>{pedido.numeroPedido}</strong>.
            Ahora puedes enviarlo por WhatsApp para coordinar el pago y la entrega.
          </p>

          <div style={summaryStyle}>
            <Info label="Cliente" value={pedido.clienteNombre} />
            <Info label="Teléfono" value={pedido.clienteTelefono} />
            <Info label="Método de pago" value={pedido.metodoPago} />
            {pedido.metodoPago !== "CONTRA_ENTREGA" && (
            <Info
              label="N° de operación"
              value={pedido.numeroOperacion || "Pendiente"}
            />

          )}
            <Info label="Total" value={`S/ ${pedido.total}`} />
          </div>

          <div style={productsBoxStyle}>
            <h3 style={{ marginTop: 0 }}>Productos</h3>

            {pedido.detalles?.map((d) => (
              <div key={d.id} style={productRowStyle}>
                <span>{d.productoNombre} x {d.cantidad}</span>
                <strong>S/ {d.subtotal}</strong>
              </div>
            ))}
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            style={whatsappBtnStyle}
          >
            Enviar pedido por WhatsApp
          </a>

          <button onClick={() => navigate("/catalogo")} style={secondaryBtnStyle}>
            Seguir comprando
          </button>
        </div>
      </main>
    </div>
  )
}

function construirMensajeWhatsApp(pedido) {
  const productos = pedido.detalles
    ?.map((d) => `- ${d.productoNombre} x ${d.cantidad} = S/ ${d.subtotal}`)
    .join("\n")

  return `Hola, quiero confirmar mi pedido de Caylu Pijamas 🌙

N° Pedido: ${pedido.numeroPedido}
Cliente: ${pedido.clienteNombre}
Teléfono: ${pedido.clienteTelefono}
Distrito: ${pedido.distrito}
Dirección: ${pedido.direccion}
Referencia: ${pedido.referencia || "-"}
Método de pago: ${pedido.metodoPago}
${pedido.metodoPago !== "CONTRA_ENTREGA" ? `N° de operación: ${pedido.numeroOperacion || "Pendiente"}` : ""}

Productos:
${productos}

Total: S/ ${pedido.total}

Adjuntaré mi comprobante de pago por este medio.`
}

function Info({ label, value }) {
  return (
    <div style={infoStyle}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #F1E7DB, #AADDE1 55%, #fff)",
  color: "#1f2937",
}

const mainStyle = {
  maxWidth: "860px",
  margin: "0 auto",
  padding: "54px 24px",
}

const boxStyle = {
  background: "rgba(255,255,255,0.94)",
  border: "1px solid rgba(64,145,242,0.18)",
  borderRadius: "34px",
  padding: "38px",
  textAlign: "center",
  boxShadow: "0 22px 45px rgba(64,145,242,0.13)",
}

const checkCircleStyle = {
  width: "78px",
  height: "78px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #22c55e, #16a34a)",
  color: "#fff",
  display: "grid",
  placeItems: "center",
  fontSize: "42px",
  fontWeight: 950,
  margin: "0 auto 18px",
  boxShadow: "0 18px 35px rgba(34,197,94,0.28)",
}

const eyebrowStyle = {
  color: "#FE564B",
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: "1.5px",
  margin: "10px 0 0",
}

const titleStyle = {
  fontSize: "46px",
  margin: "10px 0 12px",
  color: "#4091F2",
  fontWeight: 950,
}

const subtitleStyle = {
  color: "#6b7280",
  lineHeight: 1.6,
  maxWidth: "640px",
  margin: "0 auto 24px",
}

const summaryStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "12px",
  margin: "24px 0",
}

const infoStyle = {
  background: "#F1E7DB",
  borderRadius: "18px",
  padding: "16px",
  display: "grid",
  gap: "6px",
}

const productsBoxStyle = {
  background: "rgba(170,221,225,0.35)",
  border: "1px solid rgba(64,145,242,0.14)",
  borderRadius: "22px",
  padding: "18px",
  marginBottom: "22px",
  textAlign: "left",
}

const productRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "14px",
  padding: "12px 0",
  borderBottom: "1px solid rgba(64,145,242,0.12)",
}

const whatsappBtnStyle = {
  display: "block",
  background: "linear-gradient(135deg, #22c55e, #16a34a)",
  color: "#fff",
  textDecoration: "none",
  borderRadius: "18px",
  padding: "16px 18px",
  fontWeight: 950,
  marginBottom: "12px",
  boxShadow: "0 16px 32px rgba(34,197,94,0.25)",
}

const primaryBtnStyle = {
  background: "linear-gradient(135deg, #4091F2, #2563eb)",
  color: "#fff",
  border: "none",
  borderRadius: "18px",
  padding: "15px 18px",
  fontWeight: 950,
  cursor: "pointer",
}

const secondaryBtnStyle = {
  background: "transparent",
  color: "#4091F2",
  border: "none",
  fontWeight: 900,
  cursor: "pointer",
}

export default PedidoConfirmadoPage