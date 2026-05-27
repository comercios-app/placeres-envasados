function Cart({
  cartItems,
  onRemove,
  onUpdateQuantity,
  onClear,
  total,
  orderNotes,
  onOrderNotesChange,
  deliveryMethod,
  onDeliveryMethodChange,
  deliveryAddress,
  onDeliveryAddressChange,
  paymentMethod,
  onPaymentMethodChange,
  cashAmount,
  onCashAmountChange,
  onSendWhatsApp,
}) {
  const requiresAddress = deliveryMethod === "Envío a domicilio"
  const missingAddress = requiresAddress && !deliveryAddress.trim()

  return (
    <div className="bg-zinc-800 rounded-3xl p-6 shadow-xl border border-zinc-700 sticky top-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-orange-400">Tu carrito</p>
          <h2 className="text-2xl font-bold text-white">Resumen</h2>
        </div>
        <button
          onClick={onClear}
          className="rounded-full px-3 py-2 text-xs text-zinc-300 transition duration-150 hover:bg-zinc-700 hover:text-white active:scale-95 active:bg-zinc-700"
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
                      className="rounded-l-full px-3 py-2 text-white transition duration-150 hover:bg-zinc-700 active:scale-90 active:bg-orange-500"
                    >
                      −
                    </button>
                    <span className="px-4 text-white font-semibold" aria-live="polite">{item.cantidad}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      type="button"
                      className="rounded-r-full px-3 py-2 text-white transition duration-150 hover:bg-zinc-700 active:scale-90 active:bg-orange-500"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-white font-semibold">${item.precio * item.cantidad}</p>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="mt-3 rounded-full px-2 py-1 text-xs uppercase tracking-[0.2em] text-red-400 transition duration-150 hover:bg-red-500/10 hover:text-red-300 active:scale-95 active:bg-red-500/20"
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
        <label htmlFor="delivery-method" className="mb-4 block">
          <span className="mb-2 block text-sm font-medium text-zinc-200">
            Entrega:
          </span>
          <select
            id="delivery-method"
            value={deliveryMethod}
            onChange={(event) => onDeliveryMethodChange(event.target.value)}
            className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white focus:border-orange-400 focus:outline-none"
          >
            <option>Retiro en el local</option>
            <option>Envío a domicilio</option>
          </select>
        </label>
        {requiresAddress && (
          <div className="mb-4">
            <label htmlFor="delivery-address" className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-200">
                Dirección:
              </span>
              <input
                id="delivery-address"
                type="text"
                value={deliveryAddress}
                onChange={(event) => onDeliveryAddressChange(event.target.value)}
                placeholder="Ej: Av. Colón 1234, barrio..."
                required
                className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-orange-400 focus:outline-none"
              />
            </label>
            <p className="mt-2 text-xs text-zinc-400">
              El costo de envío se confirma por WhatsApp.
            </p>
          </div>
        )}
        <label htmlFor="payment-method" className="mb-4 block">
          <span className="mb-2 block text-sm font-medium text-zinc-200">
            Forma de pago:
          </span>
          <select
            id="payment-method"
            value={paymentMethod}
            onChange={(event) => onPaymentMethodChange(event.target.value)}
            className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white focus:border-orange-400 focus:outline-none"
          >
            <option>Efectivo</option>
            <option>Transferencia</option>
          </select>
        </label>
        {paymentMethod === "Efectivo" && (
          <label htmlFor="cash-amount" className="mb-4 block">
            <span className="mb-2 block text-sm font-medium text-zinc-200">
              ¿Con cuánto abona? <span className="text-zinc-400">(opcional)</span>
            </span>
            <input
              id="cash-amount"
              type="number"
              min="0"
              inputMode="numeric"
              value={cashAmount}
              onChange={(event) => onCashAmountChange(event.target.value)}
              placeholder="Ej: 20000"
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-orange-400 focus:outline-none"
            />
          </label>
        )}
        <label htmlFor="order-notes" className="mb-4 block">
          <span className="mb-2 block text-sm font-medium text-zinc-200">
            Aclaraciones:
          </span>
          <textarea
            id="order-notes"
            value={orderNotes}
            onChange={(event) => onOrderNotesChange(event.target.value)}
            placeholder="Ej: sin mayonesa, agregar cebolla..."
            rows={3}
            className="w-full resize-none rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-orange-400 focus:outline-none"
          />
        </label>
        <button
          onClick={onSendWhatsApp}
          disabled={cartItems.length === 0 || missingAddress}
          className="w-full inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-3xl font-semibold transition duration-150 active:scale-[0.98] active:bg-green-700 disabled:cursor-not-allowed disabled:bg-zinc-600 disabled:active:scale-100"
          type="button"
        >
          Enviar por WhatsApp
        </button>
        {missingAddress && cartItems.length > 0 && (
          <p className="mt-2 text-center text-xs text-orange-300">
            Ingresá una dirección para enviar el pedido.
          </p>
        )}
      </div>
    </div>
  )
}

export default Cart;
