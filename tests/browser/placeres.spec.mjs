import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { mockApi, login } from './helpers.mjs'

test('picadas: conserva y permite editar subtítulo y contenido', async ({ page }) => {
  const state = await mockApi(page)
  await login(page)
  const name = 'Picada Especial de Placeres para 2'
  await page.getByRole('button', { name: `Editar producto ${name}`, exact: true }).click()
  const form = page.getByRole('dialog')
  await expect(form.getByLabel('Subtítulo (opcional)')).toHaveValue('Come 1, pican 2. Bandeja de 25 cm.')
  await expect(form.getByLabel('Detalle o contenido (opcional)')).toContainText('Queso pategras')
  await form.getByLabel('Subtítulo (opcional)').fill('Para compartir')
  await form.getByLabel('Detalle o contenido (opcional)').fill('Quesos\nAceitunas')
  await form.getByRole('button', { name: 'Revisar cambios', exact: true }).click()
  await form.getByRole('button', { name: 'Confirmar y guardar', exact: true }).click()
  await expect(form).toHaveCount(0)
  expect(state.products.find(p => p.id === 41).details).toEqual(['Quesos', 'Aceitunas'])
  await page.goto('/')
  await page.getByRole('button').filter({ has: page.getByRole('heading', { name: 'PICADAS', exact: true }) }).click()
  await expect(page.getByText('Para compartir', { exact: true })).toBeVisible()
  await page.getByText('Ver detalle', { exact: true }).first().click()
  await expect(page.getByText('Aceitunas', { exact: true })).toBeVisible()
})

test('categoría: foto propia, compresión, publicación y restauración', async ({ page }) => {
  const state = await mockApi(page)
  await login(page)
  await page.getByText('Administrar categorías', { exact: true }).click()
  const editor = page.getByRole('region', { name: 'Foto de PICADAS', exact: true })
  await editor.getByLabel('Cambiar foto de PICADAS').setInputFiles({
    name: 'picada.jpeg', mimeType: 'image/jpeg', buffer: readFileSync(new URL('../../src/assets/picada-especial-2.jpeg', import.meta.url)),
  })
  await expect(editor.getByText(/todavía sin guardar/)).toBeVisible()
  await editor.getByRole('button', { name: 'Guardar foto' }).click()
  await expect(editor.getByText(/Foto guardada/)).toBeVisible()
  expect(state.uploads[0].path).toContain('/category-images/')
  expect(state.categories[0].image_path).toBeTruthy()
  await page.goto('/')
  const tile = page.getByRole('button').filter({ has: page.getByRole('heading', { name: 'PICADAS', exact: true }) })
  await expect(tile.getByRole('img')).toHaveAttribute('src', /category-images/)
  await page.goto('/#/admin')
  await page.getByText('Administrar categorías', { exact: true }).click()
  page.on('dialog', dialog => dialog.accept())
  await editor.getByRole('button', { name: 'Volver a la foto original' }).click()
  await expect(editor.getByText(/Foto guardada/)).toBeVisible()
  expect(state.categories[0].image_path).toBeNull()
})

test('pedido: revisa precios actuales y bloquea envío si falla el catálogo', async ({ page }) => {
  const state = await mockApi(page)
  await page.goto('/')
  await page.getByRole('button').filter({ has: page.getByRole('heading', { name: 'PICADAS', exact: true }) }).click()
  await page.getByRole('button', { name: 'Agregar', exact: true }).first().click()
  await page.getByLabel('Nombre:', { exact: true }).fill('Cliente')
  state.prices.find(p => p.id === 41).price = 26000
  await page.getByRole('button', { name: 'Enviar por WhatsApp' }).click()
  await expect(page.getByRole('alert')).toContainText('Se actualizaron productos o precios')
  expect(page.url()).toContain('127.0.0.1')
  state.failRead = true
  await page.getByRole('button', { name: 'Enviar por WhatsApp' }).click()
  await expect(page.getByRole('alert')).toContainText('No se envió el pedido')
  expect(page.url()).toContain('127.0.0.1')
})

test('recuperación: usa el enlace del proyecto actual', async ({ page }) => {
  await mockApi(page)
  await page.goto('/#/admin')
  await page.getByLabel('Correo', { exact: true }).fill('owner@example.com')
  const request = page.waitForRequest(r => r.url().includes('/recover'))
  await page.getByRole('button', { name: 'Olvidé mi contraseña' }).click()
  expect(new URL((await request).url()).searchParams.get('redirect_to')).toBe('http://127.0.0.1:4175/?admin=1&recovery=1')
  await expect(page.getByRole('status')).toContainText('recibirás un enlace')
})

test('recuperación: cambia contraseña y vuelve al panel', async ({ page }) => {
  await mockApi(page)
  await login(page)
  await expect(page.getByLabel('Buscar producto')).toBeVisible()
  await page.goto('/?admin=1&recovery=1')
  await page.getByLabel('Nueva contraseña').fill('new-test-password-123')
  await page.getByRole('button', { name: 'Guardar contraseña' }).click()
  await expect(page.getByText('Contraseña actualizada.')).toBeVisible()
  await expect(page.getByLabel('Buscar producto')).toBeVisible()
})

test('pedido: conserva entrega, pago y aclaraciones al abrir WhatsApp', async ({ page }) => {
  await mockApi(page)
  await page.route('https://wa.me/**', route => route.fulfill({ contentType: 'text/html', body: 'WhatsApp simulado' }))
  await page.goto('/')
  await page.getByRole('button').filter({ has: page.getByRole('heading', { name: 'PICADAS', exact: true }) }).click()
  await page.getByRole('button', { name: 'Agregar', exact: true }).first().click()
  await page.getByLabel('Nombre:', { exact: true }).fill('Cliente prueba')
  await page.getByRole('combobox', { name: 'Entrega:', exact: true }).selectOption('Envío a domicilio')
  await page.locator('#delivery-address').fill('Calle 123')
  await page.getByRole('combobox', { name: 'Forma de pago:', exact: true }).selectOption('Transferencia')
  await page.getByLabel('Aclaraciones:', { exact: true }).fill('Después de las 20')
  await page.getByRole('button', { name: 'Enviar por WhatsApp' }).click()
  await expect(page).toHaveURL(/^https:\/\/wa.me\//)
  const url = new URL(page.url())
  expect(url.pathname).toBe('/5493515435114')
  const message = url.searchParams.get('text')
  for (const value of ['Cliente prueba', 'Calle 123', 'Transferencia', 'Después de las 20', 'Picada Especial de Placeres para 2', '$24.000']) expect(message).toContain(value)
})
