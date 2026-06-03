import { useMemo, useRef, useState } from "react"

import Cart from "./components/Cart"
import ProductCard from "./components/ProductCard"
import { categorias, productos } from "./data/productos"
import logoImg from "./assets/placeres-logo.jpeg"

// const WHATSAPP_NUMBER = "5493513200735" // Activar al publicar la recepción de pedidos.

const formatPrice = (value) => new Intl.NumberFormat("es-AR").format(value)

function App() {
  const [cart, setCart] = useState([])
  const [customerName, setCustomerName] = useState("")
  const [orderNotes, setOrderNotes] = useState("")
  const [deliveryMethod, setDeliveryMethod] = useState("Retiro en el local")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("Efectivo")
  const [cashAmount, setCashAmount] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showCartNotifier, setShowCartNotifier] = useState(false)
  const [recentlyAddedProductId, setRecentlyAddedProductId] = useState(null)
  const [shareFeedback, setShareFeedback] = useState("")
  const cartRef = useRef(null)
  const notificationTimeoutRef = useRef(null)
  const addedFeedbackTimeoutRef = useRef(null)
  const shareFeedbackTimeoutRef = useRef(null)

  const categoriasMenu = useMemo(() => {
    return categorias
  }, [])

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return []
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

    setRecentlyAddedProductId(producto.id)
    if (addedFeedbackTimeoutRef.current) {
      clearTimeout(addedFeedbackTimeoutRef.current)
    }
    addedFeedbackTimeoutRef.current = setTimeout(() => {
      setRecentlyAddedProductId(null)
    }, 1400)

    setShowCartNotifier(true)
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current)
    }
    notificationTimeoutRef.current = setTimeout(() => {
      setShowCartNotifier(false)
    }, 3000)
  }

  const handleCategorySelect = (categoria) => {
    setSelectedCategory(categoria)
    setShowCartNotifier(false)
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

  const clearCart = () => {
    setCart([])
    setCustomerName("")
    setOrderNotes("")
    setDeliveryMethod("Retiro en el local")
    setDeliveryAddress("")
    setPaymentMethod("Efectivo")
    setCashAmount("")
    setRecentlyAddedProductId(null)
  }

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

    const name = customerName.trim()
    const notes = orderNotes.trim()
    const address = deliveryAddress.trim()
    const cashPayment = cashAmount.trim()
    const isDelivery = deliveryMethod === "Envío a domicilio"

    if (!name || (isDelivery && !address)) return

    const message = [
      "Hola, quiero realizar el siguiente pedido:",
      "",
      `Nombre: ${name}`,
      "",
      ...cart.map(
        (item) => `* ${item.nombre} x ${item.cantidad}`
      ),
      "",
      `Entrega: ${deliveryMethod}`,
      ...(isDelivery ? [`Dirección: ${address}`, "Costo de envío: a confirmar"] : []),
      `Forma de pago: ${paymentMethod}`,
      ...(paymentMethod === "Efectivo" && cashPayment ? [`Abono con: $${cashPayment}`] : []),
      ...(notes ? [`Aclaraciones: ${notes}`] : []),
      "",
      `Total: $${formatPrice(total)}`,
      "",
      "Muchas gracias."
    ].join("\n")

    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank")
  }

  const showShareFeedback = (message) => {
    setShareFeedback(message)
    if (shareFeedbackTimeoutRef.current) {
      clearTimeout(shareFeedbackTimeoutRef.current)
    }
    shareFeedbackTimeoutRef.current = setTimeout(() => {
      setShareFeedback("")
    }, 2500)
  }

  const handleShare = async () => {
    const shareData = {
      title: "Placeres Envasados",
      text: "Vinos, fiambres, picadas y productos gourmet",
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        if (error.name !== "AbortError") {
          showShareFeedback("No se pudo compartir el enlace")
        }
      }
      return
    }

    try {
      await navigator.clipboard.writeText(shareData.url)
      showShareFeedback("Enlace copiado")
    } catch {
      showShareFeedback("No se pudo copiar el enlace")
    }
  }

  return (
    <div className="min-h-screen bg-[#fff7ed] text-[#2f2218]">
      <div className="mx-auto max-w-7xl">
        <header className="relative overflow-hidden rounded-b-3xl border-x border-b border-orange-200 bg-[#fffdf7] px-4 pb-5 pt-12 text-center shadow-xl shadow-orange-900/10 sm:px-8 sm:pb-10 sm:pt-8">
          <button
            type="button"
            onClick={handleShare}
            aria-label="Compartir este menú"
            className="absolute right-5 top-5 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#e7b8ad] bg-white text-[#b53632] shadow-lg transition duration-150 hover:border-[#b53632] hover:bg-[#fff1ee] active:scale-90 active:bg-[#f8ded8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b53632]"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="m8.7 10.7 6.6-4.1M8.7 13.3l6.6 4.1" />
            </svg>
          </button>
          <div className="relative z-10 inline-flex max-w-3xl flex-col items-center gap-2 sm:gap-4">
            <div className="flex max-w-[13.5rem] flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[0.6rem] font-bold uppercase leading-snug tracking-[0.12em] text-[#b53632] sm:max-w-none sm:text-[0.8rem] sm:tracking-[0.16em]">
              <span>BEBIDAS EN GENERAL</span>
              <span className="text-[#d8a69d]">•</span>
              <span>PICADAS y PASTAS POLIDORI</span>
              <span className="text-[#d8a69d]">•</span>
              <span>ALMACEN DE SABORES</span>
            </div>
            <h1 className="sr-only">Placeres Envasados</h1>
            <img
              src={logoImg}
              alt="Placeres Envasados"
              className="h-32 w-32 rounded-full border-4 border-white bg-white object-cover shadow-xl shadow-orange-900/15 sm:h-52 sm:w-52"
            />
            <p className="max-w-2xl text-sm font-medium leading-snug text-[#6b3f24] sm:text-lg">
              Armá tu pedido y envialo por WhatsApp.
            </p>
          </div>
          {shareFeedback && (
            <p
              role="status"
              className="fixed right-6 top-20 z-50 rounded-full bg-zinc-800 px-3 py-2 text-xs font-medium text-white shadow-lg"
            >
              {shareFeedback}
            </p>
          )}
        </header>

        <main className="px-5 py-8 sm:px-6">
        <div className="mb-8">
          {!selectedCategory ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {categoriasMenu.map((categoria) => {
                const productCount = productos.filter(
                  (producto) => producto.categoria === categoria.nombre
                ).length
                return (
                  <button
                    key={categoria.nombre}
                    type="button"
                    onClick={() => handleCategorySelect(categoria.nombre)}
                    className="group relative min-h-56 overflow-hidden rounded-2xl border border-orange-200 bg-white text-left shadow-md shadow-orange-900/10 transition duration-150 hover:-translate-y-1 hover:border-[#b53632] active:translate-y-0 active:scale-[0.97]"
                  >
                    <img
                      src={categoria.imagen}
                      alt={categoria.nombre}
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-orange-200">
                        {productCount} {productCount === 1 ? "producto" : "productos"}
                      </p>
                      <h2 className="text-xl font-bold leading-tight text-white">
                        {categoria.nombre}
                      </h2>
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="mb-8 flex flex-col gap-4 items-center text-center">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className="rounded-full border border-[#e7b8ad] bg-white px-4 py-2 text-sm font-semibold text-[#b53632] shadow-sm transition duration-150 hover:border-[#b53632] hover:bg-[#fff1ee] active:scale-95"
                >
                  ← Volver a categorías
                </button>
                <h2 className="text-3xl font-bold text-[#2f2218]">{selectedCategory}</h2>
              </div>
              <p className="max-w-2xl text-[#7c5b43]">
                Elegí tus productos favoritos y sumalos al carrito.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_0.9fr]">
          <div>
            {selectedCategory ? (
              filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((producto) => (
                    <ProductCard
                      key={producto.id}
                      producto={producto}
                      onAdd={() => addToCart(producto)}
                      wasJustAdded={recentlyAddedProductId === producto.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-orange-300 bg-white p-12 text-center text-[#7c5b43]">
                  Todavía no hay productos cargados en esta categoría.
                </div>
              )
            ) : (
              <div className="rounded-2xl border border-dashed border-orange-300 bg-white p-12 text-center text-[#7c5b43]">
                Seleccioná una categoría para ver sus productos.
              </div>
            )}
          </div>

          <div ref={cartRef}>
            <Cart
              cartItems={cart}
              onRemove={removeFromCart}
              onUpdateQuantity={updateQuantity}
              onClear={clearCart}
              total={total}
              customerName={customerName}
              onCustomerNameChange={setCustomerName}
              orderNotes={orderNotes}
              onOrderNotesChange={setOrderNotes}
              deliveryMethod={deliveryMethod}
              onDeliveryMethodChange={setDeliveryMethod}
              deliveryAddress={deliveryAddress}
              onDeliveryAddressChange={setDeliveryAddress}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              cashAmount={cashAmount}
              onCashAmountChange={setCashAmount}
              onSendWhatsApp={handleSendWhatsApp}
            />
          </div>
        </div>
        {showCartNotifier && (
          <button
            type="button"
            onClick={handleScrollToCart}
            className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-3 rounded-full bg-[#b53632] px-4 py-3 text-sm font-semibold text-white shadow-2xl transition duration-150 hover:bg-[#9f2e2d] active:scale-95"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg">
              🛒
            </span>
            <span className="whitespace-nowrap">Agregado al carrito. Ver resumen ↓</span>
          </button>
        )}
        </main>
      </div>
    </div>
  )
}

export default App
