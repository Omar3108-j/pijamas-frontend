import { useEffect, useMemo, useState } from "react"
import api from "../services/api"
import { useNavigate } from "react-router-dom"
import PublicHeader from "../components/PublicHeader"

function CatalogoPage() {
  const [productos, setProductos] = useState([])
  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem("carrito_caylu")
    return carritoGuardado ? JSON.parse(carritoGuardado) : []
  })
  const [loading, setLoading] = useState(true)
  const [mensajeCarrito, setMensajeCarrito] = useState("")
  const [productoAnimadoId, setProductoAnimadoId] = useState(null)
  // ✅ FIX 1: productoDetalle vive en CatalogoPage, no en ProductoCard
  const [productoDetalle, setProductoDetalle] = useState(null)
  const navigate = useNavigate()

  const obtenerProductos = async () => {
    try {
      setLoading(true)
      const res = await api.get("/productos/activos")
      setProductos(res.data)
    } catch (error) {
      console.error("Error cargando productos", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    localStorage.setItem("carrito_caylu", JSON.stringify(carrito))
  }, [carrito])

  useEffect(() => {
    obtenerProductos()
  }, [])

  const agregarAlCarrito = (producto) => {
    if (producto.stock <= 0) {
      setMensajeCarrito("Producto sin stock disponible")
      setTimeout(() => setMensajeCarrito(""), 2200)
      return
    }

    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id)
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      }
      return [...prev, { ...producto, cantidad: 1 }]
    })

    setMensajeCarrito(`${producto.nombre} agregado al carrito`)
    setProductoAnimadoId(producto.id)
    setTimeout(() => setMensajeCarrito(""), 2200)
    setTimeout(() => setProductoAnimadoId(null), 450)
  }

  const aumentarCantidad = (id) => {
    setCarrito((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
      )
    )
  }

  const disminuirCantidad = (id) => {
    setCarrito((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
        )
        .filter((item) => item.cantidad > 0)
    )
  }

  const eliminarProducto = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id))
  }

  const total = useMemo(() => {
    return carrito.reduce(
      (sum, item) => sum + Number(item.precio) * item.cantidad,
      0
    )
  }, [carrito])

  return (
    <div style={pageStyle}>
      <PublicHeader carrito={carrito} />

      {mensajeCarrito && (
        <div className="toast-carrito">✅ {mensajeCarrito}</div>
      )}

      <main style={mainStyle}>
        <section style={heroStyle}>
          <p style={eyebrowStyle}>Nueva colección</p>
          <h1 style={titleStyle}>Dulces sueños, comodidad sin límites</h1>
          <p style={subtitleStyle}>
            Comodidad para todos, dulces sueños para cada noche.
          </p>
        </section>

        <div className="catalogo-layout">
          <section>
            {loading ? (
              <div style={emptyStyle}>Cargando productos...</div>
            ) : productos.length === 0 ? (
              <div style={emptyStyle}>No hay productos disponibles.</div>
            ) : (
              <div className="catalogo-grid">
                {productos.map((producto) => (
                  <ProductoCard
                    key={producto.id}
                    producto={producto}
                    onAgregar={agregarAlCarrito}
                    animado={productoAnimadoId === producto.id}
                    onVerDetalle={setProductoDetalle}
                  />
                ))}
              </div>
            )}
          </section>

          <aside className="catalogo-carrito">
            <h2 style={{ marginTop: 0, color: "#1f2937" }}>Tu pedido</h2>

            {carrito.length === 0 ? (
              <div className="carrito-empty">
                <div className="carrito-empty__icon">🛒</div>
                <h3>Tu carrito está vacío</h3>
                <p>Explora el catálogo y agrega tus pijamas favoritas.</p>
              </div>
            ) : (
              <>
                <div style={{ display: "grid", gap: "12px" }}>
                  {carrito.map((item) => (
                    <div key={item.id} style={cartItemStyle}>
                      <div>
                        <strong>{item.nombre}</strong>
                        <div style={{ color: "#6b7280", fontSize: "14px" }}>
                          S/ {item.precio} x {item.cantidad}
                        </div>
                      </div>

                      <div style={qtyStyle}>
                        <button onClick={() => disminuirCantidad(item.id)}>-</button>
                        <span>{item.cantidad}</span>
                        <button onClick={() => aumentarCantidad(item.id)}>+</button>
                      </div>

                      <button
                        onClick={() => eliminarProducto(item.id)}
                        style={removeBtnStyle}
                      >
                        Quitar
                      </button>
                    </div>
                  ))}
                </div>

                <div style={totalBoxStyle}>
                  <span>Total</span>
                  <strong>S/ {total.toFixed(2)}</strong>
                </div>

                <button
                  className="checkout-btn-pro"
                  onClick={() => navigate("/checkout", { state: { carrito } })}
                  disabled={carrito.length === 0}
                >
                  Continuar pedido
                </button>
              </>
            )}
          </aside>
        </div>
      </main>

      {/* ✅ FIX 2: El modal vive aquí en CatalogoPage donde tiene acceso a productoDetalle y agregarAlCarrito */}
      {productoDetalle && (
        <div
          className="producto-modal-overlay"
          onClick={() => setProductoDetalle(null)}
        >
          <div
            className="producto-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="producto-modal__close"
              onClick={() => setProductoDetalle(null)}
            >
              ×
            </button>

            <div className="producto-modal__image-box">
              <img
                src={
                  productoDetalle.imagen ||
                  "https://via.placeholder.com/700x900?text=Caylu+Pijamas"
                }
                alt={productoDetalle.nombre}
                className="producto-modal__image"
              />
            </div>

            <div className="producto-modal__content">
              <p className="producto-modal__eyebrow">Detalle del producto</p>
              <h2>{productoDetalle.nombre}</h2>

              <p className="producto-modal__desc">
                {productoDetalle.descripcion || "Sin descripción disponible."}
              </p>

              <div className="producto-modal__tags">
                <Tag text={productoDetalle.categoria} />
                <Tag text={`Talla ${productoDetalle.talla}`} />
                <Tag text={productoDetalle.color} />
              </div>

              <div className="producto-modal__info">
                <div>
                  <span>Precio</span>
                  <strong>S/ {productoDetalle.precio}</strong>
                </div>
                <div>
                  <span>Stock</span>
                  <strong>{productoDetalle.stock}</strong>
                </div>
              </div>

              <button
                className="producto-modal__btn"
                disabled={productoDetalle.stock <= 0}
                onClick={() => {
                  agregarAlCarrito(productoDetalle)
                  setProductoDetalle(null)
                }}
              >
                {productoDetalle.stock <= 0 ? "Sin stock" : "Agregar al carrito"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ✅ FIX 3: ProductoCard limpio, sin estado ni modal — solo recibe props
function ProductoCard({ producto, onAgregar, animado, onVerDetalle }) {
  return (
    // ✅ FIX 4: onClick y style correctamente dentro del elemento JSX
    <div
      className={animado ? "producto-card producto-card--animado" : "producto-card"}
      onClick={() => onVerDetalle(producto)}
      style={{ cursor: "pointer" }}
    >
      <div style={imageBoxStyle}>
        <img
          src={
            producto.imagen ||
            "https://via.placeholder.com/600x700?text=Caylu+Pijamas"
          }
          alt={producto.nombre}
          style={imageStyle}
        />
      </div>

      <div style={{ padding: "22px" }}>
        <h3 style={productTitleStyle}>{producto.nombre}</h3>
        <p style={descStyle}>{producto.descripcion}</p>

        <div style={tagsStyle}>
          <Tag text={producto.categoria} />
          <Tag text={`Talla ${producto.talla}`} />
          <Tag text={producto.color} />
        </div>

        <div style={priceRowStyle}>
          <strong>S/ {producto.precio}</strong>
          <span
            className={
              producto.stock > 0
                ? "stock-badge stock-badge--ok"
                : "stock-badge stock-badge--out"
            }
          >
            {producto.stock > 0 ? `Stock: ${producto.stock}` : "Sin stock"}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onAgregar(producto)
          }}
          style={{
            ...addBtnStyle,
            opacity: producto.stock <= 0 ? 0.55 : 1,
            cursor: producto.stock <= 0 ? "not-allowed" : "pointer",
          }}
          disabled={producto.stock <= 0}
        >
          {producto.stock <= 0 ? "Sin stock" : "Agregar al carrito"}
        </button>
      </div>
    </div>
  )
}

function Tag({ text }) {
  if (!text) return null
  return (
    <span
      style={{
        background: "#F1E7DB",
        color: "#4091F2",
        padding: "6px 12px",
        borderRadius: "999px",
        fontWeight: 800,
        fontSize: "12px",
      }}
    >
      {text}
    </span>
  )
}

// ── Estilos ──────────────────────────────────────────────────────────────────

const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #F1E7DB, #AADDE1 55%, #fff)",
  color: "#1f2937",
}

const mainStyle = {
  maxWidth: "1220px",
  margin: "0 auto",
  padding: "48px 24px",
}

const heroStyle = {
  textAlign: "center",
  marginBottom: "44px",
}

const eyebrowStyle = {
  color: "#FE564B",
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: "1.5px",
}

const titleStyle = {
  fontSize: "58px",
  lineHeight: 1.05,
  margin: "8px auto 16px",
  maxWidth: "780px",
  color: "#4091F2",
  fontWeight: 950,
}

const subtitleStyle = {
  fontSize: "19px",
  maxWidth: "680px",
  margin: "0 auto",
  color: "#4b5563",
}

const imageBoxStyle = {
  height: "340px",
  background: "#AADDE1",
  overflow: "hidden",
}

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "top center",
}

