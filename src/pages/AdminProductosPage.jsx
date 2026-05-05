import { useEffect, useState } from "react"
import api from "../services/api"

const productoInicial = {
  nombre: "",
  descripcion: "",
  precio: "",
  imagen: "",
  categoria: "",
  talla: "",
  color: "",
  stock: "",
  activo: true,
}

function AdminProductosPage() {
  const [productos, setProductos] = useState([])
  const [form, setForm] = useState(productoInicial)
  const [editandoId, setEditandoId] = useState(null)
  const [subiendoImagen, setSubiendoImagen] = useState(false)
  const [busqueda, setBusqueda] = useState("")
  const [productoDetalle, setProductoDetalle] = useState(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  const productosFiltrados = productos.filter((p) => {
    const texto = `${p.nombre} ${p.descripcion} ${p.categoria} ${p.talla} ${p.color}`.toLowerCase()
    return texto.includes(busqueda.toLowerCase())
  })

  const cargarProductos = async () => {
    const res = await api.get("/productos")
    setProductos(res.data)
  }

  useEffect(() => {
    cargarProductos()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === "checkbox" ? checked : value })
  }

  const guardarProducto = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      precio: Number(form.precio),
      stock: Number(form.stock),
    }
    if (editandoId) {
      await api.put(`/productos/${editandoId}`, payload)
    } else {
      await api.post("/productos", payload)
    }
    setForm(productoInicial)
    setEditandoId(null)
    setMostrarFormulario(false)
    cargarProductos()
  }

  const editarProducto = (producto) => {
    setEditandoId(producto.id)
    setProductoDetalle(null)
    setForm({
      nombre: producto.nombre || "",
      descripcion: producto.descripcion || "",
      precio: producto.precio || "",
      imagen: producto.imagen || "",
      categoria: producto.categoria || "",
      talla: producto.talla || "",
      color: producto.color || "",
      stock: producto.stock || "",
      activo: producto.activo,
    })
    setMostrarFormulario(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const eliminarProducto = async (id) => {
    const confirmar = window.confirm("¿Seguro que deseas eliminar este producto?")
    if (!confirmar) return
    await api.delete(`/productos/${id}`)
    cargarProductos()
  }

  const cancelarEdicion = () => {
    setForm(productoInicial)
    setEditandoId(null)
    setMostrarFormulario(false)
  }

  const subirImagen = async (file) => {
    try {
      setSubiendoImagen(true)
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", "pijamas")
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dztp4mm67/image/upload",
        { method: "POST", body: formData }
      )
      const data = await res.json()
      if (!data.secure_url) {
        alert(data?.error?.message || "No se pudo obtener la URL de la imagen")
        return
      }
      setForm((prev) => ({ ...prev, imagen: data.secure_url }))
    } catch (error) {
      console.error("Error subiendo imagen", error)
      alert("Error subiendo imagen")
    } finally {
      setSubiendoImagen(false)
    }
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>

        {/* ── Header ── */}
        <div style={headerStyle}>
          <div>
            <h1 style={titleStyle}>Gestión de productos</h1>
            <p style={subtitleStyle}>Crea, edita y administra los productos del catálogo.</p>
          </div>
          <button
            onClick={() => {
              setForm(productoInicial)
              setEditandoId(null)
              setMostrarFormulario(true)
            }}
            style={primaryBtn}
          >
            + Agregar producto
          </button>
        </div>

        {/* ── Modal formulario ── */}
        {mostrarFormulario && (
          <div style={modalOverlayStyle} onClick={cancelarEdicion}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>

              <button onClick={cancelarEdicion} style={modalCloseBtn}>×</button>

              <h2 style={{ marginTop: 0 }}>
                {editandoId ? "Editar producto" : "Nuevo producto"}
              </h2>

              {/* ✅ Todo el formulario está dentro del modal */}
              <form onSubmit={guardarProducto}>
                <div style={formGridStyle}>
                  <Input label="Nombre"    name="nombre"    value={form.nombre}    onChange={handleChange} required />
                  <Input label="Precio"    name="precio"    type="number" step="0.01" value={form.precio}    onChange={handleChange} required />
                  <Input label="Categoría" name="categoria" value={form.categoria} onChange={handleChange} />
                  <Input label="Talla"     name="talla"     value={form.talla}     onChange={handleChange} />
                  <Input label="Color"     name="color"     value={form.color}     onChange={handleChange} />
                  <Input label="Stock"     name="stock"     type="number" value={form.stock}     onChange={handleChange} required />

                  {/* Imagen — ocupa columna completa */}
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Imagen</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0]
                        if (file) subirImagen(file)
                      }}
                      style={inputStyle}
                    />
                    {subiendoImagen && (
                      <p style={{ color: "#93c5fd", marginTop: "6px" }}>Subiendo imagen...</p>
                    )}
                    {form.imagen && (
                      <img
                        src={form.imagen}
                        alt="preview"
                        style={{
                          marginTop: "10px",
                          width: "120px",
                          height: "120px",
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                      />
                    )}
                  </div>

                  {/* Descripción — ocupa columna completa */}
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Descripción</label>
                    <textarea
                      name="descripcion"
                      value={form.descripcion}
                      onChange={handleChange}
                      style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }}
                    />
                  </div>
                </div>

                {/* Checkbox + botones */}
                <div style={{ marginTop: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                  <label style={checkStyle}>
                    <input
                      type="checkbox"
                      name="activo"
                      checked={form.activo}
                      onChange={handleChange}
                    />
                    Producto activo
                  </label>

                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button type="button" onClick={cancelarEdicion} style={secondaryBtn}>
                      Cancelar
                    </button>
                    <button type="submit" style={primaryBtn}>
                      {editandoId ? "Actualizar producto" : "Guardar producto"}
                    </button>
                  </div>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* ── Buscador ── */}
        <div style={searchBoxStyle}>
          <input
            type="text"
            placeholder="Buscar producto por nombre, categoría, talla o color..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* ── Lista de productos ── */}
        <section style={listStyle}>
          {productosFiltrados.map((p) => (
            <div
              key={p.id}
              style={{ ...productRowStyle, cursor: "pointer" }}
              onClick={() => setProductoDetalle(p)}
            >
              <img
                src={p.imagen || "https://via.placeholder.com/120x120?text=Caylu"}
                alt={p.nombre}
                style={imgStyle}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 6px" }}>{p.nombre}</h3>
                <p style={{ margin: 0, color: "#6b7280" }}>{p.descripcion}</p>
                <p style={{ margin: "8px 0 0", fontWeight: 800 }}>
                  S/ {p.precio} · Stock: {p.stock} · {p.activo ? "Activo" : "Inactivo"}
                </p>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button
                  onClick={(e) => { e.stopPropagation(); editarProducto(p) }}
                  style={secondaryBtn}
                >
                  Editar
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); eliminarProducto(p.id) }}
                  style={dangerBtn}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* ── Modal detalle producto ── */}
        {productoDetalle && (
          <div style={modalOverlayStyle} onClick={() => setProductoDetalle(null)}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setProductoDetalle(null)} style={modalCloseBtn}>×</button>

              <img
                src={productoDetalle.imagen || "https://via.placeholder.com/400x400?text=Caylu"}
                alt={productoDetalle.nombre}
                style={modalImgStyle}
              />

              <h2 style={{ marginBottom: "8px" }}>{productoDetalle.nombre}</h2>
              <p style={{ color: "#94a3b8" }}>{productoDetalle.descripcion || "Sin descripción"}</p>

              <div style={modalInfoGrid}>
                <InfoDetalle label="Precio"    value={`S/ ${productoDetalle.precio}`} />
                <InfoDetalle label="Stock"     value={productoDetalle.stock} />
                <InfoDetalle label="Categoría" value={productoDetalle.categoria || "-"} />
                <InfoDetalle label="Talla"     value={productoDetalle.talla || "-"} />
                <InfoDetalle label="Color"     value={productoDetalle.color || "-"} />
                <InfoDetalle label="Estado"    value={productoDetalle.activo ? "Activo" : "Inactivo"} />
              </div>
            </div>
          </div>
        )}

      </div>
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

