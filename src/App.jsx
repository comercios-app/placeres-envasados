import { useMemo, useRef, useState } from "react"

import Cart from "./components/Cart"
import ProductCard from "./components/ProductCard"
import { productos } from "./data/productos"

function App() {
  const [cart, setCart] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [showCartNotifier, setShowCartNotifier] = useState(false)
  const cartRef = useRef(null)
  const notificationTimeoutRef = useRef(null)

  const categorias = useMemo(() => [
    "Todos",
    ...Array.from(new Set(productos.map((producto) => producto.categoria)))
  ], [])

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "Todos") return productos
    return productos.filter((producto) => producto.categoria === selectedCategory)
  }, [selectedCategory])

  const addToCart = (producto) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === producto.id)
      if (!existing) {
        return [...prev, { ...producto, cantidad: 1 }]
      }
      return prev.map((item) =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    })

    setShowCartNotifier(true)
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current)
    }
    notificationTimeoutRef.current = setTimeout(() => {
      setShowCartNotifier(false)
    }, 3000)
  }

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, cantidad: Math.max(1, item.cantidad + delta) }
            : item
        )
        .filter((item) => item.cantidad > 0)
    )
  }

  const clearCart = () => setCart([])

  const total = cart.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  )

  const handleScrollToCart = () => {
    if (cartRef.current) {
      cartRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
      setShowCartNotifier(false)
    }
  }

  const handleSendWhatsApp = () => {
    if (cart.length === 0) return

    const message = [
      "Hola! Quisiera hacer un pedido:",
      ...cart.map(
        (item) => `${item.cantidad} x ${item.nombre} - $${item.precio * item.cantidad}`
      ),
      `Total: $${total}`,
      "Gracias!"
    ].join("\n")

    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-zinc-900 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <div className="inline-flex flex-col items-center gap-3">
            <h1 className="text-4xl font-bold text-white">
              Doña Carmen
            </h1>
            <p className="text-zinc-300 max-w-xl">
              Pedidos rápidos y caseros para disfrutar lo mejor de la cocina de Doña Carmen, directo a tu mesa con WhatsApp.
            </p>
          </div>
        </header>

        <div className="mb-8 flex flex-wrap gap-3 justify-center">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              type="button"
              onClick={() => setSelectedCategory(categoria)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                selectedCategory === categoria
                  ? "bg-orange-500 text-white"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {categoria}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_0.9fr] gap-6">
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((producto) => (
                <ProductCard
                  key={producto.id}
                  producto={producto}
                  onAdd={() => addToCart(producto)}
                />
              ))}
            </div>
          </div>

          <div ref={cartRef}>
            <Cart
              cartItems={cart}
              onRemove={removeFromCart}
              onUpdateQuantity={updateQuantity}
              onClear={clearCart}
              total={total}
              onSendWhatsApp={handleSendWhatsApp}
            />
          </div>
        </div>
        {showCartNotifier && (
          <button
            type="button"
            onClick={handleScrollToCart}
            className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-3 rounded-full bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-2xl transition hover:bg-orange-600"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg">
              🛒
            </span>
            <span className="whitespace-nowrap">Agregado al carrito. Ver resumen ↓</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default App