const productTitleStyle = {
  margin: 0,
  fontSize: "22px",
  fontWeight: 950,
  color: "#1f2937",
}

const descStyle = {
  color: "#6b7280",
  minHeight: "48px",
}

const tagsStyle = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  marginBottom: "18px",
}

const priceRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: "#374151",
  marginBottom: "18px",
}

const addBtnStyle = {
  width: "100%",
  background: "linear-gradient(135deg, #4091F2, #2563eb)",
  color: "#fff",
  border: "none",
  borderRadius: "16px",
  padding: "14px 18px",
  fontSize: "15px",
  fontWeight: 900,
  cursor: "pointer",
}

const cartItemStyle = {
  display: "grid",
  gap: "10px",
  borderBottom: "1px solid rgba(148,163,184,0.25)",
  paddingBottom: "12px",
}

const qtyStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
}

const removeBtnStyle = {
  background: "rgba(254,86,75,0.12)",
  border: "1px solid rgba(254,86,75,0.25)",
  color: "#FE564B",
  borderRadius: "12px",
  padding: "8px 10px",
  cursor: "pointer",
  fontWeight: 800,
}

const totalBoxStyle = {
  marginTop: "18px",
  display: "flex",
  justifyContent: "space-between",
  fontSize: "22px",
  color: "#1f2937",
}

const emptyStyle = {
  background: "rgba(255,255,255,0.75)",
  border: "1px solid rgba(64,145,242,0.18)",
  borderRadius: "24px",
  padding: "30px",
  textAlign: "center",
  color: "#6b7280",
}

export default CatalogoPage
