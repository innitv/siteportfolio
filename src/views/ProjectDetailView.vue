<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import arrowLeft from '../assets/arrow-left.svg'
import { projects } from '../data.js'
import a3Logo from '../assets/a3.svg'
import rtkLogo from '../assets/rtk-user-image.svg'
import smlLogo from '../assets/smlt-user-image.svg'

const props = defineProps({
  slug: {
    type: String,
    required: true,
  },
})

const project = computed(() => projects[props.slug])
const isSpecialProject = computed(() =>
  ['a3-dashboard-redesign', 'a3-ai-landing-lab', 'a3-figma-tokens-export', 'a3-design-system', 'a3-flow', 'rtk-redisign', 'rtk-web', 'rtk-onboarding', 'smlt-mdg', 'smlt-map'].includes(props.slug)
)
const companyLogo = computed(() => {
  if (props.slug.startsWith('a3-')) return a3Logo
  return props.slug.startsWith('smlt-') ? smlLogo : rtkLogo
})
const isImagePreviewOpen = ref(false)
const previewImage = ref(null)
const mediaDragState = ref(null)
const suppressNextMediaClick = ref(false)

const stopMediaDragAnimation = (state) => {
  if (state?.frameId) {
    window.cancelAnimationFrame(state.frameId)
    state.frameId = null
  }
}

const animateMediaDrag = (state) => {
  const delta = state.targetScrollLeft - state.slider.scrollLeft
  state.slider.scrollLeft += delta * 0.32

  if (Math.abs(delta) > 0.5) {
    state.frameId = window.requestAnimationFrame(() => animateMediaDrag(state))
    return
  }

  state.slider.scrollLeft = state.targetScrollLeft
  state.frameId = null
}

const startMediaDrag = (event) => {
  if (event.pointerType === 'touch') return

  const slider = event.currentTarget
  stopMediaDragAnimation(mediaDragState.value)
  const mediaButton = event.target.closest?.('.project-special-media-image')
  mediaDragState.value = {
    slider,
    pointerId: event.pointerId,
    startX: event.clientX,
    scrollLeft: slider.scrollLeft,
    targetScrollLeft: slider.scrollLeft,
    moved: false,
    frameId: null,
    image: mediaButton?.dataset.previewImage || null,
  }
  slider.classList.add('is-dragging')
  slider.setPointerCapture?.(event.pointerId)
}

const moveMediaDrag = (event) => {
  const state = mediaDragState.value
  if (!state || state.pointerId !== event.pointerId) return

  const distance = event.clientX - state.startX
  if (Math.abs(distance) > 4) {
    state.moved = true
    event.preventDefault()
  }
  state.targetScrollLeft = state.scrollLeft - distance
  if (!state.frameId) {
    state.frameId = window.requestAnimationFrame(() => animateMediaDrag(state))
  }
}

const endMediaDrag = (event) => {
  const state = mediaDragState.value
  if (!state || state.pointerId !== event.pointerId) return

  state.slider.releasePointerCapture?.(event.pointerId)
  stopMediaDragAnimation(state)
  state.slider.scrollLeft = state.targetScrollLeft
  state.slider.classList.remove('is-dragging')

  if (state.moved) {
    suppressNextMediaClick.value = true
  } else if (state.image) {
    openImagePreview(state.image)
    suppressNextMediaClick.value = true
  }
  mediaDragState.value = null
}

const handleMediaImageClick = (event, image) => {
  if (suppressNextMediaClick.value) {
    event.preventDefault()
    suppressNextMediaClick.value = false
    return
  }
  openImagePreview(image)
}

const openImagePreview = (image = project.value?.hero) => {
  previewImage.value = image
  isImagePreviewOpen.value = true
}

