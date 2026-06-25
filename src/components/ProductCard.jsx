function ProductCard({ producto, onAdd, wasJustAdded }) {
  const formattedPrice = new Intl.NumberFormat("es-AR").format(producto.precio)
  const hasDetails = producto.detalle?.length > 0

  return (
    <div className="overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-md shadow-orange-900/10">
      <div className="relative h-40 border-b border-orange-100 bg-orange-50">
        {producto.imagen ? (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-orange-100" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-end p-4">
          <span className="w-fit rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#b53632] shadow-sm">
            {producto.categoria}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-3 min-h-20">
          <h2 className="text-lg font-bold leading-snug text-[#2f2218]">
            {producto.nombre}
          </h2>
          {producto.subtitulo && (
            <p className="mt-2 text-sm font-medium leading-snug text-[#7c5b43]">
              {producto.subtitulo}
            </p>
          )}
        </div>

        {hasDetails && (
          <details className="mb-4 rounded-xl border border-orange-100 bg-[#fff7ed] text-sm text-[#6b3f24]">
            <summary className="cursor-pointer select-none px-3 py-2 font-semibold text-[#b53632]">
              Ver detalle
            </summary>
            <ul className="max-h-36 space-y-1 overflow-y-auto border-t border-orange-100 px-4 py-3">
              {producto.detalle.map((item) => (
                <li key={item} className="leading-snug">
                  {item}
                </li>
              ))}
            </ul>
          </details>
        )}

        <p className="text-xl font-bold text-[#b53632]">
          ${formattedPrice}
        </p>

        <button
          onClick={onAdd}
          type="button"
          className={`mt-4 w-full rounded-xl py-3 font-semibold text-white transition duration-150 active:scale-95 ${
            wasJustAdded
              ? "bg-emerald-600"
              : "bg-[#b53632] hover:bg-[#9f2e2d] active:bg-[#7f2424]"
          }`}
        >
          {wasJustAdded ? "Listo, agregado" : "Agregar"}
        </button>
      </div>
    </div>
  )
}

export default ProductCard
