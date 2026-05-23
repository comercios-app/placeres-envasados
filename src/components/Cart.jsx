function Cart({ cartItems, onRemove, onUpdateQuantity, onClear, total, onSendWhatsApp }) {
  return (
    <div className="bg-zinc-800 rounded-3xl p-6 shadow-xl border border-zinc-700 sticky top-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-orange-400">Tu carrito</p>
          <h2 className="text-2xl font-bold text-white">Resumen</h2>
        </div>
        <button
          onClick={onClear}
          className="text-xs text-zinc-300 hover:text-white transition"
          type="button"
        >
          Limpiar
        </button>
      </div>

      {cartItems.length === 0 ? (
        <p className="text-zinc-300">No agregaste productos aún.</p>
      ) : (
        <div className="space-y-4 mb-6">
          {cartItems.map((item) => (
            <div key={item.id} className="rounded-3xl bg-zinc-900 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div>
                  <h3 className="font-semibold text-white">{item.nombre}</h3>
                  <p className="text-sm text-zinc-400">{item.categoria}</p>
                  <p className="mt-2 text-orange-400 font-semibold">${item.precio} x {item.cantidad}</p>
                </div>

                <div className="ml-auto flex flex-col items-end gap-3">
                  <div className="inline-flex items-center rounded-full bg-zinc-800 border border-zinc-700">
                    <button
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      type="button"
                      className="px-3 py-2 text-white hover:bg-zinc-700 transition"
                    >
                      −
                    </button>
                    <span className="px-4 text-white font-semibold">{item.cantidad}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      type="button"
                      className="px-3 py-2 text-white hover:bg-zinc-700 transition"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-white font-semibold">${item.precio * item.cantidad}</p>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="mt-3 text-xs uppercase tracking-[0.2em] text-red-400 hover:text-red-300"
                      type="button"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-zinc-700 pt-4">
        <div className="flex items-center justify-between text-zinc-200 mb-4">
          <span>Total</span>
          <span className="text-xl font-bold text-white">${total}</span>
        </div>
        <button
          onClick={onSendWhatsApp}
          disabled={cartItems.length === 0}
          className="w-full inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-3xl font-semibold transition disabled:cursor-not-allowed disabled:bg-zinc-600"
          type="button"
        >
          Enviar por WhatsApp
        </button>
      </div>
    </div>
  )
}

export default Cart;
