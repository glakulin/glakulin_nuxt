// Хук для отслеживания размера окна

import { computed, onBeforeUnmount, onMounted, ref, type ComputedRef, type Ref } from "vue";
import { type Size } from "~/tokens";
import { get_size } from "~/utilities";

// Размер окна
export const use_window_size = () => {
  const width: Ref<number> = ref(0);
  const height: Ref<number> = ref(0);
  const size: ComputedRef<Size> = computed(() => get_size(width.value));

  const update = () => {
    if (import.meta.client) {
      width.value = window.innerWidth;
      height.value = window.innerHeight;
    }
  };

  onMounted(() => {
    update();
    window.addEventListener("resize", update);
  });

  onBeforeUnmount(() => {
    if (import.meta.client) {
      window.removeEventListener("resize", update);
    }
  });

  return { width, height, size };
};
