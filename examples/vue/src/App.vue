<script setup lang="ts">
import { notate } from 'animate-notation'
import { onMounted, onUnmounted, ref } from 'vue'

const target = ref<HTMLDivElement | null>(null)
const vite = ref<ReturnType<typeof notate> | null>(null)
const vue = ref<ReturnType<typeof notate> | null>(null)
const title = ref<HTMLHeadingElement | null>(null)
const animate = ref<ReturnType<typeof notate> | null>(null)
onMounted(() => {
  vite.value = notate(target.value!.children[0], 'o', {
    opacity: 0.6,
  })
  vue.value = notate(target.value!.children[1], 'box', {
    opacity: 0.6,
  })
  animate.value = notate(title.value!, '=', {
    opacity: 0.1,
  })
})
onUnmounted(() => {
  vite.value?.remove()
  vue.value?.remove()
  animate.value?.remove()
})
</script>

<template>
  <div ref="target" class="container">
    <a
      href="https://vite.dev" target="_blank"
      @mouseover="vite?.show(600)" @mouseleave="vite?.hide(200)"
    >
      <h2>Vite</h2>
    </a>
    <a
      href="https://vuejs.org/" target="_blank"
      @mouseover="vue?.show(600)" @mouseleave="vue?.hide(200)"
    >
      <h2>Vue</h2>
    </a>
  </div>
  <h1
    ref="title" @mouseover="animate?.show(600)"
    @mouseleave="animate?.hide(200)" v-text="'Vite + Vue'"
  />
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}
.container>a {
  display: inline-block;
  padding: .25rem;
  line-height: 0;
}
.logo {
  height: 6em;
  padding: 1.5em;
}
</style>
