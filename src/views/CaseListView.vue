<script setup>
import arrowLeft from '../assets/arrow-left.svg'
import { computed } from 'vue'
import arrowRight from '../assets/arrow-right.svg'
import rtkLogo from '../assets/rtk-user-image.svg'
import smlLogo from '../assets/smlt-user-image.svg'
import { companies } from '../data.js'

const props = defineProps({
  company: {
    type: String,
    required: true,
  },
})

const companyData = computed(() => companies[props.company])
const isSpecialCompany = computed(() => ['rtk', 'smlt'].includes(props.company))
const companyLogo = computed(() => (props.company === 'rtk' ? rtkLogo : smlLogo))
</script>

<template>
  <main class="page" v-if="companyData">
    <section v-if="isSpecialCompany" class="company-screen">
      <section class="company-user">
        <router-link class="company-back-link" :to="companyData.backTo">
          <img class="company-back-link-icon" :src="arrowLeft" alt="" aria-hidden="true" />
          <span class="company-back-link-text">на главную</span>
        </router-link>
        <h1 class="company-user-name">{{ companyData.displayName }}</h1>
        <div class="company-user-logo">
          <img :src="companyLogo" :alt="companyData.displayName" />
        </div>
      </section>

      <section class="company-cases">
        <p class="company-section-label">{{ companyData.caseLabel }}</p>
        <div class="company-case-list">
          <router-link
            v-for="card in companyData.cards"
            :key="card.title"
            :to="card.to"
            class="company-case-link"
            :class="{ 'is-disabled': card.disabled }"
          >
            <span class="company-case-link-text">{{ card.title }}</span>
            <img
              v-if="!card.disabled"
              class="company-case-link-arrow"
              :src="arrowRight"
              alt=""
              aria-hidden="true"
            />
          </router-link>
        </div>
      </section>

      <section class="company-description">
        <p class="company-section-label">{{ companyData.descriptionLabel }}</p>
        <div class="company-description-content">
          <p v-for="paragraph in companyData.description" :key="paragraph">{{ paragraph }}</p>
        </div>
      </section>
    </section>

    <section v-else class="shell list-shell">
      <router-link class="back-link" :to="companyData.backTo">на главную</router-link>

      <section class="panel">
        <h1 class="section-title">{{ companyData.title }}</h1>
        <div class="card-grid compact">
          <component
            :is="card.disabled ? 'div' : 'router-link'"
            v-for="card in companyData.cards"
            :key="card.title"
            :to="card.to"
            class="portfolio-card"
            :class="[{ disabled: card.disabled }, card.accent]"
          >
            <div class="card-spacer"></div>
            <div class="card-body">
              <div class="card-title-row">
                <h2>{{ card.title }}</h2>
                <span v-if="!card.disabled" class="card-mark" aria-hidden="true"></span>
              </div>
              <div class="card-meta single">
                <p>{{ card.subtitle }}</p>
              </div>
            </div>
          </component>
        </div>
      </section>

      <section class="panel text-panel">
        <p v-for="paragraph in companyData.description || companyData.intro" :key="paragraph">{{ paragraph }}</p>
      </section>
    </section>
  </main>
</template>
