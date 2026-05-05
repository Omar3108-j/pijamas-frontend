import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function PublicHeader({ carrito: carritoProp = null }) {
  const navigate = useNavigate()
  const [carrito, setCarrito] = useState([])

  useEffect(() => {
    if (carritoProp) {
      setCarrito(carritoProp)
    } else {
      const guardado = localStorage.getItem("carrito_caylu")
      setCarrito(guardado ? JSON.parse(guardado) : [])
    }
  }, [carritoProp])

  const total = carrito.reduce(
    (sum, item) => sum + Number(item.precio) * item.cantidad,
    0
  )

  return (
    <header className="public-header">
      <div className="public-header__inner">
        <div
          className="public-header__brand"
          onClick={() => navigate("/")}
        >
          <div className="public-header__logo">Caylu</div>
          <div className="public-header__sublogo">Pijamas</div>
        </div>

        <nav className="public-header__nav">
          <button onClick={() => navigate("/")} className="public-header__nav-btn">
            Inicio
          </button>

          <button
            onClick={() => navigate("/catalogo")}
            className="public-header__nav-btn"
          >
            Catálogo
          </button>

          <button
            onClick={() => navigate("/login")}
            className="public-header__admin-btn"
          >
            Admin
          </button>

          <div className="public-header__cart">
            🛒 {carrito.length} · S/ {total.toFixed(2)}
          </div>
        </nav>
      </div>
    </header>
  )
}

export default PublicHeader