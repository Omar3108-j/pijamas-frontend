import { useNavigate } from "react-router-dom"
import PublicHeader from "../components/PublicHeader"

function HomePage() {
  return (
    <div style={pageStyle}>
      <PublicHeader />

      <main className="home-main">
        <section className="home-hero">
          <div>
            <p style={eyebrowStyle}>Pijamas para descansar con estilo</p>
            <h1 className="home-title">Dulces sueños, comodidad sin límites</h1>
            <p className="home-subtitle">
              Pijamas suaves, cómodas y con estilo para disfrutar cada noche con mayor comodidad.
            </p>

            <div style={actionsStyle}>
              <button onClick={() => navigate("/catalogo")} style={primaryBtnStyle}>
                Comprar ahora
              </button>
              <a href="#como-comprar" style={secondaryBtnStyle}>
                Cómo comprar
              </a>
            </div>
          </div>

          <div className="home-hero-card">
            <div style={starsStyle}>⭐ 🌙 ⭐</div>
            <div className="home-mock-image">
              <span>Caylu Pijamas</span>
            </div>
          </div>
        </section>

        <section style={benefitsStyle}>
          <Benefit icon="🌙" title="Comodidad" text="Prendas suaves para descansar mejor." />
          <Benefit icon="✨" title="Para todos" text="Diseños cómodos para cada estilo y ocasión." />
          <Benefit icon="📲" title="Pedido fácil" text="Compra online y confirma por WhatsApp." />
        </section>

        <section id="como-comprar" style={sectionStyle}>
          <p style={eyebrowStyle}>Proceso simple</p>
          <h2 style={sectionTitleStyle}>¿Cómo comprar?</h2>

          <div style={stepsStyle}>
            <Step number="1" title="Elige tus pijamas" text="Revisa el catálogo y agrega tus productos favoritos." />
            <Step number="2" title="Completa tus datos" text="Ingresa nombre, teléfono, dirección y método de pago." />
            <Step number="3" title="Confirma por WhatsApp" text="Envía el resumen del pedido y coordina tu entrega." />
          </div>
        </section>

        <section className="home-payment">
          <div>
            <p style={eyebrowStyle}>Pagos disponibles</p>
            <h2 style={sectionTitleStyle}>Paga con Yape o Plin</h2>
            <p style={paymentTextStyle}>
              Después de registrar tu pedido, podrás enviar tu comprobante por
              WhatsApp para confirmar la compra.
            </p>
          </div>

          <div style={paymentCardsStyle}>
            <div style={paymentCardStyle}>Yape</div>
            <div style={paymentCardStyle}>Plin</div>
          </div>
        </section>
      </main>
    </div>
  )
}

function Benefit({ icon, title, text }) {
  return (
    <div style={benefitCardStyle}>
      <div style={{ fontSize: "34px" }}>{icon}</div>
      <h3 style={{ margin: "10px 0 8px", color: "#1f2937" }}>{title}</h3>
      <p style={{ margin: 0, color: "#6b7280" }}>{text}</p>
    </div>
  )
}

function Step({ number, title, text }) {
  return (
    <div style={stepCardStyle}>
      <div style={stepNumberStyle}>{number}</div>
      <h3 style={{ margin: "14px 0 8px", color: "#1f2937" }}>{title}</h3>
      <p style={{ margin: 0, color: "#6b7280", lineHeight: 1.5 }}>{text}</p>
    </div>
  )
}

const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #F1E7DB, #AADDE1 55%, #fff)",
  color: "#1f2937",
}

const headerStyle = {
  position: "sticky",
  top: 0,
  zIndex: 20,
  background: "rgba(255,255,255,0.82)",
  borderBottom: "1px solid rgba(64,145,242,0.18)",
  backdropFilter: "blur(12px)",
}

const headerInnerStyle = {
  maxWidth: "1220px",
  margin: "0 auto",
  padding: "20px 24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
}

const logoStyle = {
  fontSize: "34px",
  fontWeight: 950,
  color: "#4091F2",
  lineHeight: 1,
}

const subLogoStyle = {
  color: "#F9C55D",
  fontWeight: 900,
  fontSize: "19px",
}

const navStyle = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
}

