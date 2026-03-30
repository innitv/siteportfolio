<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import arrowLeft from '../assets/arrow-left.svg'
import { projects } from '../data.js'
import rtkLogo from '../assets/rtk-user-image.svg'

const props = defineProps({
  slug: {
    type: String,
    required: true,
  },
})

const project = computed(() => projects[props.slug])
const isRtkSubscriptions = computed(() => props.slug === 'rtk-redisign')
const isImagePreviewOpen = ref(false)

const openImagePreview = () => {
  isImagePreviewOpen.value = true
}

const closeImagePreview = () => {
  isImagePreviewOpen.value = false
}

const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    closeImagePreview()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <main class="page" :class="{ 'project-special-page': isRtkSubscriptions }" v-if="project">
    <section v-if="isRtkSubscriptions" class="project-special-screen">
      <section class="project-special-side">
        <router-link class="company-back-link" :to="project.backTo">
          <img class="company-back-link-icon" :src="arrowLeft" alt="" aria-hidden="true" />
          <span class="company-back-link-text">к кейсам</span>
        </router-link>

        <section class="project-special-user">
          <h1 class="company-user-name">{{ project.companyName }}</h1>
          <div class="company-user-logo">
            <img :src="rtkLogo" :alt="project.companyName" />
          </div>
        </section>
      </section>

      <section class="project-special-scroll">
        <div class="project-special-main">
          <section class="project-special-hero">
            <div class="project-special-title">
              <p class="company-section-label">{{ project.caseLabel }}</p>
              <h1 class="project-special-name">{{ project.title }}</h1>
            </div>

            <button
              type="button"
              class="project-special-image"
              @click="openImagePreview"
              :aria-label="`Увеличить изображение кейса ${project.title}`"
            >
              <img :src="project.hero" :alt="project.title" />
            </button>
          </section>

          <section class="project-special-details">
            <article class="project-special-section" v-for="section in project.sections" :key="section.title">
              <h2 class="company-section-label">{{ section.title }}</h2>
              <p v-if="section.text" class="project-special-text">{{ section.text }}</p>
              <ol v-if="section.items" class="project-special-list">
                <li v-for="item in section.items" :key="item">{{ item }}</li>
              </ol>
              <ol v-if="section.groups" class="project-special-list project-special-list-grouped">
                <li v-for="group in section.groups" :key="group.label">
                  {{ group.label }}
                  <ol v-if="group.items.length" class="project-special-sublist">
                    <li v-for="item in group.items" :key="item">{{ item }}</li>
                  </ol>
                </li>
              </ol>
            </article>
          </section>
        </div>
      </section>
    </section>

    <section v-else class="shell detail-shell">
      <router-link class="back-link" :to="project.backTo">к кейсам</router-link>

      <section class="panel detail-hero">
        <h1 class="section-title">{{ project.title }}</h1>
        <div class="hero-image">
          <img :src="project.hero" :alt="project.title" />
        </div>
      </section>

      <section class="panel detail-content">
        <article class="detail-section" v-for="section in project.sections" :key="section.title">
          <h2>{{ section.title }}</h2>
          <p v-if="section.text">{{ section.text }}</p>
          <ol v-if="section.items">
            <li v-for="item in section.items" :key="item">{{ item }}</li>
          </ol>
          <div v-if="section.groups" class="detail-groups">
            <div class="detail-group" v-for="group in section.groups" :key="group.label">
              <h3>{{ group.label }}</h3>
              <ol v-if="group.items.length">
                <li v-for="item in group.items" :key="item">{{ item }}</li>
              </ol>
            </div>
          </div>
        </article>

        <article class="detail-section">
          <h2>Визуальные фрагменты</h2>
          <div class="gallery" :class="{ single: project.gallery.length === 1 }">
            <div class="gallery-item" v-for="image in project.gallery" :key="image">
              <img :src="image" :alt="project.title" loading="lazy" />
            </div>
          </div>
        </article>
      </section>

      <router-link class="back-button" :to="project.backTo">к кейсам</router-link>
    </section>
    <teleport to="body">
      <div v-if="isImagePreviewOpen" class="image-preview" @click="closeImagePreview">
        <button
          type="button"
          class="image-preview-close"
          aria-label="Закрыть просмотр изображения"
          @click.stop="closeImagePreview"
        >
          Закрыть
        </button>
        <div class="image-preview-dialog" @click.stop>
          <img :src="project.hero" :alt="project.title" />
        </div>
      </div>
    </teleport>
  </main>
</template>
