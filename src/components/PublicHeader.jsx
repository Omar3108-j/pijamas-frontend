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
      <style>{`
        .caylu-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(64,145,242,0.12);
        }

        .caylu-header__inner {
          max-width: 1180px;
          margin: 0 auto;
          padding: 18px 24px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 18px;
        }

        .caylu-brand {
          cursor: pointer;
          width: fit-content;
          line-height: 0.9;
        }

        .caylu-brand__logo {
          color: #4091F2;
          font-size: 34px;
          font-weight: 950;
        }

        .caylu-brand__sub {
          color: #F4B740;
          font-size: 17px;
          font-weight: 950;
        }

        .caylu-nav {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .caylu-nav button {
          border: none;
          background: transparent;
          color: #1f2937;
          font-weight: 950;
          font-size: 15px;
          cursor: pointer;
        }

        .caylu-admin {
          background: #edf6ff !important;
          color: #4091F2 !important;
          border: 1px solid rgba(64,145,242,0.20) !important;
          border-radius: 999px;
          padding: 12px 22px;
        }

        .caylu-actions {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 12px;
        }

        .caylu-cart {
          border: none;
          background: linear-gradient(135deg, #4091F2, #2563eb);
          color: #fff;
          border-radius: 999px;
          padding: 13px 24px;
          font-weight: 950;
          cursor: pointer;
          box-shadow: 0 12px 28px rgba(64,145,242,0.22);
          white-space: nowrap;
        }

        .caylu-burger {
          display: none;
          width: 48px;
          height: 48px;
          border: 1px solid rgba(64,145,242,0.22);
          border-radius: 16px;
          background: #fff;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 5px;
        }

        .caylu-burger span {
          width: 20px;
          height: 2px;
          background: #1f2937;
          border-radius: 999px;
        }

        .caylu-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15,23,42,0.50);
          backdrop-filter: blur(5px);
          z-index: 2000;
        }

        .caylu-drawer {
          position: fixed;
          top: 0;
          right: 0;
          width: min(360px, 88vw);
          height: 100vh;
          background: #fff;
          z-index: 2001;
          padding: 24px;
          box-shadow: -24px 0 60px rgba(15,23,42,0.24);
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .caylu-drawer__head {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .caylu-drawer__brand strong {
          display: block;
          color: #4091F2;
          font-size: 32px;
          font-weight: 950;
          line-height: 0.9;
        }

        .caylu-drawer__brand span {
          display: block;
          color: #F4B740;
          font-size: 18px;
          font-weight: 950;
        }

        .caylu-close {
          width: 42px;
          height: 42px;
          border: none;
          border-radius: 14px;
          background: #f1f5f9;
          color: #1f2937;
          font-size: 28px;
          cursor: pointer;
        }

        .caylu-drawer__cart {
          background: linear-gradient(135deg, #4091F2, #2563eb);
          color: #fff;
          border-radius: 24px;
          padding: 18px;
          display: grid;
          gap: 6px;
        }

        .caylu-drawer__cart span {
          font-size: 13px;
          font-weight: 800;
          opacity: 0.85;
        }

        .caylu-drawer__cart strong {
          font-size: 20px;
        }

        .caylu-drawer__nav {
          display: grid;
          gap: 10px;
        }

        .caylu-drawer__nav button {
          width: 100%;
          border: 1px solid rgba(64,145,242,0.16);
          background: #f8fafc;
          color: #1f2937;
          border-radius: 18px;
          padding: 16px;
          text-align: left;
          font-weight: 950;
          font-size: 16px;
          cursor: pointer;
        }

        .caylu-checkout {
          margin-top: auto;
          border: none;
          border-radius: 20px;
          padding: 17px;
          background: linear-gradient(135deg, #FE564B, #f97316);
          color: #fff;
          font-weight: 950;
          font-size: 16px;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .caylu-header__inner {
            display: flex;
            justify-content: space-between;
            padding: 16px;
          }

          .caylu-nav {
            display: none;
          }

          .caylu-burger {
            display: flex;
          }

          .caylu-cart {
            width: 48px;
            height: 48px;
            padding: 0;
            font-size: 0;
          }

          .caylu-cart::before {
            content: "🛒";
            font-size: 20px;
          }

          .caylu-brand__logo {
            font-size: 34px;
          }

          .caylu-brand__sub {
            font-size: 17px;
          }
        }
      `}</style>

      <header className="caylu-header">
        <div className="caylu-header__inner">
          <div className="caylu-brand" onClick={() => irA("/")}>
            <div className="caylu-brand__logo">Caylu</div>
            <div className="caylu-brand__sub">Pijamas</div>
          </div>

          <nav className="caylu-nav">
            <button onClick={() => irA("/")}>Inicio</button>
            <button onClick={() => irA("/catalogo")}>Catálogo</button>
            <button className="caylu-admin" onClick={() => irA("/login")}>
              Admin
            </button>
          </nav>

          <div className="caylu-actions">
            <button className="caylu-cart" onClick={() => irA("/checkout")}>
              🛒 {carrito.length} · S/ {total.toFixed(2)}
            </button>

            <button
              className="caylu-burger"
              onClick={() => setMenuOpen(true)}
              type="button"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <>
          <div className="caylu-overlay" onClick={() => setMenuOpen(false)} />

          <aside className="caylu-drawer">
            <div className="caylu-drawer__head">
              <div className="caylu-drawer__brand">
                <strong>Caylu</strong>
                <span>Pijamas</span>
              </div>

              <button className="caylu-close" onClick={() => setMenuOpen(false)}>
                ×
              </button>
            </div>

            <div className="caylu-drawer__cart">
              <span>Tu carrito</span>
              <strong>🛒 {carrito.length} producto(s)</strong>
              <small>Total: S/ {total.toFixed(2)}</small>
            </div>

            <nav className="caylu-drawer__nav">
              <button onClick={() => irA("/")}>Inicio</button>
              <button onClick={() => irA("/catalogo")}>Catálogo</button>
              <button onClick={() => irA("/login")}>Admin</button>
            </nav>

            <button className="caylu-checkout" onClick={() => irA("/checkout")}>
              Continuar pedido
            </button>
          </aside>
        </>
      )}
    </>
  )
}

export default PublicHeader