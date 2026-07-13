// app/composables/use_admin.ts

// Хранит admin-ключ в sessionStorage и предоставляет заголовок для защищённых запросов.
const STORAGE_KEY = 'admin-key'

export const use_admin = () => {
  const key = useState<string | null>('admin-key', () => {
    if (import.meta.server) return null
    return sessionStorage.getItem(STORAGE_KEY) || null
  })

  const is_admin = computed(() => !!key.value)

  const set_key = (value: string) => {
    key.value = value
    if (import.meta.client) sessionStorage.setItem(STORAGE_KEY, value)
  }

  const clear = () => {
    key.value = null
    if (import.meta.client) sessionStorage.removeItem(STORAGE_KEY)
  }

  // Заголовок Authorization для защищённых эндпоинтов
  const auth_header = computed<Record<string, string>>(() =>
    key.value ? { Authorization: `Bearer ${key.value}` } : {}
  )

  return { key, is_admin, set_key, clear, auth_header }
}
