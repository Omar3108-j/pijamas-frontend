import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import LoginPage from "./pages/LoginPage"
import PedidosPage from "./pages/PedidosPage"
import CatalogoPage from "./pages/CatalogoPage"
import CheckoutPage from "./pages/CheckoutPage"
import PedidoConfirmadoPage from "./pages/PedidoConfirmadoPage"
import HomePage from "./pages/HomePage"
import AdminProductosPage from "./pages/AdminProductosPage"
import AdminDashboardPage from "./pages/AdminDashboardPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalogo" element={<CatalogoPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/pedido-confirmado" element={<PedidoConfirmadoPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin"element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>}/>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