function InfoDetalle({ label, value }) {
  return (
    <div style={modalInfoBox}>
      <span style={{ color: "#94a3b8", fontSize: "13px" }}>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

// ── Estilos ──────────────────────────────────────────────────────────────────

const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #020617, #0f172a 55%, #111827)",
  color: "#f8fafc",
  padding: "36px 20px",
}

const containerStyle = {
  maxWidth: "1150px",
  margin: "0 auto",
}

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "20px",
  flexWrap: "wrap",
  marginBottom: "24px",
}

const titleStyle = {
  margin: "0 0 8px",
  fontSize: "48px",
  fontWeight: 900,
}

const subtitleStyle = {
  color: "#94a3b8",
  margin: 0,
}

const formGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "16px",
}

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  color: "#cbd5e1",
  fontWeight: 800,
}

const inputStyle = {
  width: "100%",
  background: "rgba(2, 6, 23, 0.75)",
  color: "#f8fafc",
  border: "1px solid rgba(148, 163, 184, 0.18)",
  borderRadius: "14px",
  padding: "13px 14px",
  outline: "none",
  boxSizing: "border-box",
}

const checkStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  color: "#cbd5e1",
  fontWeight: 800,
  cursor: "pointer",
}

const listStyle = {
  display: "grid",
  gap: "14px",
}

