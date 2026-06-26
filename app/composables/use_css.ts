import { computed, ref } from 'vue';
import { useHead } from '#app';
import type { Properties } from 'csstype';

type CSSObject = Properties<string | number> & {
  [key: `:${string}`]: CSSObject;
  [key: `::${string}`]: CSSObject;
  [key: `@${string}`]: CSSObject;
  [key: string]: string | number | CSSObject | undefined;
};

const UNITLESS_PROPS = new Set([
  'opacity', 'zIndex', 'fontWeight', 'lineHeight', 'flex', 
  'flexGrow', 'flexShrink', 'order', 'orphans', 'widows'
]);

function to_kebab(str: string): string {
  return str.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
}

function hash(str: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36).slice(0, 5);
}

function getAtomicClass(prop: string, value: string | number, context: string = '') {
  let cssValue = String(value);
  if (typeof value === 'number' && !UNITLESS_PROPS.has(prop)) {
    cssValue = `${value}px`;
  }
  
  const kebabProp = to_kebab(prop);
  const key = `${context}|${kebabProp}|${cssValue}`;
  const className = hash(key);
  
  const escapedContext = context.replace(/:/g, '\\:');
  const fullClassName = `${escapedContext}gla-${className}`;
  
  const selector = `.${fullClassName}${context}`;
  const css = `${selector} { ${kebabProp}: ${cssValue}; }`;
  
  return { className: fullClassName, css };
}

function processAtomic(styles: CSSObject, context: string = '') {
  const classes: string[] = [];
  const cssRules: string[] = [];
  
  for (const [key, value] of Object.entries(styles)) {
    if (value === undefined || value === null) continue;
    
    if (typeof value === 'object') {
      if (key.startsWith(':') || key.startsWith('::')) {
        const nested = processAtomic(value, context + key);
        classes.push(...nested.classes);
        cssRules.push(...nested.cssRules);
      } else if (key.startsWith('@')) {
        const nested = processAtomic(value, context);
        classes.push(...nested.classes);
        cssRules.push(`${key} { ${nested.cssRules.join(' ')} }`);
      } else {
        const nested = processAtomic(value, context + ' ' + key);
        classes.push(...nested.classes);
        cssRules.push(...nested.cssRules);
      }
    } else {
      const atomic = getAtomicClass(key, value, context);
      classes.push(atomic.className);
      cssRules.push(atomic.css);
    }
  }
  
  return { classes, cssRules };
}

// Глобальное хранилище
const globalCssRules = new Set<string>();
const styleVersion = ref(0);

export function use_css(styles: CSSObject | (() => CSSObject)) {
  const resolved_styles = typeof styles === 'function' 
    ? computed(styles) 
    : computed(() => styles);
  
  const classList = computed(() => {
    const { classes, cssRules } = processAtomic(resolved_styles.value);
    
    for (const rule of cssRules) {
      if (!globalCssRules.has(rule)) {
        globalCssRules.add(rule);
        styleVersion.value++;
      }
    }
    
    return classes.join(' ');
  });

  // Вызываем useHead прямо здесь. Unhead возьмет на себя счетчик ссылок
  useHead({
    style: computed(() => {
      const v = styleVersion.value; 
      return [{
        id: 'gla-atomic-registry',
        innerHTML: Array.from(globalCssRules).join('\n')
      }];
    })
  });

  return classList;
}