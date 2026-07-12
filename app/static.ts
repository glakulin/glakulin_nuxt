// Статические данные

// Тип ссылки
type Link = {
  label: string;
  href: string;
  icon: string;
};

// Список страниц
export const PAGES: Link[] = [
  { label: "home", href: "/", icon: "nf-md-home" },
  { label: "links", href: "/links", icon: "nf-fa-link" },
  { label: "table", href: "/table", icon: "nf-md-table" }
];

// Список соцсетей
export const SOCIALS: Link[] = [
  { label: "Telegram", href: "https://t.me/glakulin", icon: "nf-fa-telegram" },
  { label: "YouTube", href: "https://www.youtube.com/@glakulin", icon: "nf-md-youtube" },
  { label: "Twitch", href: "https://www.twitch.tv/glakulin", icon: "nf-md-twitch" },
  { label: "GitHub", href: "https://github.com/glakulin", icon: "nf-md-github" },
  { label: "Email", href: "mailto:danielglakulin@gmail.com", icon: "nf-md-at" },
  { label: "Donate", href: "https://web.tribute.tg/d/M59", icon: "nf-fa-hand_holding_dollar" }
];

// Карточки
type Card = {
  name: string,
  icon: string,
  description: string,
  group?: string,
  url: string,
  thumbnail?: string
};

// Иконки категорий
export const group_icons: Record<string, string> = {
  Markup: "nf-fa-code",
  Language: "nf-md-code_braces",
  Framework: "nf-md-cube_outline",
  Service: "nf-md-cog",
};

// Скиллы
export const SKILLS: Card[] = [
  {
    "name": "HTML",
    "icon": "nf-md-language_html5",
    "description": "Semantic markup and structure for web pages. Accessible, standards-compliant HTML serves as a solid foundation for styling and interactivity.",
    "group": "Markup",
    "url": "https://developer.mozilla.org/en-US/docs/Web/HTML"
  },
  {
    "name": "CSS",
    "icon": "nf-dev-css3",
    "description": "Styling, layout and responsive design. Flexbox, grid, custom properties and modern CSS features enable fluid interfaces that adapt to any screen size.",
    "group": "Markup",
    "url": "https://developer.mozilla.org/en-US/docs/Web/CSS"
  },
  {
    "name": "JavaScript",
    "icon": "nf-md-language_javascript",
    "description": "Client-side interactivity and logic. Modern ES features, DOM APIs and browser capabilities enable dynamic, responsive user experiences.",
    "group": "Language",
    "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript"
  },
  {
    "name": "TypeScript",
    "icon": "nf-dev-typescript",
    "description": "Typed JavaScript for safer, scalable code. Strict typing, generics and inference catch errors at compile time and improve long-term maintainability.",
    "group": "Language",
    "url": "https://www.typescriptlang.org/docs/"
  },
  {
    "name": "Vue",
    "icon": "nf-md-vuejs",
    "description": "Component-based UI framework. Reusable, reactive components with composables, slots and scoped styles create maintainable and expressive interfaces.",
    "group": "Framework",
    "url": "https://vuejs.org/"
  },
  {
    "name": "Nuxt",
    "icon": "nf-md-nuxt",
    "description": "Vue meta-framework for SSR and tooling. Nuxt provides server-side rendering, file-based routing, auto-imports and a streamlined developer experience out of the box.",
    "group": "Framework",
    "url": "https://nuxt.com/docs"
  },
  {
    "name": "Vercel",
    "icon": "nf-dev-vercel",
    "description": "Deployment and hosting platform. Vercel offers continuous integration, edge functions and preview deployments for fast, reliable and globally distributed delivery.",
    "group": "Service",
    "url": "https://vercel.com/docs"
  }
];

// Софт
export const SOFTWARE: Card[] = [
  {
    "name": "Windows 11",
    "icon": "nf-dev-windows11",
    "description": "Operating system with a modern interface, enhanced productivity features, built-in virtualization (WSL), and broad compatibility with development tools and applications.",
    "url": "https://www.microsoft.com/en-us/windows"
  },
  {
    "name": "VS Code",
    "icon": "nf-dev-vscode",
    "description": "Lightweight code editor with extensive extension ecosystem, integrated debugging, Git control, and terminal. Supports multiple languages and development workflows.",
    "url": "https://code.visualstudio.com/"
  },
  {
    "name": "bun",
    "icon": "nf-dev-bun",
    "description": "Fast all-in-one JavaScript/TypeScript runtime, package manager, and bundler. Built for speed, compatible with Node.js modules, and includes a built-in test runner.",
    "url": "https://bun.sh/"
  }
];


// Железо
type Hardware_Group = {
  title: string,
  icon: string,
  items: string[]
};

export const HARDWARE: Hardware_Group[] = [
  {
    title: "PC",
    icon: "nf-oct-cpu",
    items: [
      "ASUS P8H77-M LE",
      "Intel Core i5-3470",
      "Samsung DDR3 1600MHz 8GB(4+4)",
      "KFA2 GeForce GTX 1650 X Black",
      "HDD 250GB",
      "HDD 80GB",
      "CoolerMaster 600W"
    ]
  },
  {
    title: "Periphery",
    icon: "nf-md-headphones",
    items: [
      "Screens — (1920x1080)*2",
      "Microphone — Fifine Ampligame A6V",
      "Webcamera — Fifine K420",
      "Mouse — NERPA",
      "Keyboard — defender",
      "USB 32GB x2"
    ]
  }
];

// Проекты
export const PROJECTS: Card[] = [
  {
    name: "glakulin_nuxt",
    icon: "nf-md-nuxt",
    description: "Personal portfolio website built with Nuxt 4 and Vue 3. Custom CSS-in-JS atoms, minimalist flat design, responsive layout and a masonry-based skills grid.",
    group: "Web",
    url: "https://github.com/glakulin/glakulin_nuxt",
    thumbnail: "/projects/glakulin_nuxt.png"
  }
];