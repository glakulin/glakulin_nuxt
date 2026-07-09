<!-- Главная страница -->

<script setup lang="ts">
import { Flex, Grid, Icon, Text } from '~/components/atoms';
import { Section } from '~/components/molecules';
import Masonry from '~/components/molecules/Masonry.vue';
import { TOKENS } from '~/tokens';
import { get_color, get_rem } from '~/utilities';

// Карточки
type Card = {
  name: string,
  icon: string,
  description: string,
  group?: string,
  url: string
};

// Иконки категорий
const group_icons: Record<string, string> = {
  Markup: "nf-fa-code",
  Language: "nf-md-code_braces",
  Framework: "nf-md-cube_outline",
  Service: "nf-md-cog",
};

// Скиллы
const skills: Card[] = [
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
const software: Card[] = [
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
]


// Железо
type Hardware_Group = {
  title: string,
  icon: string,
  items: string[]
};

const hardware_groups: Hardware_Group[] = [
  {
    title: "Base",
    icon: "nf-oct-cpu",
    items: [
      "ASUS P8H77-M LE",
      "Intel Core i5-3470",
      "Samsung DDR3 1600MHz 8GB(4+4)",
      "KFA2 GeForce GTX 1650 X Black"
    ]
  },
  {
    title: "Storage",
    icon: "nf-md-harddisk",
    items: [
      "HDD 250GB",
      "HDD 80GB",
      "USB 32GB x2"
    ]
  },
  {
    title: "Periphery",
    icon: "nf-md-headphones",
    items: [
      "Screens — (1920x1080)*2",
      "Microphone — Fifine Ampligame A6V",
      "Webcamera — Fifine K420"
    ]
  }
]


// Адаптив
const { size } = use_window_size();
type Adaptive = {
  skill_columns: number
};
const adaptive = computed<Adaptive>(() => {
  let skill_columns: number;

  switch (size.value) {
    case "xl":
      skill_columns = 3;
      break;

    case "lg":
      skill_columns = 3;
      break;

    case "md":
      skill_columns = 2;
      break;

    case "sm":
      skill_columns = 2;
      break;

    case "xs":
      skill_columns = 1;
      break;

    default:
      skill_columns = 1;
  }

  return {
    skill_columns
  }
});
</script>

<template>
  <!-- Приветствие -->
  <Section anchor="hello">
    <template #heading>
      <Icon name="nf-md-hand_wave" />Hello
    </template>
    <Flex direction="column" :gap="24">
      <Flex :gap="16">
        <Flex direction="column">
          <Text tag="h2" family="heading" size="md">I'm Glakulin</Text>
          <Text tag="h6" family="body" size="default" color="gray_5">Daniel Vyakulin</Text>
        </Flex>
        <svg height="60" width="60">
          <use href="/logo.svg"></use>
        </svg>
      </Flex>
      <Flex direction="column" :gap="6">
        <Text tag="p" family="body" size="sm">
          UX/UI designer and developer. I stream games on
          <Icon name="nf-fa-twitch" /> Twitch and upload videos to
          <Icon name="nf-fa-youtube" />YouTube.
          I’m 18 years old; I was born in Russia and currently live there. I’m studying IT at a college.
          I want to grow in this field by learning different tools, honing my skills, and working on various projects.
        </Text>
        <Text tag="p" family="body" size="sm">
          On this website, you can find out what I can do and what projects I've completed or am currently working on.
        </Text>
      </Flex>
    </Flex>
  </Section>

  <!-- Скиллы -->
  <Section anchor="skills">
    <template #heading>
      <Icon name="nf-fa-toolbox" />Skills
    </template>
    <Masonry mode="vertical" :columns="adaptive.skill_columns" :gap="32">
      <Flex v-for="skill in skills" tag="a" :href="skill.url" target="_blank" rel="noopener noreferrer"
        direction="column" :gap="12" :padding="16" :css="{
          '--color-icon': get_color('gray_8'),
          position: 'relative',
          overflow: 'hidden',
          border: `${get_rem(2)} solid ${get_color('gray_8')}`,
          hover: {
            '--color-icon': get_color('accent_2'),
            borderColor: get_color('accent_2')
          },

          cursor: 'pointer',
          transition: `border-color ${TOKENS.transition}`
        }">
        <Text family="heading" size="default">
          <Flex :gap="8">
            <Icon :name="skill.icon" />{{ skill.name }}
          </Flex>
        </Text>
        <Text family="body" size="xs">{{ skill.description }}</Text>
        <Text family="body" size="default" color="accent_2">{{ skill.group }}</Text>
        <Icon :name="group_icons[skill.group!]" :css="{
          position: 'absolute',
          right: 16,
          top: 16,
          fontSize: 64,
          color: 'var(--color-icon)',
          pointerEvents: 'none',
          filter: 'blur(2px)',
          zIndex: -1,
          transition: `color ${TOKENS.transition}`
        }" />
      </Flex>
    </Masonry>

    <!-- Софт -->
    <Flex direction="column" :gap="40">
      <Text family="heading" size="md">Software</Text>
      <Masonry mode="vertical" :columns="adaptive.skill_columns" :gap="32">
        <Flex v-for="skill in software" tag="a" :href="skill.url" target="_blank" rel="noopener noreferrer"
          direction="column" :gap="12" :padding="16" :css="{
            position: 'relative',
            overflow: 'hidden',
            border: `${get_rem(2)} solid ${get_color('gray_8')}`,
            hover: {
              borderColor: get_color('accent_2')
            },

            cursor: 'pointer',
            transition: `border-color ${TOKENS.transition}`
          }">
          <Text family="heading" size="default">
            <Flex :gap="8">
              <Icon :name="skill.icon" />{{ skill.name }}
            </Flex>
          </Text>
          <Text family="body" size="xs">{{ skill.description }}</Text>
        </Flex>
      </Masonry>
    </Flex>

    <!-- Железо -->
    <Flex direction="column" :gap="40">
      <Text family="heading" size="md">Hardware</Text>
      <Flex direction="column" :gap="32">
        <Flex v-for="group in hardware_groups" :key="group.title" direction="column" :gap="16">
          <Flex :gap="12" align_items="flex-end">
            <Text family="heading" size="default">
              <Flex :gap="12">
                <Icon :name="group.icon" />{{ group.title }}
              </Flex :gap="12">
            </Text>
            <Flex :css="{
              flex: 1,
              height: get_rem(2),
              background: get_color('gray_8')
            }" />
          </Flex>

          <Flex :gap="10" :css="{ flexWrap: 'wrap' }">
            <Flex v-for="item in group.items" :key="item" tag="div" :padding="8" :css="{
              background: get_color('gray_9'),
              border: `${get_rem(1)} solid ${get_color('gray_8')}`
            }">
              <Text family="body" size="xs" color="gray_3">{{ item }}</Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  </Section>
</template>