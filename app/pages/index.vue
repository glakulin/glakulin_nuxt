<!-- Главная страница -->

<script setup lang="ts">
import { Flex, Grid, Icon, Text } from '~/components/atoms';
import { Section } from '~/components/molecules';
import Masonry from '~/components/molecules/Masonry.vue';
import { group_icons, HARDWARE, SKILLS, SOFTWARE } from '~/static';
import { TOKENS } from '~/tokens';
import { get_color, get_rem } from '~/utilities';

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
      <Flex v-for="skill in SKILLS" tag="a" :href="skill.url" target="_blank" rel="noopener noreferrer"
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
        <Text family="body" size="default" :css="{color: 'var(--color-icon)', transition: `color ${TOKENS.transition}`}">{{ skill.group }}</Text>
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
        <Flex v-for="skill in SOFTWARE" tag="a" :href="skill.url" target="_blank" rel="noopener noreferrer"
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
        <Flex v-for="group in HARDWARE" :key="group.title" direction="column" :gap="16">
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