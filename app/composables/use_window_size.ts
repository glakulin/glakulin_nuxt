import { ref, onMounted, onUnmounted } from 'vue';

export function use_window_size() {
  // 1. Сохраняем дефолтное значение в константу
  const INITIAL_SIZE = typeof window !== 'undefined' ? window.innerWidth : 0;
  
  // 2. Инициализируем ref этим значением
  const width = ref(INITIAL_SIZE);
  const height = ref(typeof window !== 'undefined' ? window.innerHeight : 0);

  onMounted(() => {
    // 3. МАГИЯ ГИДРАТАЦИИ: 
    // Мы временно сбрасываем значение на дефолтное, а затем назначаем реальное.
    // Это заставляет Vue invalidate (сбросить кэш) у ВСЕХ computed, 
    // которые зависят от width.value, даже если они уже посчитались на сервере.
    width.value = INITIAL_SIZE;
    height.value = typeof window !== 'undefined' ? window.innerHeight : 0;

    let rafId: number | null = null;

    function handleResize() {
      if (rafId !== null) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;

        if (width.value !== newWidth) width.value = newWidth;
        if (height.value !== newHeight) height.value = newHeight;

        rafId = null;
      });
    }

    window.addEventListener('resize', handleResize, { passive: true });

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
      if (rafId !== null) cancelAnimationFrame(rafId);
    });
  });

  return { width, height };
}