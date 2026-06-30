import { computed } from "vue";
import type { CSSProperties } from "vue";
import { get_rem } from "~/utilities";

// Значения css
export type Css_Value = string | number | null | undefined | false;
export type Css_Pseudo = `:${string}` | "hover" | "focus" | "active" | "visited" | "disabled" | "checked" | "focusVisible" | "focusWithin";
export type Css_Rule = {
  [key in keyof CSSProperties]?: CSSProperties[key] | Css_Value;
} & {
  [key in Css_Pseudo]?: Css_Rule;
};

// Настройки
const STYLE_ID = "use-css";
const UNITLESS_PROPERTIES = new Set([
  "animation-iteration-count",
  "aspect-ratio",
  "border-image-outset",
  "border-image-slice",
  "border-image-width",
  "box-flex",
  "box-flex-group",
  "box-ordinal-group",
  "column-count",
  "columns",
  "flex",
  "flex-grow",
  "flex-positive",
  "flex-shrink",
  "flex-negative",
  "flex-order",
  "grid-area",
  "grid-column",
  "grid-column-end",
  "grid-column-start",
  "grid-row",
  "grid-row-end",
  "grid-row-start",
  "line-clamp",
  "line-height",
  "opacity",
  "order",
  "orphans",
  "scale",
  "tab-size",
  "widows",
  "z-index",
  "zoom"
]);

// Хэширование строки
const get_hash = (value: string): string => {
  let hash = 2166136261;

  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(36);
};

// Свойство в css формат
const get_css_property = (value: string): string => {
  return value.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
};

// Значение в css формат
const get_css_value = (property: string, value: string | number): string => {
  if (typeof value === "number") {
    return value === 0 || UNITLESS_PROPERTIES.has(property)
      ? String(value)
      : get_rem(value);
  }

  return value;
};

// Ключ правила
const get_rule_key = (selector: string, property: string, value: string): string => {
  return `${selector}|${property}:${value}`;
};

// Селектор псевдо
const get_selector = (value: string): string => {
  return value.startsWith(":")
    ? value
    : `:${get_css_property(value)}`;
};

// Имя класса
const get_class_name = (rule_key: string): string => {
  return `gla_${get_hash(rule_key)}`;
};

// Css правило
const get_rule = (class_name: string, selector: string, property: string, value: string): string => {
  return `.${class_name}${selector}{${property}:${value}}`;
};

// Получение style sheet
const get_style_sheet = (): CSSStyleSheet | null => {
  let element = document.getElementById(STYLE_ID) as HTMLStyleElement | null;

  if (!element) {
    element = document.createElement("style");
    element.id = STYLE_ID;
    document.head.appendChild(element);
  }

  return element.sheet;
};

// Вставка правила в css
const insert_rule = (rule: string): void => {
  const style_sheet = get_style_sheet();

  if (!style_sheet) {
    return;
  }

  style_sheet.insertRule(rule, style_sheet.cssRules.length);
};

// Css-in-js
export const use_css = () => {
  const rules = useState<Record<string, string>>("use_css_rules", () => ({}));
  const css_text = computed(() => Object.values(rules.value).join(""));

  useHead({
    style: [
      {
        id: STYLE_ID,
        textContent: css_text
      }
    ]
  });

  // Вставка атомарного правила
  const insert_css_rule = (class_names: string[], selector: string, property: string, value: string): void => {
    const rule_key = get_rule_key(selector, property, value);
    const class_name = get_class_name(rule_key);
    const cached_rule = rules.value[rule_key];

    class_names.push(class_name);

    if (cached_rule) {
      return;
    }

    const rule = get_rule(class_name, selector, property, value);

    rules.value[rule_key] = rule;

    if (import.meta.client) {
      insert_rule(rule);
    }
  };

  // Вставка объекта стилей
  const insert_css_rules = (class_names: string[], css_rule: Css_Rule, selector = ""): void => {
    for (const [raw_property, raw_value] of Object.entries(css_rule)) {
      if (raw_value === null || raw_value === undefined || raw_value === false) {
        continue;
      }

      if (typeof raw_value === "object") {
        insert_css_rules(class_names, raw_value as Css_Rule, `${selector}${get_selector(raw_property)}`);
        continue;
      }

      const property = get_css_property(raw_property);
      const value = get_css_value(property, raw_value);

      insert_css_rule(class_names, selector, property, value);
    }
  };

  return (css_rule: Css_Rule): string => {
    const class_names: string[] = [];
    
    insert_css_rules(class_names, css_rule);

    return class_names.join(" ");
  };
};
