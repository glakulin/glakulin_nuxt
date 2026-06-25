import { ref, onMounted, onUnmounted } from 'vue';

export function use_window_size() {
  const width = ref(typeof window !== 'undefined' ? window.innerWidth : 0);
  const height = ref(typeof window !== 'undefined' ? window.innerHeight : 0);

  onMounted(() => {
    // Обновляем на случай гидратации
    width.value = window.innerWidth;
    height.value = window.innerHeight;

    function update() {
      width.value = window.innerWidth;
      height.value = window.innerHeight;
    }

    window.addEventListener('resize', update);

    onUnmounted(() => {
      window.removeEventListener('resize', update);
    });
  });

  return { width, height };
}