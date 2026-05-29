import { useMemo, useRef, useState } from "react"

import Cart from "./components/Cart"
import ProductCard from "./components/ProductCard"
import { categorias, productos } from "./data/productos"
import heroImg from "./assets/placeres-hero.png"

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
    const availableCategories = new Set(productos.map((producto) => producto.categoria))
    return categorias.filter((categoria) => availableCategories.has(categoria.nombre))
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
    <div className="min-h-screen bg-[#12080b] text-white">
      <div className="max-w-7xl mx-auto">
        <header className="relative overflow-hidden rounded-b-[2rem] border-x border-b border-[#d6b36a]/20 bg-[#1a0d12] px-5 pb-10 pt-16 text-center shadow-2xl shadow-black/40 sm:px-8 sm:pt-8">
          <img
            src={heroImg}
            alt="Vinos, fiambres y productos gourmet de Placeres Envasados"
            className="absolute inset-0 h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#12080b]/30 via-[#12080b]/75 to-[#12080b]" />
          <button
            type="button"
            onClick={handleShare}
            aria-label="Compartir este menú"
            className="absolute right-5 top-5 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d6b36a]/30 bg-black/45 text-[#f7ead2] shadow-lg backdrop-blur transition duration-150 hover:border-[#d6b36a] hover:bg-black/65 active:scale-90 active:bg-[#7b1f35] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d6b36a]"
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
          <div className="relative z-10 inline-flex max-w-3xl flex-col items-center gap-4">
            <p className="rounded-full border border-[#d6b36a]/30 bg-black/35 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#d6b36a]">
              Vinos, fiambres, picadas y productos gourmet
            </p>
            <h1 className="text-4xl font-bold text-white sm:text-6xl">
              Placeres Envasados
            </h1>
            <p className="max-w-2xl text-lg text-[#f7ead2]">
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
                    className="group relative min-h-44 overflow-hidden rounded-2xl border border-[#d6b36a]/20 bg-[#211016] p-5 text-left shadow-lg transition duration-150 hover:-translate-y-1 hover:border-[#d6b36a] hover:bg-[#2b121b] active:translate-y-0 active:scale-[0.97]"
                  >
                    <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#7b1f35]/40 blur-2xl" />
                    <div className="relative">
                      <span className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[#d6b36a]/20 bg-black/25 text-3xl">
                        {categoria.icono}
                      </span>
                      <h2 className="text-xl font-bold text-white">
                        {categoria.nombre}
                      </h2>
                      <p className="mt-2 text-sm text-[#d8c7aa]">{categoria.descripcion}</p>
                      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#d6b36a]">
                        {productCount} productos
                      </p>
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
                  className="rounded-full border border-[#d6b36a]/20 bg-[#211016] px-4 py-2 text-sm font-semibold text-[#f7ead2] transition duration-150 hover:border-[#d6b36a] hover:bg-[#2b121b] active:scale-95"
                >
                  ← Volver a categorías
                </button>
                <h2 className="text-3xl font-bold text-white">{selectedCategory}</h2>
              </div>
              <p className="max-w-2xl text-[#d8c7aa]">
                Elegí tus productos favoritos y sumalos al carrito.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_0.9fr]">
          <div>
            {selectedCategory ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((producto) => (
                  <ProductCard
                    key={producto.id}
                    producto={producto}
                    categoria={categorias.find((item) => item.nombre === producto.categoria)}
                    onAdd={() => addToCart(producto)}
                    wasJustAdded={recentlyAddedProductId === producto.id}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#d6b36a]/20 bg-[#180b10]/80 p-12 text-center text-[#d8c7aa]">
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
            className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-3 rounded-full bg-[#7b1f35] px-4 py-3 text-sm font-semibold text-white shadow-2xl transition duration-150 hover:bg-[#96304a] active:scale-95"
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
