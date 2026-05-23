import { useMemo, useState } from "react"

import Cart from "./components/Cart"
import ProductCard from "./components/ProductCard"
import { productos } from "./data/productos"
import sanguchesImg from "./assets/sandwich-miga.webp"

function App() {
  const [cart, setCart] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("Todos")

  const categorias = useMemo(() => [
    "Todos",
    ...Array.from(new Set(productos.map((producto) => producto.categoria)))
  ], [])

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "Todos") return productos
    return productos.filter((producto) => producto.categoria === selectedCategory)
  }, [selectedCategory])

  const featuredCategory = {
    nombre: "Sanguches de Miga",
    categoria: "Sanguches de Miga",
    descripcion: "Mirá todas las variedades de sanguches de miga en un solo lugar.",
    imagen: sanguchesImg,
  }

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
          <p className="text-xs uppercase tracking-[0.4em] text-orange-400 mb-3">
            Solución de pedidos para comercios locales
          </p>
          <div className="inline-flex flex-col items-center gap-3">
            <h1 className="text-4xl font-bold text-white">
              Comercios App
            </h1>
            <p className="text-zinc-300 max-w-xl">
              Plataforma simple y profesional para que tus clientes vean productos, armen su carrito y te envíen pedidos por WhatsApp.
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

        <div className="mb-8 max-w-sm mx-auto lg:mx-0">
          <button
            type="button"
            onClick={() => setSelectedCategory(featuredCategory.categoria)}
            className="group overflow-hidden rounded-3xl border border-zinc-700 bg-zinc-800 hover:border-orange-500 transition w-full"
          >
            <img
              src={featuredCategory.imagen}
              alt={featuredCategory.nombre}
              className="w-full h-44 object-cover opacity-90 group-hover:opacity-100 transition"
            />
            <div className="p-5">
              <span className="text-xs uppercase tracking-[0.3em] text-orange-400">
                {featuredCategory.categoria}
              </span>
              <h2 className="text-2xl font-bold text-white mt-3">
                {featuredCategory.nombre}
              </h2>
              <p className="text-zinc-400 text-sm mt-2">
                {featuredCategory.descripcion}
              </p>
            </div>
          </button>
        </div>

        {selectedCategory !== "Todos" && (
          <div className="mb-4 text-center lg:text-left">
            <button
              type="button"
              onClick={() => setSelectedCategory("Todos")}
              className="rounded-full bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-zinc-700 transition"
            >
              Volver a Todos
            </button>
          </div>
        )}

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
    </div>
  )
}

export default App