# Instalación del panel de Placeres Envasados

Proyecto exclusivo: `ayhzgxsqhrjplojnbgqm`. No ejecutar estos scripts en Doña Carmen.

1. En Authentication → Users, crear `gaston3x@gmail.com` con contraseña privada y Auto Confirm User activado.
2. Ejecutar **00-install.sql** completo en SQL Editor. Es una transacción: instala precios, catálogo, fotos de productos y categorías, permisos e historial, y habilita al administrador. Si falta el usuario, revierte todo e indica cómo crearlo.
3. En Authentication → URL Configuration configurar:
   - Site URL: `https://comercios-app.github.io/placeres-envasados/`
   - Redirect URLs: `https://comercios-app.github.io/placeres-envasados/?admin=1&recovery=1`
4. Verificar la lectura pública del catálogo (13 categorías, 52 productos iniciales) y la denegación de escrituras anónimas.
5. Activar `VITE_LIVE_PRICES`, `VITE_PRODUCT_IMAGES` y `VITE_CATALOG` en `.env.production`, compilar y publicar.
6. Probar ingreso, edición y recuperación desde `https://comercios-app.github.io/placeres-envasados/#/admin`.

El SQL inicial conserva precios, imágenes y metadatos existentes al reejecutarlo. Los archivos 01 a 06 son las partes fuente de 00; mantenerlos sincronizados al realizar cambios. La carga inicial procede de `src/data/productos.js`; `tests/fixtures/catalog.json` conserva una copia para validar la migración.

## Funcionalidad

Precios enteros con historial y control de versión; ABM de categorías y productos con baja por archivado; subtítulos de hasta 300 caracteres y hasta 50 detalles de 300 caracteres; fotos comprimidas a WebP de hasta 300 KB en dos buckets separados. Las categorías vacías se ocultan en el menú. Restaurar una categoría no restaura sus productos.

Las imágenes originales del sitio se resuelven por ID, por lo que renombrar o mover no pierde la foto. Las cargas nuevas usan rutas únicas; no se puede eliminar una imagen activa. Archivar conserva las imágenes. La eliminación de fotos reemplazadas es posterior al guardado; un fallo de red puede dejar archivos sin usar, pero nunca debe borrar una imagen cuyo guardado no se pudo confirmar.

El acceso administrador es una lista privada de IDs de Authentication; crear una cuenta por sí solo no habilita edición. Las escrituras de catálogo/precios/fotos se realizan por RPC con validación de permisos y versiones. El instalador no contiene contraseñas ni claves secretas.

Antes de enviar un pedido por WhatsApp se vuelve a consultar el catálogo: si cambian nombres/precios o se archivan productos, se pide revisar el pedido; si falla la consulta, no se envía con datos antiguos.

## Validación y mantenimiento

`npm test` verifica SQL con PostgreSQL local (PGlite) y utilidades. `npm run test:browser` verifica el panel y menú con respuestas simuladas de Supabase, incluyendo fotografías y detalles de picadas. `npm run lint` y `npm run build` completan la validación. No reemplazan la prueba de ingreso y recuperación con el correo real del administrador.

Manual del cliente: `public/manual.html` y `public/manual-placeres-envasados.pdf`. Regenerar el PDF si cambia el manual. No desactivar el catálogo como rollback después de que el cliente haya creado productos: el catálogo estático no incluye sus altas ni modificaciones.
