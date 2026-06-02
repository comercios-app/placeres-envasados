import picadasImg from "../assets/categoria-picadas-local.jpeg"
import bebidasSinAlcoholImg from "../assets/categoria-bebidas-sin-alcohol-local.webp"
import aperitivosDestiladosImg from "../assets/categoria-aperitivos-destilados-local.jpg"
import vinosImg from "../assets/categoria-vinos-local.jpg"
import regaleriaImg from "../assets/categoria-regaleria-local.jpg"
import cervezasImg from "../assets/categoria-cervezas-local.png"
import chocolatesLicoresImg from "../assets/categoria-chocolates-licores-local.jpg"
import fiambresQuesosImg from "../assets/categoria-fiambres-quesos-local.jpg"
import tabacosImg from "../assets/categoria-tabacos-local.png"
import pastasPolidoriImg from "../assets/categoria-pastas-polidori-local.jpg"
import delicatessensImg from "../assets/categoria-delicatessens-local.jpg"
import otrosProductosImg from "../assets/categoria-otros-productos-local.jpg"
import promoPreviasImg from "../assets/categoria-promo-previas-local.jpg"

const imageUrl = (query) =>
  `https://loremflickr.com/900/650/${encodeURIComponent(query)}`


export const categorias = [
  { nombre: "BEBIDAS SIN ALCOHOL", imagen: bebidasSinAlcoholImg },
  { nombre: "VINOS", imagen: vinosImg },
  { nombre: "CERVEZAS", imagen: cervezasImg },
  { nombre: "APERITIVOS Y DESTILADOS", imagen: aperitivosDestiladosImg },
  { nombre: "PROMO P/ PREVIAS", imagen: promoPreviasImg },
  { nombre: "PICADAS", imagen: picadasImg },
  { nombre: "FIAMBRES y QUESOS", imagen: fiambresQuesosImg },
  { nombre: "PASTAS POLIDORI", imagen: pastasPolidoriImg },
  { nombre: "CHOCOLATES Y LICORES", imagen: chocolatesLicoresImg },
  { nombre: "DELICATESSENS", imagen: delicatessensImg },
  { nombre: "REGALERIA", imagen: regaleriaImg },
  { nombre: "TABACOS", imagen: tabacosImg },
  { nombre: "OTROS PRODUCTOS..", imagen: otrosProductosImg },
]

export const productos = [
  { id: 1, nombre: "Alamos Malbec", precio: 7900, categoria: "VINOS", imagen: vinosImg },
  { id: 2, nombre: "Trumpeter Malbec", precio: 8500, categoria: "VINOS", imagen: vinosImg },
  { id: 3, nombre: "DV Catena Cabernet Malbec", precio: 13500, categoria: "VINOS", imagen: vinosImg },
  { id: 4, nombre: "Rutini Cabernet Malbec", precio: 17100, categoria: "VINOS", imagen: vinosImg },

  { id: 5, nombre: "Alamos Chardonnay", precio: 6500, categoria: "VINOS", imagen: vinosImg },
  { id: 6, nombre: "Trumpeter Chardonnay", precio: 10300, categoria: "VINOS", imagen: vinosImg },
  { id: 7, nombre: "Norton Chardonnay", precio: 11800, categoria: "VINOS", imagen: vinosImg },

  { id: 8, nombre: "Patagonia Amber Lager 730cc", precio: 3800, categoria: "CERVEZAS", imagen: cervezasImg },
  { id: 9, nombre: "Patagonia IPA 730cc", precio: 4200, categoria: "CERVEZAS", imagen: cervezasImg },
  { id: 10, nombre: "Stella Artois 1L", precio: 3500, categoria: "CERVEZAS", imagen: cervezasImg },
  { id: 11, nombre: "Corona 710cc", precio: 4500, categoria: "CERVEZAS", imagen: cervezasImg },

  { id: 12, nombre: "Fernet Branca 750ml", precio: 15500, categoria: "APERITIVOS Y DESTILADOS", imagen: aperitivosDestiladosImg },
  { id: 13, nombre: "Johnnie Walker Red Label 750ml", precio: 28000, categoria: "APERITIVOS Y DESTILADOS", imagen: aperitivosDestiladosImg },
  { id: 14, nombre: "Ron Havana Club Añejo 750ml", precio: 22000, categoria: "APERITIVOS Y DESTILADOS", imagen: aperitivosDestiladosImg },
  { id: 15, nombre: "Gin Bombay Sapphire 750ml", precio: 34000, categoria: "APERITIVOS Y DESTILADOS", imagen: aperitivosDestiladosImg },

  { id: 16, nombre: "Salame Milán Don Ramón 250g", precio: 6500, categoria: "FIAMBRES y QUESOS", imagen: fiambresQuesosImg },
  { id: 17, nombre: "Longaniza Don Ramón 250g", precio: 5900, categoria: "FIAMBRES y QUESOS", imagen: fiambresQuesosImg },
  { id: 18, nombre: "Queso Pategrás 250g", precio: 4500, categoria: "FIAMBRES y QUESOS", imagen: fiambresQuesosImg },
  { id: 19, nombre: "Queso Sardo 250g", precio: 5200, categoria: "FIAMBRES y QUESOS", imagen: fiambresQuesosImg },

  { id: 20, nombre: "Maní salado Quento 200g", precio: 2200, categoria: "PICADAS", imagen: picadasImg },
  { id: 21, nombre: "Papas Quento Clásicas 150g", precio: 2800, categoria: "PICADAS", imagen: picadasImg },
  { id: 22, nombre: "Palitos Salados Quento 150g", precio: 2300, categoria: "PICADAS", imagen: picadasImg },
  { id: 23, nombre: "Mix de frutos secos 200g", precio: 4800, categoria: "PICADAS", imagen: picadasImg },

  { id: 24, nombre: "Sandwich de miga Jamón y Queso", precio: 2500, categoria: "PICADAS", imagen: picadasImg },
  { id: 25, nombre: "Sandwich de miga Roquefort y Jamón", precio: 2800, categoria: "PICADAS", imagen: picadasImg },
  { id: 26, nombre: "Triple Especial", precio: 3500, categoria: "PICADAS", imagen: picadasImg },

  { id: 27, nombre: "Mostaza Patagónica Clásica", precio: 4900, categoria: "DELICATESSENS", imagen: delicatessensImg },
  { id: 28, nombre: "Mostaza Patagónica Ahumada", precio: 5200, categoria: "DELICATESSENS", imagen: delicatessensImg },
  { id: 29, nombre: "Berenjenas al Escabeche", precio: 4500, categoria: "DELICATESSENS", imagen: delicatessensImg },
  { id: 30, nombre: "Mermelada Artesanal Frutos Rojos", precio: 5500, categoria: "DELICATESSENS", imagen: delicatessensImg },

  { id: 31, nombre: "Picada para 2 personas", precio: 18000, categoria: "PICADAS", imagen: picadasImg },
  { id: 32, nombre: "Picada para 4 personas", precio: 34000, categoria: "PICADAS", imagen: picadasImg },
  { id: 33, nombre: "Picada Premium", precio: 48000, categoria: "PICADAS", imagen: picadasImg },
]