const productRowStyle = {
  display: "flex",
  gap: "16px",
  alignItems: "center",
  background: "rgba(15, 23, 42, 0.75)",
  border: "1px solid rgba(148, 163, 184, 0.16)",
  borderRadius: "22px",
  padding: "16px",
}

const imgStyle = {
  width: "110px",
  height: "110px",
  objectFit: "cover",
  objectPosition: "top center",
  borderRadius: "16px",
  background: "#AADDE1",
  flexShrink: 0,
}

const primaryBtn = {
  background: "linear-gradient(135deg, #2563eb, #3b82f6)",
  color: "#fff",
  border: "none",
  borderRadius: "14px",
  padding: "12px 20px",
  fontWeight: 900,
  cursor: "pointer",
  fontSize: "15px",
}

const secondaryBtn = {
  background: "rgba(59, 130, 246, 0.14)",
  color: "#93c5fd",
  border: "1px solid rgba(59, 130, 246, 0.25)",
  borderRadius: "14px",
  padding: "12px 16px",
  fontWeight: 900,
  cursor: "pointer",
}

const dangerBtn = {
  background: "rgba(239, 68, 68, 0.14)",
  color: "#fca5a5",
  border: "1px solid rgba(239, 68, 68, 0.25)",
  borderRadius: "14px",
  padding: "12px 16px",
  fontWeight: 900,
  cursor: "pointer",
}

const searchBoxStyle = {
  background: "rgba(15, 23, 42, 0.75)",
  border: "1px solid rgba(148, 163, 184, 0.16)",
  borderRadius: "22px",
  padding: "16px",
  marginBottom: "18px",
}

const modalOverlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(2, 6, 23, 0.78)",
  backdropFilter: "blur(8px)",
  display: "grid",
  placeItems: "center",
  zIndex: 200,
  padding: "20px",
}

const modalStyle = {
  position: "relative",
  width: "100%",
  maxWidth: "680px",
  maxHeight: "90vh",
  overflowY: "auto",
  background: "#0f172a",
  border: "1px solid rgba(148, 163, 184, 0.18)",
  borderRadius: "28px",
  padding: "26px",
  color: "#f8fafc",
  boxShadow: "0 30px 70px rgba(0,0,0,0.35)",
}

const modalCloseBtn = {
  position: "absolute",
  top: "14px",
  right: "14px",
  width: "38px",
  height: "38px",
  borderRadius: "50%",
  border: "1px solid rgba(148, 163, 184, 0.25)",
  background: "rgba(15, 23, 42, 0.9)",
  color: "#fff",
  fontSize: "24px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}

const modalImgStyle = {
  width: "100%",
  height: "320px",
  objectFit: "contain",
  borderRadius: "22px",
  background: "#ffffff",
  marginBottom: "18px",
}

const modalInfoGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: "12px",
  marginTop: "18px",
}

const modalInfoBox = {
  background: "rgba(2, 6, 23, 0.65)",
  border: "1px solid rgba(148, 163, 184, 0.14)",
  borderRadius: "16px",
  padding: "14px",
  display: "grid",
  gap: "6px",
}

export default AdminProductosPage