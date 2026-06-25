import { computed } from 'vue';
import type { Properties } from 'csstype';

type CSSObject = Properties<string | number> & {
  [key: `:${string}`]: CSSObject;
  [key: `::${string}`]: CSSObject;
  [key: `@${string}`]: CSSObject;
  [key: string]: string | number | CSSObject | undefined;
};

function to_kebab(str: string): string {
  return str.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
}

function serialize(selector: string, styles: CSSObject): string {
  let css = '';
  let nested = '';
  
  for (const [key, value] of Object.entries(styles)) {
    if (value === undefined || value === null) continue;
    
    if (typeof value === 'object') {
      if (key.startsWith(':')) {
        nested += serialize(`${selector}${key}`, value);
      } else if (key.startsWith('@')) {
        nested += `${key} { ${serialize(selector, value)} }\n`;
      } else {
        nested += serialize(`${selector} ${key}`, value);
      }
    } else {
      css += `${to_kebab(key)}: ${typeof value === 'number' ? `${value}px` : value}; `;
    }
  }
  
  let result = '';
  if (css) result += `${selector} { ${css} }\n`;
  result += nested;
  return result;
}

let counter = 0;

export function use_css(styles: CSSObject | (() => CSSObject)) {
  const id = `gla-${counter++}`;
  const selector = `.${id}`;
  
  const resolved_styles = typeof styles === 'function' 
    ? computed(styles) 
    : computed(() => styles);
  
  const css_text = computed(() => serialize(selector, resolved_styles.value));
  
  // Инжектим через useHead — работает и на сервере, и на клиенте
  useHead({
    style: [
      {
        id,
        innerHTML: css_text.value
      }
    ]
  });
  
  return id;
}