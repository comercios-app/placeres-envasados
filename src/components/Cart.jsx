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
    <div className="sticky top-6 rounded-2xl border border-orange-200 bg-white p-5 shadow-xl shadow-orange-900/10 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[#b53632]">Tu carrito</p>
          <h2 className="text-2xl font-bold text-[#2f2218]">Resumen</h2>
        </div>
        <button
          onClick={onClear}
          className="rounded-full px-3 py-2 text-xs text-[#7c5b43] transition duration-150 hover:bg-[#fff1ee] hover:text-[#b53632] active:scale-95"
          type="button"
        >
          Limpiar
        </button>
      </div>

      {cartItems.length === 0 ? (
        <p className="text-[#7c5b43]">No agregaste productos aún.</p>
      ) : (
        <div className="space-y-4 mb-6">
          {cartItems.map((item) => (
            <div key={item.id} className="rounded-2xl border border-orange-100 bg-orange-50/70 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div>
                  <h3 className="font-semibold text-[#2f2218]">{item.nombre}</h3>
                  <p className="text-sm text-[#7c5b43]">{item.categoria}</p>
                  <p className="mt-2 font-semibold text-[#b53632]">${formatPrice(item.precio)} x {item.cantidad}</p>
                </div>

                <div className="ml-auto flex flex-col items-end gap-3">
                  <div className="inline-flex items-center rounded-full border border-orange-200 bg-white">
                    <button
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      type="button"
                      className="rounded-l-full px-3 py-2 text-[#b53632] transition duration-150 hover:bg-[#fff1ee] active:scale-90"
                    >
                      −
                    </button>
                    <span className="px-4 font-semibold text-[#2f2218]" aria-live="polite">{item.cantidad}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      type="button"
                      className="rounded-r-full px-3 py-2 text-[#b53632] transition duration-150 hover:bg-[#fff1ee] active:scale-90"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-[#2f2218]">${formatPrice(item.precio * item.cantidad)}</p>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="mt-3 rounded-full px-2 py-1 text-xs uppercase tracking-[0.2em] text-[#b53632]/70 transition duration-150 hover:bg-[#b53632]/10 hover:text-[#b53632] active:scale-95 active:bg-[#b53632]/20"
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

      <div className="border-t border-orange-200 pt-4">
        <div className="flex items-center justify-between text-[#7c5b43] mb-4">
          <span>Total</span>
          <span className="text-xl font-bold text-[#2f2218]">${formatPrice(total)}</span>
        </div>
        <label htmlFor="customer-name" className="mb-4 block">
          <span className="mb-2 block text-sm font-medium text-[#2f2218]">
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
            className="w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm text-[#2f2218] placeholder:text-[#a08268] focus:border-orange-500 focus:outline-none"
          />
        </label>
        <label htmlFor="delivery-method" className="mb-4 block">
          <span className="mb-2 block text-sm font-medium text-[#2f2218]">
            Entrega:
          </span>
          <select
            id="delivery-method"
            value={deliveryMethod}
            onChange={(event) => onDeliveryMethodChange(event.target.value)}
            className="w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm text-[#2f2218] focus:border-orange-500 focus:outline-none"
          >
            <option>Retiro en el local</option>
            <option>Envío a domicilio</option>
          </select>
        </label>
        {requiresAddress && (
          <div className="mb-4">
            <label htmlFor="delivery-address" className="block">
              <span className="mb-2 block text-sm font-medium text-[#2f2218]">
                Dirección:
              </span>
              <input
                id="delivery-address"
                type="text"
                value={deliveryAddress}
                onChange={(event) => onDeliveryAddressChange(event.target.value)}
                placeholder="Ej: Av. Colón 1234, barrio..."
                required
                className="w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm text-[#2f2218] placeholder:text-[#a08268] focus:border-orange-500 focus:outline-none"
              />
            </label>
            <p className="mt-2 text-xs text-[#7c5b43]">
              El costo de envío se confirma por WhatsApp.
            </p>
          </div>
        )}
        <label htmlFor="payment-method" className="mb-4 block">
          <span className="mb-2 block text-sm font-medium text-[#2f2218]">
            Forma de pago:
          </span>
          <select
            id="payment-method"
            value={paymentMethod}
            onChange={(event) => onPaymentMethodChange(event.target.value)}
            className="w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm text-[#2f2218] focus:border-orange-500 focus:outline-none"
          >
            <option>Efectivo</option>
            <option>Transferencia</option>
          </select>
        </label>
        {paymentMethod === "Efectivo" && (
          <label htmlFor="cash-amount" className="mb-4 block">
            <span className="mb-2 block text-sm font-medium text-[#2f2218]">
              ¿Con cuánto abona? <span className="text-[#7c5b43]">(opcional)</span>
            </span>
            <input
              id="cash-amount"
              type="number"
              min="0"
              inputMode="numeric"
              value={cashAmount}
              onChange={(event) => onCashAmountChange(event.target.value)}
              placeholder="Ej: 20000"
              className="w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm text-[#2f2218] placeholder:text-[#a08268] focus:border-orange-500 focus:outline-none"
            />
          </label>
        )}
        <label htmlFor="order-notes" className="mb-4 block">
          <span className="mb-2 block text-sm font-medium text-[#2f2218]">
            Aclaraciones:
          </span>
          <textarea
            id="order-notes"
            value={orderNotes}
            onChange={(event) => onOrderNotesChange(event.target.value)}
            placeholder="Ej: horario de entrega, referencias, preferencias..."
            rows={3}
            className="w-full resize-none rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm text-[#2f2218] placeholder:text-[#a08268] focus:border-orange-500 focus:outline-none"
          />
        </label>
        <button
          onClick={onSendWhatsApp}
          disabled={cartItems.length === 0 || missingRequiredData}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold text-white transition duration-150 hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-500 disabled:active:scale-100"
          type="button"
        >
          Enviar por WhatsApp
        </button>
        {missingName && cartItems.length > 0 && (
          <p className="mt-2 text-center text-xs text-[#b53632]">
            Ingresá tu nombre para enviar el pedido.
          </p>
        )}
        {!missingName && missingAddress && cartItems.length > 0 && (
          <p className="mt-2 text-center text-xs text-[#b53632]">
            Ingresá una dirección para enviar el pedido.
          </p>
        )}
      </div>
    </div>
  )
}

export default Cart;
