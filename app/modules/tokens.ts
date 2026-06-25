import { defineNuxtModule, addTemplate } from 'nuxt/kit';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// 1. Возвращаем массив строк вместо конкатенации (быстрее для больших объектов)
function generateCssVariables(obj: Record<string, any>, prefix = ''): string[] {
  const lines: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const varName = prefix ? `${prefix}-${key}` : key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      lines.push(...generateCssVariables(value, varName));
    } else {
      let cssValue = String(value); // Базовое приведение
      
      // 2. УМНАЯ эвристика для px: 
      // Добавляем px только если это целое число или число больше 1.
      // Значения от 0 до 1 (0.5, 0.75) — это 99% opacity, line-height, scale.
      if (typeof value === 'number') {
        cssValue = (value >= 1) ? `${value}px` : String(value);
      }

      lines.push(`  --${varName}: ${cssValue};`);
    }
  }

  return lines;
}

export default defineNuxtModule({
  meta: {
    name: 'design-tokens'
  },
  setup(options, nuxt) {
    const tokensPath = resolve(nuxt.options.rootDir, 'app/gla_ui/tokens.json');

    // 3. Добавляем watcher для HMR (обновление при изменении JSON в dev-режиме)
    if (nuxt.options.watch) {
      nuxt.options.watch.push(tokensPath);
    }

    // 4. Безопасное чтение файла
    let tokens;
    try {
      tokens = JSON.parse(readFileSync(tokensPath, 'utf-8'));
    } catch (error) {
      console.warn(`[design-tokens] Файл ${tokensPath} не найден или поврежден. CSS переменные не сгенерированы.`);
      return; // Прерываем выполнение модуля, Nuxt продолжит работу
    }

    // 5. Генерация CSS через join (быстрее, чем += в цикле)
    const cssLines = generateCssVariables(tokens);
    const cssContent = `:root {\n${cssLines.join('\n')}\n}\n`;

    // 6. Правильное использование addTemplate
    const template = addTemplate({
      filename: 'design-tokens.css',
      getContents: () => cssContent
    });

    // 7. Берем точный путь из результата addTemplate, а не хардкодим
    nuxt.options.css.unshift(template.dst);
  }
});