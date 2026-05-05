function PedidoCard({ pedido, onCambiarEstado }) {
  const estado = getEstado(pedido.estado)

  return (
    <article className="shopify-order-card">
      <div className="shopify-order-card__header">
        <div>
          <span className="shopify-order-card__label">Pedido</span>
          <h2>{pedido.numeroPedido}</h2>
        </div>

        <span className={`shopify-status ${estado.className}`}>
          {estado.label}
        </span>
      </div>

      <div className="shopify-order-card__customer">
        <Info label="Cliente" value={pedido.clienteNombre} />
        <Info label="Teléfono" value={pedido.clienteTelefono} />
        <Info label="Pago" value={pedido.metodoPago} />
        {pedido.metodoPago !== "CONTRA_ENTREGA" && (
        <Info
          label="N° operación"
          value={pedido.numeroOperacion || "Pendiente"}
        />
      )}
        <Info label="Total" value={`S/ ${pedido.total}`} highlight />
      </div>

      <div className="shopify-order-card__address">
        <div>
          <strong>Distrito</strong>
          <span>{pedido.distrito || "-"}</span>
        </div>

        <div>
          <strong>Dirección</strong>
          <span>{pedido.direccion || "-"}</span>
        </div>
      </div>

      <div className="shopify-products">
        <div className="shopify-products__title">
          <span>Productos</span>
          <strong>{pedido.detalles?.length || 0} item(s)</strong>
        </div>

        {pedido.detalles?.map((detalle) => (
          <div key={detalle.id} className="shopify-product-row">
            <div>
              <strong>{detalle.productoNombre}</strong>
              <span>Cantidad: {detalle.cantidad}</span>
            </div>

            <strong>S/ {detalle.subtotal}</strong>
          </div>
        ))}
      </div>

      <div className="shopify-actions">
        <button
          className="shopify-btn shopify-btn--confirmar"
          onClick={() => onCambiarEstado(pedido.id, "CONFIRMADO")}
        >
          Confirmar
        </button>

        <button
          className="shopify-btn shopify-btn--proceso"
          onClick={() => onCambiarEstado(pedido.id, "EN_PROCESO")}
        >
          En proceso
        </button>

        <button
          className="shopify-btn shopify-btn--entregado"
          onClick={() => onCambiarEstado(pedido.id, "ENTREGADO")}
        >
          Entregado
        </button>

        <button
          className="shopify-btn shopify-btn--anular"
          onClick={() => onCambiarEstado(pedido.id, "ANULADO")}
        >
          Anular
        </button>
      </div>
    </article>
  )
}

function Info({ label, value, highlight = false }) {
  return (
    <div className="shopify-info">
      <span>{label}</span>
      <strong className={highlight ? "shopify-info__highlight" : ""}>
        {value}
      </strong>
    </div>
  )
}

function getEstado(estado) {
  switch (estado) {
    case "PENDIENTE":
      return { label: "Pendiente", className: "shopify-status--pendiente" }
    case "CONFIRMADO":
      return { label: "Confirmado", className: "shopify-status--confirmado" }
    case "EN_PROCESO":
      return { label: "En proceso", className: "shopify-status--proceso" }
    case "ENTREGADO":
      return { label: "Entregado", className: "shopify-status--entregado" }
    case "ANULADO":
      return { label: "Anulado", className: "shopify-status--anulado" }
    default:
      return { label: estado, className: "" }
  }
}

export default PedidoCard