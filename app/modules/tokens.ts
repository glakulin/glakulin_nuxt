// modules/tokens.ts by Qwen
import { defineNuxtModule, addTemplate } from 'nuxt/kit';
import { readFileSync } from 'fs';
import { resolve } from 'path';

function generateCssVariables(obj: any, prefix = ''): string {
  let css = '';

  for (const [key, value] of Object.entries(obj)) {
    const varName = prefix ? `${prefix}-${key}` : key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      css += generateCssVariables(value, varName);
    } else {
      const cssValue = typeof value === 'number' ? `${value}px` : value;
      css += `  --${varName}: ${cssValue};\n`;
    }
  }

  return css;
}

export default defineNuxtModule({
  meta: {
    name: 'design-tokens'
  },
  setup(options, nuxt) {
    const tokensPath = resolve(nuxt.options.rootDir, 'app/gla_ui/tokens.json');
    const tokens = JSON.parse(readFileSync(tokensPath, 'utf-8'));

    const cssContent = `:root {\n${generateCssVariables(tokens)}}\n`;

    addTemplate({
      filename: 'design-tokens.css',
      write: true,
      getContents: () => cssContent
    });

    nuxt.options.css.unshift('#build/design-tokens.css');
  }
});
