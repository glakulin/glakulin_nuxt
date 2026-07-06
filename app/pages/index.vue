<!-- Главная страница -->

<script setup lang="ts">
import { Flex, Icon, Style, Text } from '~/components/atoms';
import { Section } from '~/components/molecules';
import Masonry from '~/components/molecules/Masonry.vue';
import { TOKENS } from '~/tokens';
import { get_rem } from '~/utilities';

// Скиллы
type Skill = {
  name: string,
  icon: string,
  description: string,
  group: string
}

const skills: Skill[] = [
  {
    name: "HTML",
    icon: "nf-md-language_html5",
    description: "Semantic markup and structure for web pages. I write accessible, standards-compliant HTML that serves as a solid foundation for styling and interactivity.",
    group: "Markup"
  },
  {
    name: "CSS",
    icon: "nf-dev-css3",
    description: "Styling, layout and responsive design. I work with flexbox, grid, custom properties and modern CSS features to build fluid interfaces that adapt to any screen size.",
    group: "Markup"
  },
  {
    name: "JavaScript",
    icon: "nf-md-language_javascript",
    description: "Client-side interactivity and logic. I use modern ES features, DOM APIs and browser capabilities to build dynamic, responsive user experiences.",
    group: "Language"
  },
  {
    name: "TypeScript",
    icon: "nf-dev-typescript",
    description: "Typed JavaScript for safer, scalable code. I leverage strict typing, generics and inference to catch errors at compile time and improve long-term maintainability.",
    group: "Language"
  },
  {
    name: "Vue",
    icon: "nf-md-vuejs",
    description: "Component-based UI framework. I build reusable, reactive components with composables, slots and scoped styles to create maintainable and expressive interfaces.",
    group: "Framework"
  },
  {
    name: "Nuxt",
    icon: "nf-md-nuxt",
    description: "Vue meta-framework for SSR and tooling. I use Nuxt for server-side rendering, file-based routing, auto-imports and a streamlined developer experience out of the box.",
    group: "Framework"
  },
  {
    name: "Vercel",
    icon: "nf-dev-vercel",
    description: "Deployment and hosting platform. I deploy projects with continuous integration, edge functions and preview deployments for fast, reliable and globally distributed delivery.",
    group: "Service"
  }
]

// Адаптив
const { size } = use_window_size();
type Adaptive = {
  skill_columns: number
}

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
  <Section>
    <template #heading>
      <Icon name="nf-md-hand_wave" />Hello
    </template>
    <Flex direction="column" :gap="24">
      <Flex :gap="16">
        <Flex direction="column">
          <Text tag="h2" family="heading" size="sm">I'm Glakulin</Text>
          <Text tag="h6" family="body" size="default" color="gray_5">Daniel Vyakulin</Text>
        </Flex>
        <Style tag="img" src="/logo.svg" :css="{ width: 'auto', height: get_rem(60) }" />
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
  <Section>
    <template #heading><Icon name="nf-fa-toolbox" />Skills</template>
    <Masonry mode="vertical" :columns="adaptive.skill_columns" :gap="32">
      <Flex
        v-for="skill in skills"
        direction="column"
        :gap="12"
        :padding="16"
        :radius="6"
        :css="{
          border: `${get_rem(2)} solid ${TOKENS.colors.gray[8]}`
        }"
      >
        <Text family="heading" size="default">
          <Flex :gap="8"><Icon :name="skill.icon" />{{ skill.name }}</Flex>
        </Text>
        <Text family="body" size="xs">{{ skill.description }}</Text>
        <Text family="body" size="default" color="accent_2">{{ skill.group }}</Text>
      </Flex>  
    </Masonry>  
  </Section>
</template>