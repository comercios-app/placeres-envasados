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
import picadaEspecial2Img from "../assets/picada-especial-2.jpeg"
import picadaEspecial3Img from "../assets/picada-especial-3.jpeg"
import picadaEspecial45Img from "../assets/picada-especial-4-5.jpeg"
import picadaEspecial56Img from "../assets/picada-especial-5-6.jpeg"
import picadaEsencial3Img from "../assets/picada-esencial-3.jpeg"
import picadaEsencial45Img from "../assets/picada-esencial-4-5.jpeg"
import picadaQuesos45Img from "../assets/picada-quesos-4-5.jpeg"

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
  { id: 1, nombre: "Coca cola 1,5 Descartable", precio: 4900, categoria: "BEBIDAS SIN ALCOHOL", imagen: bebidasSinAlcoholImg },
  { id: 2, nombre: "Cunington 1,5 Pomelo", precio: 2500, categoria: "BEBIDAS SIN ALCOHOL", imagen: bebidasSinAlcoholImg },
  { id: 3, nombre: "Coca Zero 1,5 Descartable", precio: 4900, categoria: "BEBIDAS SIN ALCOHOL", imagen: bebidasSinAlcoholImg },
  { id: 4, nombre: "Cunington 1,5 tonica", precio: 2500, categoria: "BEBIDAS SIN ALCOHOL", imagen: bebidasSinAlcoholImg },
  { id: 5, nombre: "Pryty 2,25lts", precio: 3800, categoria: "BEBIDAS SIN ALCOHOL", imagen: bebidasSinAlcoholImg },
  { id: 6, nombre: "Prity Zero 2,25lts", precio: 3500, categoria: "BEBIDAS SIN ALCOHOL", imagen: bebidasSinAlcoholImg },

  { id: 7, nombre: "CAZADOR MALBEC", precio: 6000, categoria: "VINOS", imagen: vinosImg },
  { id: 8, nombre: "LOS CARDOS MALBEC", precio: 9000, categoria: "VINOS", imagen: vinosImg },
  { id: 9, nombre: "TILIMUKI ORGANICO MALBEC", precio: 8000, categoria: "VINOS", imagen: vinosImg },
  { id: 10, nombre: "TILIMUKI ORGANICO BONARDA", precio: 8000, categoria: "VINOS", imagen: vinosImg },
  { id: 11, nombre: "SANTA JULIA DULCE CHENIN", precio: 11000, categoria: "VINOS", imagen: vinosImg },
  { id: 12, nombre: "BARBERIS RESERVA CAB SAUV.", precio: 16000, categoria: "VINOS", imagen: vinosImg },
  { id: 13, nombre: "RAZA ARGENTINA BLEND", precio: 12000, categoria: "VINOS", imagen: vinosImg },

  { id: 14, nombre: "LATA FERMENTUM SESSION IPA", precio: 5000, categoria: "CERVEZAS", imagen: cervezasImg },
  { id: 15, nombre: "LATA FERMENTUM AMERICAN IPA", precio: 6000, categoria: "CERVEZAS", imagen: cervezasImg },
  { id: 16, nombre: "IBIRRA ARTESANAL 1LT IPA", precio: 7500, categoria: "CERVEZAS", imagen: cervezasImg },
  { id: 17, nombre: "GOYENECHE IPA 500 cc VIDRIO", precio: 6000, categoria: "CERVEZAS", imagen: cervezasImg },
  { id: 18, nombre: "GOYENECHE GOLDEN 500 cc VIDRIO", precio: 5000, categoria: "CERVEZAS", imagen: cervezasImg },
  { id: 19, nombre: "EL BUHO ARTESANAL DE MIEL Y JENGIBRE DE 1LT RETORNABLE", precio: 7000, categoria: "CERVEZAS", imagen: cervezasImg },
  { id: 20, nombre: "EL BUHO ARTESANAL SCOTCH DE 1LT RETORNABLE", precio: 7000, categoria: "CERVEZAS", imagen: cervezasImg },

  { id: 21, nombre: "AMARGO OBRERO + CUNINGTON POMELO 1,5lts", precio: 8900, categoria: "PROMO P/ PREVIAS", imagen: promoPreviasImg },
  { id: 22, nombre: "SKY SABOR + 3 SPEED 250cc + HIELO", precio: 19500, categoria: "PROMO P/ PREVIAS", imagen: promoPreviasImg },
  { id: 23, nombre: "SMIRNOFF SABOR + 3 SPEED 250cc + HIELO", precio: 18900, categoria: "PROMO P/ PREVIAS", imagen: promoPreviasImg },

  { id: 24, nombre: "SORRENTINOS JAMON MOZZARELLA Y ALBAHACA", precio: 17500, categoria: "PASTAS POLIDORI", imagen: pastasPolidoriImg },
  { id: 25, nombre: "SORRENTINOS HONGOS RICOTA Y NUECES", precio: 22000, categoria: "PASTAS POLIDORI", imagen: pastasPolidoriImg },
  { id: 26, nombre: "AGNOLOTIS OSOBUCO BRASEADO Y MIX HONGOS", precio: 23500, categoria: "PASTAS POLIDORI", imagen: pastasPolidoriImg },
  { id: 27, nombre: "RAVIOLES DE TERNERA Y ESPINACA", precio: 25000, categoria: "PASTAS POLIDORI", imagen: pastasPolidoriImg },
  { id: 28, nombre: "RAVIOLES DE ESPINACA Y RICOTA", precio: 25000, categoria: "PASTAS POLIDORI", imagen: pastasPolidoriImg },
  { id: 29, nombre: "NOQUIS MIXTOS", precio: 22000, categoria: "PASTAS POLIDORI", imagen: pastasPolidoriImg },
  { id: 30, nombre: "LASAGNA DE CARNE LISTA PARA CALENTAR 2 PORCIONES", precio: 32000, categoria: "PASTAS POLIDORI", imagen: pastasPolidoriImg },
  { id: 31, nombre: "LASAGNA DE CARNE 1 PORCION", precio: 18000, categoria: "PASTAS POLIDORI", imagen: pastasPolidoriImg },
  { id: 32, nombre: "SALSA CREMA CON HIERBAS", precio: 8900, categoria: "PASTAS POLIDORI", imagen: pastasPolidoriImg },
  { id: 33, nombre: "SALSA BOLOGENSA", precio: 9900, categoria: "PASTAS POLIDORI", imagen: pastasPolidoriImg },

  { id: 34, nombre: "CHOCOLATE ARTESANAL NEGRO RELLENO DE DULCE DE LECHE 50grs ESTACION LA FINCA", precio: 3900, categoria: "CHOCOLATES Y LICORES", imagen: chocolatesLicoresImg },
  { id: 35, nombre: "CHOCOLATE ARTESANAL BLANCO RELLENO DE DULCE DE LECHE 50grs ESTACION LA FINCA", precio: 3900, categoria: "CHOCOLATES Y LICORES", imagen: chocolatesLicoresImg },
  { id: 36, nombre: "LICOR CREMOSO ARTESANAL ROCHER 250cc", precio: 9500, categoria: "CHOCOLATES Y LICORES", imagen: chocolatesLicoresImg },
  { id: 37, nombre: "LICOR CREMOSO CHOCOLATE EL ABUELO DE 700CC", precio: 8000, categoria: "CHOCOLATES Y LICORES", imagen: chocolatesLicoresImg },
  { id: 38, nombre: "LICOR CREMOSO DULCE DE LECHE EL ABUELO DE 700CC", precio: 8000, categoria: "CHOCOLATES Y LICORES", imagen: chocolatesLicoresImg },

  { id: 39, nombre: "HIELO 1,5KG", precio: 3000, categoria: "OTROS PRODUCTOS..", imagen: otrosProductosImg },
  { id: 40, nombre: "CARBON QUEBRACHO BLANCO 4kg", precio: 4500, categoria: "OTROS PRODUCTOS..", imagen: otrosProductosImg },

  {
    id: 41,
    nombre: "Picada Especial de Placeres para 2",
    subtitulo: "Come 1, pican 2. Bandeja de 25 cm.",
    precio: 24000,
    categoria: "PICADAS",
    imagen: picadaEspecial2Img,
    detalle: [
      "Salame y bondiola Don Ramon de Oncativo",
      "Queso pategras",
      "Queso ahumado saborizado",
      "Mix de olivas",
      "Berenjenas condimentadas al aceite",
      "Touch de frutos secos",
      "Pan casero mediano",
      "Papas snack",
    ],
  },
  {
    id: 42,
    nombre: "Picada Especial de Placeres para 3",
    subtitulo: "Pican 3, o comen 1 o 2. Bandeja de 25 cm.",
    precio: 29000,
    categoria: "PICADAS",
    imagen: picadaEspecial3Img,
    detalle: [
      "Salame y bondiola Don Ramon de Oncativo",
      "Queso pategras",
      "Queso ahumado saborizado",
      "Mix de olivas",
      "Berenjenas condimentadas al aceite",
      "Touch de frutos secos",
      "Pan casero grande",
      "Papas snack",
      "Mani saborizado o salado",
    ],
  },
  {
    id: 43,
    nombre: "Picada Especial de Placeres para 4/5",
    subtitulo: "Comen 2 o 3. Bandeja de 30 cm.",
    precio: 39000,
    categoria: "PICADAS",
    imagen: picadaEspecial45Img,
    detalle: [
      "Salame y bondiola de Oncativo",
      "Quesos pategras y ahumado saborizado",
      "Mix de olivas verdes y griegas negras",
      "Berenjenas condimentadas al aceite",
      "Touch de frutos secos",
      "Pan casero grande",
      "Papas snack",
      "Mani saborizado o salado",
    ],
  },
  {
    id: 44,
    nombre: "Picada Especial de Placeres para 5/6",
    subtitulo: "Pican 5 o 6, o comen 3 o 4. Bandeja de 40 x 30 cm.",
    precio: 52000,
    categoria: "PICADAS",
    imagen: picadaEspecial56Img,
    detalle: [
      "Salame, bondiola y lomito ahumado Don Ramon",
      "Quesos ahumados y saborizados",
      "Queso pategras y queso azul",
      "Mix de olivas verdes, griegas y con morrones",
      "Berenjenas condimentadas",
      "Touch de frutos secos",
      "Pan casero grande",
      "Papas snack",
      "Mani salado o saborizado",
    ],
  },
  {
    id: 45,
    nombre: "Picada Esencial de Placeres para 3",
    subtitulo: "Come 1, pican 2 o 3. Bandeja de 25 cm.",
    precio: 25000,
    categoria: "PICADAS",
    imagen: picadaEsencial3Img,
    detalle: [
      "Salame colonial",
      "Bondiola Don Ramon Oncativo",
      "Queso pategras",
      "Queso azul",
      "Mini sandwiches de miga de jamon cocido y queso",
      "Touch de berenjenas condimentadas al aceite",
      "Mix de olivas verdes, negras y con morrones",
      "Pan casero mediano",
      "Papas snack",
      "Mani saborizado o salado",
    ],
  },
  {
    id: 46,
    nombre: "Picada Esencial de Placeres para 4/5",
    subtitulo: "Comen 2 o 3, pican 4 o 5. Bandeja de 30 cm.",
    precio: 33000,
    categoria: "PICADAS",
    imagen: picadaEsencial45Img,
    detalle: [
      "Salame colonial",
      "Bondiola Don Ramon Oncativo",
      "Queso pategras",
      "Queso azul",
      "Mini sandwiches de miga de jamon cocido y queso",
      "Touch de berenjenas condimentadas al aceite",
      "Mix de olivas verdes, negras y con morrones",
      "Pan casero grande",
      "Papas snack",
      "Mani saborizado o salado",
    ],
  },
  {
    id: 47,
    nombre: "Picada de Quesos para 4/5",
    subtitulo: "Comen 2 o 3. Bandeja de 30 cm.",
    precio: 38000,
    categoria: "PICADAS",
    imagen: picadaQuesos45Img,
    detalle: [
      "Surtido de quesos",
      "Aceitunas verdes, griegas y rellenas con morron",
      "Berenjenas condimentadas al aceite",
      "Pan casero grande",
      "Papas snack",
    ],
  },
  { id: 48, nombre: "Promo 2 x EL BUHO ARTESANAL DE MIEL Y JENGIBRE DE 1LT RETORNABLE", precio: 12000, categoria: "CERVEZAS", imagen: cervezasImg },
  { id: 49, nombre: "Promo 2 x EL BUHO ARTESANAL SCOTCH DE 1LT RETORNABLE", precio: 12000, categoria: "CERVEZAS", imagen: cervezasImg },
  { id: 50, nombre: "Promo 2 x GOYENECHE IPA 500 cc VIDRIO", precio: 11000, categoria: "CERVEZAS", imagen: cervezasImg },
  { id: 51, nombre: "Promo 2 x LICOR CREMOSO CHOCOLATE EL ABUELO DE 700CC", precio: 15000, categoria: "CHOCOLATES Y LICORES", imagen: chocolatesLicoresImg },
  { id: 52, nombre: "Promo 2 x LICOR CREMOSO DULCE DE LECHE EL ABUELO DE 700CC", precio: 15000, categoria: "CHOCOLATES Y LICORES", imagen: chocolatesLicoresImg },
]
