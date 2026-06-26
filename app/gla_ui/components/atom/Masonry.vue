<!-- Компонент кирпичной сетки -->

<script setup lang="ts">
import { get_nums, type Num_Values } from "~/gla_ui/tokens";

// Свойства
const props = withDefaults(defineProps<{
  tag?: keyof HTMLElementTagNameMap; // HTML тег
  direction?: "vertical" | "horizontal"; // Направление (вертикальное/горизонтальное)
  columns?: number; // Количество колонок (для vertical)
  rows?: number; // Количество строк (для horizontal)
  gap?: Num_Values; // Промежуток
  padding?: Num_Values; // Отступы
  radius?: Num_Values; // Скругление
}>(), {
  // Значения по умолчанию
  tag: "div",
  direction: "vertical",
  columns: 1,
  rows: 1,
  gap: () => [0] as Num_Values,
  padding: () => [0] as Num_Values,
  radius: () => [0] as Num_Values
});

// Реактивные переменные
const container = ref<HTMLElement | null>(null); // Ссылка на DOM контейнер
const container_height = ref(0); // Вычисленная высота контейнера

// Стили контейнера
const container_styles = use_css({
  height: container_height.value > 0 ? `${container_height.value}px` : undefined,
  padding: get_nums(props.padding),
  borderRadius: get_nums(props.radius),
  position: "relative"
});

// Вычисляем значение gap в rem
const gap_value = computed(() => {
  return Array.isArray(props.gap) && props.gap.length > 0 ? props.gap[0] : 0;
});

// Observer'ы для отслеживания изменений
let resize_observer: ResizeObserver | null = null; // Следит за изменением размера контейнера
let mutation_observer: MutationObserver | null = null; // Следит за добавлением/удалением дочерних элементов
let timeout_id: number | null = null; // ID таймера для debounce

// Функция для поиска индекса минимального значения (быстрее чем Math.min(...arr))
function get_min_index(arr: number[]): number {
  let min_idx = 0;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i]! < arr[min_idx]!) min_idx = i;
  }
  return min_idx;
}

// Основная функция раскладки элементов
function layout() {
  if (!container.value) return;
  
  const items = Array.from(container.value.children) as HTMLElement[];
  if (items.length === 0) {
    container_height.value = 0;
    return;
  }
  
  const gap = gap_value.value;
  const container_width = container.value.offsetWidth;
  
  if (container_width === 0) {
    // Контейнер ещё не отрендерился, пробуем позже
    setTimeout(layout, 50);
    return;
  }

  if (props.direction === "vertical") {
    // ВЕРТИКАЛЬНЫЙ РЕЖИМ: одинаковая ширина, разная высота
    const cols = props.columns;
    const col_width = (container_width - (cols - 1) * gap) / cols;
    
    if (col_width <= 0) return;
    
    // ШАГ 1: Устанавливаем ширину всем элементам
    items.forEach((item) => {
      item.style.position = "absolute";
      item.style.width = `${col_width}px`;
      item.style.left = "0";
      item.style.top = "0";
    });
    
    // ШАГ 2: Принудительно вызываем reflow
    items.forEach(item => item.offsetWidth);
    
    // ШАГ 3: Читаем размеры через getBoundingClientRect
    const heights = new Array(cols).fill(0);
    
    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const item_height = rect.height;
      
      if (item_height === 0) {
        console.warn('Masonry: элемент имеет высоту 0', item);
        return;
      }
      
      // Находим самую короткую колонку
      const shortest_col = get_min_index(heights);
      const x = shortest_col * (col_width + gap);
      const y = heights[shortest_col];
      
      // Устанавливаем позицию
      item.style.left = `${x}px`;
      item.style.top = `${y}px`;
      
      // Обновляем высоту колонки
      heights[shortest_col] += item_height + gap;
    });
    
    // Устанавливаем высоту контейнера
    container_height.value = Math.max(...heights) - gap;
    
  } else {
    // ГОРИЗОНТАЛЬНЫЙ РЕЖИМ: одинаковая высота, разная ширина
    const rows = props.rows;
    const first_item = items[0]!;
    first_item.style.position = "absolute";
    first_item.style.left = "0";
    first_item.style.top = "0";
    
    // Берём высоту первого элемента как эталон
    const rowHeight = first_item.getBoundingClientRect().height || 100;
    
    const widths = new Array(rows).fill(0);
    
    items.forEach((item) => {
      item.style.position = "absolute";
      item.style.height = `${rowHeight}px`;
      item.style.left = "0";
      item.style.top = "0";

      const item_width = item.getBoundingClientRect().width;
      
      // Находим самую узкую строку
      const shortest_row = get_min_index(widths);
      
      const x = widths[shortest_row];
      const y = shortest_row * (rowHeight + gap);
      
      // Устанавливаем позицию
      item.style.left = `${x}px`;
      item.style.top = `${y}px`;
      
      // Обновляем ширину строки
      widths[shortest_row] += item_width + gap;
    });
    
    // Устанавливаем высоту контейнера
    container_height.value = rows * rowHeight + (rows - 1) * gap;
  }
}

// Debounce для раскладки (не чаще 1 раза за 50ms)
function schedule_layout() {
  if (timeout_id) clearTimeout(timeout_id);
  timeout_id = window.setTimeout(() => {
    layout();
    timeout_id = null;
  }, 50);
}

// Инициализация при монтировании
onMounted(() => {
  if (!container.value) return;
  
  // Начальная задержка для полной отрисовки
  setTimeout(() => {
    layout();
  }, 100);
  
  // Следим за изменением размера контейнера
  resize_observer = new ResizeObserver(schedule_layout);
  resize_observer.observe(container.value);
  
  // Следим за изменениями в DOM (добавление/удаление элементов)
  mutation_observer = new MutationObserver(schedule_layout);
  mutation_observer.observe(container.value, { childList: true });
});

// Очистка при размонтировании
onUnmounted(() => {
  resize_observer?.disconnect();
  mutation_observer?.disconnect();
  if (timeout_id) clearTimeout(timeout_id);
});

// Перестраиваем раскладку при изменении ключевых props
watch(
  () => [props.columns, props.rows, props.direction, gap_value.value],
  schedule_layout,
  { deep: true }
);
</script>

<template>
  <component
    :is="props.tag"
    ref="container"
    class="container_styles"
  >
    <slot />
  </component>
</template>