const closeImagePreview = () => {
  isImagePreviewOpen.value = false
  previewImage.value = null
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
  <main
    class="page"
    :class="{
      'project-special-page': isSpecialProject,
      'project-web-page': props.slug === 'rtk-web',
      'project-onboarding-page': props.slug === 'rtk-onboarding',
      'project-a3-flow-page': props.slug === 'a3-flow',
      'project-a3-dashboard-page': props.slug === 'a3-dashboard-redesign',
    }"
    v-if="project"
  >
    <section v-if="isSpecialProject" class="project-special-screen">
      <section class="project-special-side">
        <router-link class="company-back-link" :to="project.backTo">
          <img class="company-back-link-icon" :src="arrowLeft" alt="" aria-hidden="true" />
          <span class="company-back-link-text">к кейсам</span>
        </router-link>

        <section class="project-special-user">
          <h1 class="company-user-name">{{ project.companyName }}</h1>
          <div class="company-user-logo">
            <img :src="companyLogo" :alt="project.companyName" />
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

            <div v-if="project.heroImages?.length" class="project-special-image-grid">
              <button
                v-for="image in project.heroImages"
                :key="image"
                type="button"
                class="project-special-image"
                @click="openImagePreview(image)"
                :aria-label="`Увеличить изображение кейса ${project.title}`"
              >
                <img :src="image" :alt="project.title" />
              </button>
            </div>

            <button
              v-else
              type="button"
              class="project-special-image"
              @click="openImagePreview(project.hero)"
              :aria-label="`Увеличить изображение кейса ${project.title}`"
            >
              <img :src="project.hero" :alt="project.title" />
            </button>

            <a
              v-if="project.heroLink"
              class="project-special-hero-link"
              :href="project.heroLink.href"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ project.heroLink.label }}
            </a>
          </section>

          <section class="project-special-details">
            <template v-for="section in project.sections" :key="section.title">
              <article class="project-special-section">
                <h2 class="company-section-label">{{ section.title }}</h2>
                <p v-if="section.text" class="project-special-text">{{ section.text }}</p>
                <ol v-if="section.items" class="project-special-list">
                  <li v-for="item in section.items" :key="item">{{ item }}</li>
                </ol>
                <div v-if="section.groups" class="project-special-list project-special-list-grouped">
                  <li v-for="group in section.groups" :key="group.label">
                    {{ group.label }}
                    <ol v-if="group.items.length" class="project-special-sublist">
                      <li v-for="item in group.items" :key="item">{{ item }}</li>
                    </ol>
                  </li>
                </div>
                <div
                  v-if="section.media?.length"
                  class="project-special-media-block"
                  :class="{ 'project-special-media-block-slider': section.media.length > 1 }"
                  @pointerdown="section.media.length > 1 && startMediaDrag($event)"
                  @pointermove="moveMediaDrag"
                  @pointerup="endMediaDrag"
                  @pointercancel="endMediaDrag"
                >
                  <figure
                    class="project-special-media"
                    :class="media.variant ? `project-special-media--${media.variant}` : null"
                    v-for="media in section.media"
                    :key="media.src"
                  >
                    <button
                      type="button"
                      class="project-special-media-image"
                      :data-preview-image="media.src"
                      @click="handleMediaImageClick($event, media.src)"
                      :aria-label="`Увеличить изображение ${media.caption || project.title}`"
                    >
                      <span class="project-special-media-image-inner">
                        <img :src="media.src" :alt="media.caption || project.title" loading="lazy" />
                      </span>
                      <span class="project-special-media-zoom" aria-hidden="true">Увеличить</span>
                    </button>
                    <figcaption v-if="media.caption">{{ media.caption }}</figcaption>
                  </figure>
                </div>
              </article>
              <div v-if="section.dividerAfter" class="project-special-divider" aria-hidden="true" />
            </template>

            <article v-if="project.visualSolutionImages?.length" class="project-special-section project-special-visual-solutions">
              <h2 class="company-section-label">визуальные решения</h2>
              <div class="project-special-image-grid">
                <button
                  v-for="image in project.visualSolutionImages"
                  :key="image"
                  type="button"
                  class="project-special-image"
                  @click="openImagePreview(image)"
                  :aria-label="`Увеличить визуальное решение кейса ${project.title}`"
                >
                  <img :src="image" :alt="project.title" loading="lazy" />
                </button>
              </div>
            </article>

            <article v-if="project.videos?.length" class="project-special-section project-special-fragments">
              <h2 class="company-section-label">визуальные фрагменты</h2>
              <div class="project-special-video-row">
                <video
                  v-for="video in project.videos"
                  :key="video"
                  class="project-special-video"
                  :src="video"
                  autoplay
                  loop
                  muted
                  playsinline
                />
              </div>
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
          <img :src="previewImage || project.hero" :alt="project.title" />
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
          <img :src="previewImage || project.hero" :alt="project.title" />
        </div>
      </div>
    </teleport>
  </main>
</template>
