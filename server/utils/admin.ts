// server/utils/admin.ts

// Проверяет admin-ключ из заголовка Authorization: Bearer <key>
// Ключ задаётся через env ADMIN_KEY (runtimeConfig.adminKey).
export const require_admin = (event: any) => {
  const config = useRuntimeConfig(event)
  const expected = config.adminKey

  if (!expected) {
    throw createError({ statusCode: 500, statusMessage: 'Admin key is not configured' })
  }

  const auth = getHeader(event, 'authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''

  if (!token || token !== expected) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
}
