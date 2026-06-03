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

export const categorias = [
  { nombre: "PICADAS", imagen: picadasImg },
  { nombre: "VINOS", imagen: vinosImg },
  { nombre: "CERVEZAS", imagen: cervezasImg },
  { nombre: "BEBIDAS SIN ALCOHOL", imagen: bebidasSinAlcoholImg },
  { nombre: "APERITIVOS Y DESTILADOS", imagen: aperitivosDestiladosImg },
  { nombre: "PROMO P/ PREVIAS", imagen: promoPreviasImg },
  { nombre: "FIAMBRES y QUESOS", imagen: fiambresQuesosImg },
  { nombre: "PASTAS POLIDORI", imagen: pastasPolidoriImg },
  { nombre: "CHOCOLATES Y LICORES", imagen: chocolatesLicoresImg },
  { nombre: "DELICATESSENS", imagen: delicatessensImg },
  { nombre: "REGALERIA", imagen: regaleriaImg },
  { nombre: "TABACOS", imagen: tabacosImg },
  { nombre: "OTROS PRODUCTOS..", imagen: otrosProductosImg },
]

export const productos = [
  { id: 1, nombre: "Coca cola 1,5 Descartable", precio: 4800, categoria: "BEBIDAS SIN ALCOHOL", imagen: bebidasSinAlcoholImg },
  { id: 2, nombre: "Cunington 1,5 Pomelo", precio: 2500, categoria: "BEBIDAS SIN ALCOHOL", imagen: bebidasSinAlcoholImg },
  { id: 3, nombre: "Coca Zero 1,5 Descartable", precio: 4800, categoria: "BEBIDAS SIN ALCOHOL", imagen: bebidasSinAlcoholImg },
  { id: 4, nombre: "Cunington 1,5 tonica", precio: 2500, categoria: "BEBIDAS SIN ALCOHOL", imagen: bebidasSinAlcoholImg },
  { id: 5, nombre: "Pryty 2,25lts", precio: 3800, categoria: "BEBIDAS SIN ALCOHOL", imagen: bebidasSinAlcoholImg },
  { id: 6, nombre: "Prity Zero 2,25lts", precio: 3800, categoria: "BEBIDAS SIN ALCOHOL", imagen: bebidasSinAlcoholImg },

  { id: 7, nombre: "CAZADOR MALBEC", precio: 6000, categoria: "VINOS", imagen: vinosImg },
  { id: 8, nombre: "LOS CARDOS MALBEC", precio: 9000, categoria: "VINOS", imagen: vinosImg },
  { id: 9, nombre: "TILIMUKI ORGANICO MALBEC", precio: 8000, categoria: "VINOS", imagen: vinosImg },
  { id: 10, nombre: "TILIMUKI ORGANICO BONARDA", precio: 8000, categoria: "VINOS", imagen: vinosImg },
  { id: 11, nombre: "SANTA JULIA DULCE CHENIN", precio: 11000, categoria: "VINOS", imagen: vinosImg },
  { id: 12, nombre: "BARBERIS RESERVA CAB SAUV.", precio: 15000, categoria: "VINOS", imagen: vinosImg },
  { id: 13, nombre: "RAZA ARGENTINA BLEND", precio: 12000, categoria: "VINOS", imagen: vinosImg },

  { id: 14, nombre: "LATA FERMENTUM SESSION IPA", precio: 5000, categoria: "CERVEZAS", imagen: cervezasImg },
  { id: 15, nombre: "LATA FERMENTUM AMERICAN IPA", precio: 6000, categoria: "CERVEZAS", imagen: cervezasImg },
  { id: 16, nombre: "IBIRRA ARTESANAL 1LT IPA", precio: 7500, categoria: "CERVEZAS", imagen: cervezasImg },
  { id: 17, nombre: "GOYENECHE IPA 500 cc VIDRIO (2x$10000)", precio: 5500, categoria: "CERVEZAS", imagen: cervezasImg },
  { id: 18, nombre: "GOYENECHE GOLDEN 500 cc VIDRIO", precio: 4500, categoria: "CERVEZAS", imagen: cervezasImg },
  { id: 19, nombre: "EL BUHO ARTESANAL DE MIEL Y JENGIBRE DE 1LT RETORNABLE (2 x $12000)", precio: 7000, categoria: "CERVEZAS", imagen: cervezasImg },
  { id: 20, nombre: "EL BUHO ARTESANAL SCOTCH DE 1LT RETORNABLE (2x$12000)", precio: 7000, categoria: "CERVEZAS", imagen: cervezasImg },

  { id: 21, nombre: "AMARGO OBRERO + CUNINGTON POMELO 1,5lts", precio: 8900, categoria: "PROMO P/ PREVIAS", imagen: promoPreviasImg },
  { id: 22, nombre: "SKY SABOR + 3 SPEED 250cc + HIELO", precio: 19500, categoria: "PROMO P/ PREVIAS", imagen: promoPreviasImg },
  { id: 23, nombre: "SMIRNOFF SABOR + 3 SPEED 250cc + HIELO", precio: 18500, categoria: "PROMO P/ PREVIAS", imagen: promoPreviasImg },

  { id: 24, nombre: "SORRENTINOS JAMON MOZZARELLA Y ALBAHACA", precio: 15000, categoria: "PASTAS POLIDORI", imagen: pastasPolidoriImg },
  { id: 25, nombre: "SORRENTINOS HONGOS RICOTA Y NUECES", precio: 20000, categoria: "PASTAS POLIDORI", imagen: pastasPolidoriImg },
  { id: 26, nombre: "AGNOLOTIS OSOBUCO BRASEADO Y MIX HONGOS", precio: 22000, categoria: "PASTAS POLIDORI", imagen: pastasPolidoriImg },
  { id: 27, nombre: "RAVIOLES DE TERNERA Y ESPINACA", precio: 23000, categoria: "PASTAS POLIDORI", imagen: pastasPolidoriImg },
  { id: 28, nombre: "RAVIOLES DE ESPINACA Y RICOTA", precio: 23000, categoria: "PASTAS POLIDORI", imagen: pastasPolidoriImg },
  { id: 29, nombre: "NOQUIS MIXTOS", precio: 21000, categoria: "PASTAS POLIDORI", imagen: pastasPolidoriImg },
  { id: 30, nombre: "LASAGNA DE CARNE LISTA PARA CALENTAR 2 PORCIONES", precio: 30000, categoria: "PASTAS POLIDORI", imagen: pastasPolidoriImg },
  { id: 31, nombre: "LASAGNA DE CARNE 1 PORCION", precio: 17000, categoria: "PASTAS POLIDORI", imagen: pastasPolidoriImg },
  { id: 32, nombre: "SALSA CREMA CON HIERBAS", precio: 8000, categoria: "PASTAS POLIDORI", imagen: pastasPolidoriImg },
  { id: 33, nombre: "SALSA BOLOGENSA", precio: 9500, categoria: "PASTAS POLIDORI", imagen: pastasPolidoriImg },

  { id: 34, nombre: "CHOCOLATE ARTESANAL NEGRO RELLENO DE DULCE DE LECHE 50grs ESTACION LA FINCA", precio: 3500, categoria: "CHOCOLATES Y LICORES", imagen: chocolatesLicoresImg },
  { id: 35, nombre: "CHOCOLATE ARTESANAL BLANCO RELLENO DE DULCE DE LECHE 50grs ESTACION LA FINCA", precio: 3500, categoria: "CHOCOLATES Y LICORES", imagen: chocolatesLicoresImg },
  { id: 36, nombre: "LICOR CREMOSO ARTESANAL ROCHER 250cc", precio: 9500, categoria: "CHOCOLATES Y LICORES", imagen: chocolatesLicoresImg },
  { id: 37, nombre: "LICOR CREMOSO CHOCOLATE EL ABUELO DE 700CC (2x$15000)", precio: 8000, categoria: "CHOCOLATES Y LICORES", imagen: chocolatesLicoresImg },
  { id: 38, nombre: "LICOR CREMOSO DULCE DE LECHE EL ABUELO DE 700CC (2x$15000)", precio: 8000, categoria: "CHOCOLATES Y LICORES", imagen: chocolatesLicoresImg },

  { id: 39, nombre: "HIELO 1,5KG", precio: 3000, categoria: "OTROS PRODUCTOS..", imagen: otrosProductosImg },
  { id: 40, nombre: "CARBON QUEBRACHO BLANCO 4kg", precio: 4500, categoria: "OTROS PRODUCTOS..", imagen: otrosProductosImg },
]
