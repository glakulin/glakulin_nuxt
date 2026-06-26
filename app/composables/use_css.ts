import { computed, ref } from 'vue';
import { useHead } from '#app';
import type { Properties } from 'csstype';

type CSS_Object = Properties<string | number> & {
  [key: `:${string}`]: CSS_Object;
  [key: `::${string}`]: CSS_Object;
  [key: `@${string}`]: CSS_Object;
  [key: string]: string | number | CSS_Object | undefined;
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

function get_atomic_class(prop: string, value: string | number, context: string = '') {
  let css_value = String(value);
  if (typeof value === 'number' && !UNITLESS_PROPS.has(prop)) {
    css_value = `${value}px`;
  }
  
  const kebab_prop = to_kebab(prop);
  const key = `${context}|${kebab_prop}|${css_value}`;
  const class_name = hash(key);
  
  const full_class_name = `gla-${class_name}`;
  
  const selector = `.${full_class_name}${context}`;
  const css = `${selector} { ${kebab_prop}: ${css_value}; }`;
  
  return { className: full_class_name, css };
}

function process_atomic(styles: CSS_Object, context: string = '') {
  const classes: string[] = [];
  const css_rules: string[] = [];
  
  for (const [key, value] of Object.entries(styles)) {
    if (value === undefined || value === null) continue;
    
    if (typeof value === 'object') {
      if (key.startsWith(':') || key.startsWith('::')) {
        const nested = process_atomic(value, context + key);
        classes.push(...nested.classes);
        css_rules.push(...nested.css_rules);
      } else if (key.startsWith('@')) {
        const nested = process_atomic(value, context);
        classes.push(...nested.classes);
        css_rules.push(`${key} { ${nested.css_rules.join(' ')} }`);
      } else {
        const nested = process_atomic(value, context + ' ' + key);
        classes.push(...nested.classes);
        css_rules.push(...nested.css_rules);
      }
    } else {
      const atomic = get_atomic_class(key, value, context);
      classes.push(atomic.className);
      css_rules.push(atomic.css);
    }
  }
  
  return { classes, css_rules };
}

// Глобальное хранилище
const global_css_rules = new Set<string>();
const style_version = ref(0);

export function use_css(styles: CSS_Object | (() => CSS_Object)) {
  const resolved_styles = typeof styles === 'function' 
    ? computed(styles) 
    : computed(() => styles);
  
  const class_list = computed(() => {
    const { classes, css_rules } = process_atomic(resolved_styles.value);
    
    for (const rule of css_rules) {
      if (!global_css_rules.has(rule)) {
        global_css_rules.add(rule);
        style_version.value++;
      }
    }
    
    return classes.join(' ');
  });

  // Вызываем useHead прямо здесь. Unhead возьмет на себя счетчик ссылок
  useHead({
    style: computed(() => {
      const v = style_version.value; 
      return [{
        id: 'gla_atomic_registry',
        innerHTML: Array.from(global_css_rules).join('\n')
      }];
    })
  });

  return class_list;
}