const navBtnStyle = {
  background: "#4091F2",
  color: "#fff",
  border: "none",
  borderRadius: "999px",
  padding: "12px 18px",
  fontWeight: 900,
  cursor: "pointer",
}

const adminBtnStyle = {
  background: "rgba(64,145,242,0.1)",
  color: "#4091F2",
  border: "1px solid rgba(64,145,242,0.25)",
  borderRadius: "999px",
  padding: "12px 16px",
  fontWeight: 900,
  cursor: "pointer",
}

const mainStyle = {
  maxWidth: "1220px",
  margin: "0 auto",
  padding: "56px 24px",
}

const heroStyle = {
  display: "grid",
  gridTemplateColumns: "1.1fr 0.9fr",
  gap: "40px",
  alignItems: "center",
  marginBottom: "44px",
}

const eyebrowStyle = {
  color: "#FE564B",
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: "1.5px",
  margin: 0,
}

const titleStyle = {
  fontSize: "68px",
  lineHeight: 1,
  margin: "12px 0 18px",
  color: "#4091F2",
  fontWeight: 950,
}

const subtitleStyle = {
  fontSize: "20px",
  color: "#4b5563",
  lineHeight: 1.6,
  maxWidth: "620px",
}

const actionsStyle = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  marginTop: "26px",
}

const primaryBtnStyle = {
  background: "linear-gradient(135deg, #4091F2, #2563eb)",
  color: "#fff",
  border: "none",
  borderRadius: "18px",
  padding: "15px 22px",
  fontWeight: 950,
  fontSize: "16px",
  cursor: "pointer",
}

const secondaryBtnStyle = {
  background: "#fff",
  color: "#4091F2",
  border: "1px solid rgba(64,145,242,0.25)",
  borderRadius: "18px",
  padding: "15px 22px",
  fontWeight: 950,
  textDecoration: "none",
}

const heroCardStyle = {
  background: "rgba(255,255,255,0.75)",
  border: "1px solid rgba(64,145,242,0.18)",
  borderRadius: "38px",
  padding: "26px",
  boxShadow: "0 28px 60px rgba(64,145,242,0.14)",
}

const starsStyle = {
  textAlign: "center",
  fontSize: "34px",
  marginBottom: "18px",
}

const mockImageStyle = {
  height: "420px",
  borderRadius: "30px",
  background:
    "radial-gradient(circle at top, rgba(249,197,93,0.55), transparent 45%), linear-gradient(135deg, #4091F2, #AADDE1)",
  display: "grid",
  placeItems: "center",
  color: "#fff",
  fontSize: "42px",
  fontWeight: 950,
  textAlign: "center",
}

const benefitsStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "18px",
  marginBottom: "52px",
}

const benefitCardStyle = {
  background: "rgba(255,255,255,0.82)",
  border: "1px solid rgba(64,145,242,0.18)",
  borderRadius: "26px",
  padding: "24px",
  boxShadow: "0 18px 35px rgba(64,145,242,0.1)",
}

const sectionStyle = {
  marginBottom: "52px",
}

const sectionTitleStyle = {
  fontSize: "42px",
  margin: "8px 0 22px",
  color: "#4091F2",
  fontWeight: 950,
}

const stepsStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "18px",
}

const stepCardStyle = {
  background: "rgba(255,255,255,0.85)",
  border: "1px solid rgba(64,145,242,0.18)",
  borderRadius: "28px",
  padding: "24px",
}

const stepNumberStyle = {
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  background: "#F9C55D",
  display: "grid",
  placeItems: "center",
  fontWeight: 950,
  color: "#1f2937",
}

const paymentStyle = {
  background: "rgba(255,255,255,0.85)",
  border: "1px solid rgba(64,145,242,0.18)",
  borderRadius: "34px",
  padding: "30px",
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gap: "24px",
  alignItems: "center",
}

const paymentTextStyle = {
  color: "#6b7280",
  lineHeight: 1.6,
  maxWidth: "620px",
}

const paymentCardsStyle = {
  display: "flex",
  gap: "14px",
  flexWrap: "wrap",
}

const paymentCardStyle = {
  background: "#4091F2",
  color: "#fff",
  borderRadius: "24px",
  padding: "28px",
  fontSize: "24px",
  fontWeight: 950,
  minWidth: "120px",
  textAlign: "center",
}

export default HomePage