function ProductCard({ producto, categoria, onAdd, wasJustAdded }) {
  const formattedPrice = new Intl.NumberFormat("es-AR").format(producto.precio)

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d6b36a]/20 bg-[#211016] shadow-lg shadow-black/25">
      <div className="relative h-36 border-b border-[#d6b36a]/10 bg-gradient-to-br from-[#4c1424] via-[#211016] to-black">
        <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_25%_20%,rgba(214,179,106,0.24),transparent_28%),radial-gradient(circle_at_80%_85%,rgba(123,31,53,0.45),transparent_34%)]" />
        <div className="relative flex h-full flex-col justify-between p-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[#d6b36a]/20 bg-black/25 text-3xl">
            {categoria?.icono ?? "•"}
          </span>
          <span className="w-fit rounded-full border border-[#d6b36a]/20 bg-black/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#d6b36a]">
            {producto.categoria}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-3 min-h-20">
          <h2 className="text-lg font-bold leading-snug text-white">
            {producto.nombre}
          </h2>
        </div>

        <p className="text-xl font-semibold text-[#d6b36a]">
          ${formattedPrice}
        </p>

        <button
          onClick={onAdd}
          type="button"
          className={`mt-4 w-full rounded-xl py-3 font-semibold text-white transition duration-150 active:scale-95 ${
            wasJustAdded
              ? "bg-emerald-600"
              : "bg-[#7b1f35] hover:bg-[#96304a] active:bg-[#5f1828]"
          }`}
        >
          {wasJustAdded ? "Listo, agregado" : "Agregar"}
        </button>
      </div>
    </div>
  )
}

export default ProductCard
