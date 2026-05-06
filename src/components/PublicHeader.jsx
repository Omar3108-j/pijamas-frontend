import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function PublicHeader({ carrito: carritoProp = null }) {
  const navigate = useNavigate()
  const [carrito, setCarrito] = useState([])
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (carritoProp) {
      setCarrito(carritoProp)
    } else {
      const guardado = localStorage.getItem("carrito_caylu")
      setCarrito(guardado ? JSON.parse(guardado) : [])
    }
  }, [carritoProp])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  const total = carrito.reduce(
    (sum, item) => sum + Number(item.precio) * item.cantidad,
    0
  )

  const irA = (ruta) => {
    setMenuOpen(false)
    navigate(ruta)
  }

  return (
    <>
      <header className="public-header">
        <div className="public-header__inner">
          <div className="public-header__brand" onClick={() => irA("/")}>
            <div className="public-header__logo">Caylu</div>
            <div className="public-header__sublogo">Pijamas</div>
          </div>

          <nav className="public-header__nav">
            <button onClick={() => irA("/")} className="public-header__nav-btn">
              Inicio
            </button>

            <button onClick={() => irA("/catalogo")} className="public-header__nav-btn">
              Catálogo
            </button>

            <button onClick={() => irA("/login")} className="public-header__admin-btn">
              Admin
            </button>
          </nav>

          <div className="public-header__actions">
            <button
              className="public-header__cart"
              onClick={() => irA("/checkout")}
              type="button"
            >
              🛒 {carrito.length} · S/ {total.toFixed(2)}
            </button>

            <button
              className={`public-header__burger ${menuOpen ? "is-open" : ""}`}
              onClick={() => setMenuOpen((prev) => !prev)}
              type="button"
              aria-label="Abrir menú"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)} />
      )}

      <aside className={`mobile-menu ${menuOpen ? "is-open" : ""}`}>
        <div className="mobile-menu__head">
          <div>
            <strong>Caylu</strong>
            <span>Pijamas</span>
          </div>

          <button onClick={() => setMenuOpen(false)} type="button">
            ×
          </button>
        </div>

        <div className="mobile-menu__cart">
          <span>Tu carrito</span>
          <strong>🛒 {carrito.length} producto(s)</strong>
          <small>Total: S/ {total.toFixed(2)}</small>
        </div>

        <nav className="mobile-menu__nav">
          <button onClick={() => irA("/")}>Inicio</button>
          <button onClick={() => irA("/catalogo")}>Catálogo</button>
          <button onClick={() => irA("/login")}>Admin</button>
        </nav>

        <button className="mobile-menu__checkout" onClick={() => irA("/checkout")}>
          Continuar pedido
        </button>
      </aside>
    </>
  )
}

export default PublicHeader