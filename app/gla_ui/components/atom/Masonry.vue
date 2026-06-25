<!-- Компонент кирпичной сетки -->

<script setup lang="ts">
import { get_nums, type Num_Values } from "~/gla_ui/tokens";
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";

const props = withDefaults(defineProps<{
  tag?: keyof HTMLElementTagNameMap; // HTML тег

  direction?: "vertical" | "horizontal"; // Направление
  columns?: number; // Колонки
  rows?: number; // Строки

  gap?: Num_Values; // Промежуток
  padding?: Num_Values; // Отступы
  radius?: Num_Values; // Скругление
}>(), {
  tag: "div",
  direction: "vertical",
  columns: 1,
  rows: 1,
  gap: () => [0] as Num_Values,
  padding: () => [0] as Num_Values,
  radius: () => [0] as Num_Values
});

const container = ref<HTMLElement | null>(null);
const containerHeight = ref(0);

const padding = computed(() => get_nums(props.padding));
const radius = computed(() => get_nums(props.radius));

const gapValue = computed(() => {
  return Array.isArray(props.gap) && props.gap.length > 0 ? props.gap[0] : 0;
});

let resizeObserver: ResizeObserver | null = null;

function layout() {
  if (!container.value) return;
  
  const items = Array.from(container.value.children) as HTMLElement[];
  if (items.length === 0) return;
  
  const containerWidth = container.value.offsetWidth;
  
  if (props.direction === "vertical") {
    // Вертикальный режим: одинаковая ширина, разная высота
    const count = props.columns;
    const columnWidth = (containerWidth - (count - 1) * gapValue.value) / count;
    
    // Шаг 1: Устанавливаем ширину всем элементам
    items.forEach((item) => {
      item.style.position = "absolute";
      item.style.width = `${columnWidth}px`;
    });
    
    // Шаг 2: Даём браузеру пересчитать размеры
    setTimeout(() => {
      const heights = new Array(count).fill(0);
      
      // Шаг 3: Расставляем элементы по колонкам
      items.forEach((item) => {
        const itemHeight = item.offsetHeight;
        
        // Находим колонку с минимальной высотой
        const minHeight = Math.min(...heights);
        const shortestCol = heights.indexOf(minHeight);
        
        // Вычисляем позицию
        const x = shortestCol * (columnWidth + gapValue.value);
        const y = heights[shortestCol];
        
        // Устанавливаем позицию
        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
        
        // Обновляем высоту колонки
        heights[shortestCol] += itemHeight + gapValue.value;
      });
      
      // Устанавливаем высоту контейнера
      containerHeight.value = Math.max(...heights) - gapValue.value;
    }, 0);
    
  } else {
    // Горизонтальный режим: одинаковая высота, разная ширина
    const count = props.rows;
    const rowHeight = items[0]!.offsetHeight || 100; // Fallback если высота 0
    
    // Шаг 1: Устанавливаем высоту всем элементам
    items.forEach((item) => {
      item.style.position = "absolute";
      item.style.height = `${rowHeight}px`;
    });
    
    // Шаг 2: Даём браузеру пересчитать размеры
    setTimeout(() => {
      const widths = new Array(count).fill(0);
      
      // Шаг 3: Расставляем элементы по строкам
      items.forEach((item) => {
        const itemWidth = item.offsetWidth;
        
        // Находим строку с минимальной шириной
        const minWidth = Math.min(...widths);
        const shortestRow = widths.indexOf(minWidth);
        
        // Вычисляем позицию
        const x = widths[shortestRow];
        const y = shortestRow * (rowHeight + gapValue.value);
        
        // Устанавливаем позицию
        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
        
        // Обновляем ширину строки
        widths[shortestRow] += itemWidth + gapValue.value;
      });
      
      // Устанавливаем высоту контейнера
      containerHeight.value = count * rowHeight + (count - 1) * gapValue.value;
    }, 0);
  }
}

onMounted(() => {
  // Ждём полной отрисовки
  setTimeout(() => {
    nextTick(() => {
      layout();
    });
  }, 100);
  
  // Следим за изменением размера контейнера
  if (container.value) {
    resizeObserver = new ResizeObserver(() => {
      layout();
    });
    resizeObserver.observe(container.value);
  }
});

onUnmounted(() => {
  resizeObserver?.disconnect();
});

// Перестраиваем при изменении props
watch(() => [props.columns, props.rows, props.direction], () => {
  nextTick(() => {
    layout();
  });
});

// Перестраиваем при добавлении/удалении элементов
watch(
  () => container.value?.children.length,
  () => {
    nextTick(() => {
      layout();
    });
  }
);
</script>

<template>
  <component
    :is="props.tag"
    ref="container"
    class="masonry"
    :style="{ height: `${containerHeight}px` }"
  >
    <slot />
  </component>
</template>

<style lang="scss" scoped>
.masonry {
  position: relative;
  padding: v-bind('padding');
  border-radius: v-bind('radius');
  
  & > * {
    transition: all 0.3s ease;
  }
}
</style>