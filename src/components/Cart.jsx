function Cart({
  cartItems,
  onRemove,
  onUpdateQuantity,
  onClear,
  total,
  customerName,
  onCustomerNameChange,
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
  const missingName = !customerName.trim()
  const missingAddress = requiresAddress && !deliveryAddress.trim()
  const missingRequiredData = missingName || missingAddress
  const formatPrice = (value) => new Intl.NumberFormat("es-AR").format(value)

  return (
    <div className="sticky top-6 rounded-2xl border border-[#d6b36a]/20 bg-[#211016] p-5 shadow-xl shadow-black/30 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[#d6b36a]">Tu carrito</p>
          <h2 className="text-2xl font-bold text-white">Resumen</h2>
        </div>
        <button
          onClick={onClear}
          className="rounded-full px-3 py-2 text-xs text-[#d8c7aa] transition duration-150 hover:bg-black/25 hover:text-white active:scale-95"
          type="button"
        >
          Limpiar
        </button>
      </div>

      {cartItems.length === 0 ? (
        <p className="text-[#d8c7aa]">No agregaste productos aún.</p>
      ) : (
        <div className="space-y-4 mb-6">
          {cartItems.map((item) => (
            <div key={item.id} className="rounded-2xl border border-[#d6b36a]/10 bg-[#160a0f] p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div>
                  <h3 className="font-semibold text-white">{item.nombre}</h3>
                  <p className="text-sm text-[#d8c7aa]">{item.categoria}</p>
                  <p className="mt-2 font-semibold text-[#d6b36a]">${formatPrice(item.precio)} x {item.cantidad}</p>
                </div>

                <div className="ml-auto flex flex-col items-end gap-3">
                  <div className="inline-flex items-center rounded-full border border-[#d6b36a]/20 bg-black/20">
                    <button
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      type="button"
                      className="rounded-l-full px-3 py-2 text-white transition duration-150 hover:bg-[#7b1f35] active:scale-90"
                    >
                      −
                    </button>
                    <span className="px-4 text-white font-semibold" aria-live="polite">{item.cantidad}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      type="button"
                      className="rounded-r-full px-3 py-2 text-white transition duration-150 hover:bg-[#7b1f35] active:scale-90"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-white">${formatPrice(item.precio * item.cantidad)}</p>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="mt-3 rounded-full px-2 py-1 text-xs uppercase tracking-[0.2em] text-red-300 transition duration-150 hover:bg-red-500/10 hover:text-red-200 active:scale-95 active:bg-red-500/20"
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

      <div className="border-t border-[#d6b36a]/20 pt-4">
        <div className="flex items-center justify-between text-[#f7ead2] mb-4">
          <span>Total</span>
          <span className="text-xl font-bold text-white">${formatPrice(total)}</span>
        </div>
        <label htmlFor="customer-name" className="mb-4 block">
          <span className="mb-2 block text-sm font-medium text-[#f7ead2]">
            Nombre:
          </span>
          <input
            id="customer-name"
            type="text"
            value={customerName}
            onChange={(event) => onCustomerNameChange(event.target.value)}
            placeholder="¿Quién realiza el pedido?"
            autoComplete="name"
            required
            className="w-full rounded-xl border border-[#d6b36a]/20 bg-[#160a0f] px-4 py-3 text-sm text-white placeholder:text-[#8c7a60] focus:border-[#d6b36a] focus:outline-none"
          />
        </label>
        <label htmlFor="delivery-method" className="mb-4 block">
          <span className="mb-2 block text-sm font-medium text-[#f7ead2]">
            Entrega:
          </span>
          <select
            id="delivery-method"
            value={deliveryMethod}
            onChange={(event) => onDeliveryMethodChange(event.target.value)}
            className="w-full rounded-xl border border-[#d6b36a]/20 bg-[#160a0f] px-4 py-3 text-sm text-white focus:border-[#d6b36a] focus:outline-none"
          >
            <option>Retiro en el local</option>
            <option>Envío a domicilio</option>
          </select>
        </label>
        {requiresAddress && (
          <div className="mb-4">
            <label htmlFor="delivery-address" className="block">
              <span className="mb-2 block text-sm font-medium text-[#f7ead2]">
                Dirección:
              </span>
              <input
                id="delivery-address"
                type="text"
                value={deliveryAddress}
                onChange={(event) => onDeliveryAddressChange(event.target.value)}
                placeholder="Ej: Av. Colón 1234, barrio..."
                required
                className="w-full rounded-xl border border-[#d6b36a]/20 bg-[#160a0f] px-4 py-3 text-sm text-white placeholder:text-[#8c7a60] focus:border-[#d6b36a] focus:outline-none"
              />
            </label>
            <p className="mt-2 text-xs text-[#d8c7aa]">
              El costo de envío se confirma por WhatsApp.
            </p>
          </div>
        )}
        <label htmlFor="payment-method" className="mb-4 block">
          <span className="mb-2 block text-sm font-medium text-[#f7ead2]">
            Forma de pago:
          </span>
          <select
            id="payment-method"
            value={paymentMethod}
            onChange={(event) => onPaymentMethodChange(event.target.value)}
            className="w-full rounded-xl border border-[#d6b36a]/20 bg-[#160a0f] px-4 py-3 text-sm text-white focus:border-[#d6b36a] focus:outline-none"
          >
            <option>Efectivo</option>
            <option>Transferencia</option>
          </select>
        </label>
        {paymentMethod === "Efectivo" && (
          <label htmlFor="cash-amount" className="mb-4 block">
            <span className="mb-2 block text-sm font-medium text-[#f7ead2]">
              ¿Con cuánto abona? <span className="text-[#d8c7aa]">(opcional)</span>
            </span>
            <input
              id="cash-amount"
              type="number"
              min="0"
              inputMode="numeric"
              value={cashAmount}
              onChange={(event) => onCashAmountChange(event.target.value)}
              placeholder="Ej: 20000"
              className="w-full rounded-xl border border-[#d6b36a]/20 bg-[#160a0f] px-4 py-3 text-sm text-white placeholder:text-[#8c7a60] focus:border-[#d6b36a] focus:outline-none"
            />
          </label>
        )}
        <label htmlFor="order-notes" className="mb-4 block">
          <span className="mb-2 block text-sm font-medium text-[#f7ead2]">
            Aclaraciones:
          </span>
          <textarea
            id="order-notes"
            value={orderNotes}
            onChange={(event) => onOrderNotesChange(event.target.value)}
            placeholder="Ej: horario de entrega, referencias, preferencias..."
            rows={3}
            className="w-full resize-none rounded-xl border border-[#d6b36a]/20 bg-[#160a0f] px-4 py-3 text-sm text-white placeholder:text-[#8c7a60] focus:border-[#d6b36a] focus:outline-none"
          />
        </label>
        <button
          onClick={onSendWhatsApp}
          disabled={cartItems.length === 0 || missingRequiredData}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold text-white transition duration-150 hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#5d4f43] disabled:active:scale-100"
          type="button"
        >
          Enviar por WhatsApp
        </button>
        {missingName && cartItems.length > 0 && (
          <p className="mt-2 text-center text-xs text-[#d6b36a]">
            Ingresá tu nombre para enviar el pedido.
          </p>
        )}
        {!missingName && missingAddress && cartItems.length > 0 && (
          <p className="mt-2 text-center text-xs text-[#d6b36a]">
            Ingresá una dirección para enviar el pedido.
          </p>
        )}
      </div>
    </div>
  )
}

export default Cart;
