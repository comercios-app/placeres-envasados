import { test, expect } from '@playwright/test'
import { mockApi, login } from './helpers.mjs'

test('administrador: ingreso, revisión, guardado y restauración desde celular', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  const state = await mockApi(page)
  await login(page)
  await page.getByLabel('Buscar producto').fill('Coca Zero 1,5 Descartable')
  await page.getByLabel('Precio de Coca Zero 1,5 Descartable', { exact: true }).fill('27000')
  await page.getByRole('button', { name: 'Revisar cambios' }).click()
  expect(state.saved).toHaveLength(0)
  await expect(page.getByRole('region', { name: 'Revisión de precios' })).toContainText('27.000')
  await page.getByRole('button', { name: 'Guardar precios', exact: true }).click()
  await expect(page.getByText('Precios guardados.', { exact: false })).toBeVisible()
  expect(state.saved[0]).toEqual([{ id: 3, price: 27000, expected_version: 1 }])
  await page.getByRole('button', { name: /Restaurar/ }).click()
  await page.getByRole('button', { name: 'Revisar cambios' }).click()
  await page.getByRole('button', { name: 'Guardar precios', exact: true }).click()
  await expect(page.getByLabel('Precio de Coca Zero 1,5 Descartable', { exact: true })).toHaveValue('4900')
  expect(state.saved[1]).toEqual([{ id: 3, price: 4900, expected_version: 2 }])
  await page.getByRole('button', { name: 'Cerrar sesión' }).click()
  await expect(page.getByRole('button', { name: 'Ingresar', exact: true })).toBeVisible()
})

test('usuario sin permiso no recibe editor', async ({ page }) => {
  await mockApi(page, { allowed: false })
  await login(page)
  await expect(page.getByText(/Tu cuenta no tiene acceso/)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Revisar cambios' })).toHaveCount(0)
})

test('conflicto conserva edición y pide recargar', async ({ page }) => {
  await mockApi(page, { conflict: true })
  await login(page)
  await page.getByLabel('Precio de Coca Zero 1,5 Descartable', { exact: true }).fill('3500')
  await page.getByRole('button', { name: 'Revisar cambios' }).click()
  await page.getByRole('button', { name: 'Guardar precios', exact: true }).click()
  await expect(page.getByText(/Otro dispositivo cambió un precio/)).toBeVisible()
  await expect(page.getByLabel('Precio de Coca Zero 1,5 Descartable', { exact: true })).toHaveValue('3500')
})

