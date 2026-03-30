<script setup>
import avatarIgnatov from '../assets/avatar-ignatov-96.png'
import arrowRight from '../assets/arrow-right.svg'
import a3Icon from '../assets/a3.svg'
import otherIcon from '../assets/other.svg'
import rtkIcon from '../assets/rtk.svg'
import smlIcon from '../assets/sml.svg'
import { homeContacts, homePortfolio } from '../data.js'

const portfolioHoverIcons = {
  a3: a3Icon,
  other: otherIcon,
  rtk: rtkIcon,
  sml: smlIcon,
}
</script>

<template>
  <main class="page home-page">
    <section class="home-screen" data-node-id="598:1570">
      <section class="home-user" data-node-id="599:1534">
        <h1 class="home-user-name" data-node-id="598:1929">ИГНАТОВ ИВАН</h1>
        <div class="home-user-photo" data-node-id="598:1955">
          <img :src="avatarIgnatov" alt="Иван Игнатов" />
        </div>
      </section>

      <section class="home-content" data-node-id="599:1535">
        <section class="home-list-group" data-node-id="598:1944">
          <p class="home-list-label" data-node-id="598:1939">портфолио</p>
          <div class="home-list" data-node-id="598:1943">
            <component
              :is="item.to ? 'router-link' : 'span'"
              v-for="item in homePortfolio"
              :key="item.title"
              :to="item.to"
              class="home-list-item home-portfolio-item"
              :class="{
                'home-list-item-link': item.to,
                'home-list-item-with-left-icon': item.hoverIcon,
              }"
            >
              <img
                v-if="item.hoverIcon"
                class="home-list-item-left-icon"
                :src="portfolioHoverIcons[item.hoverIcon]"
                alt=""
                aria-hidden="true"
              />
              <span class="home-list-item-text">{{ item.title }}</span>
              <img v-if="item.to" class="home-list-item-arrow" :src="arrowRight" alt="" aria-hidden="true" />
            </component>
          </div>
        </section>

        <section class="home-list-group" data-node-id="598:1945">
          <p class="home-list-label" data-node-id="598:1946">контакты</p>
          <div class="home-list" data-node-id="598:1947">
            <a
              v-for="link in homeContacts"
              :key="link.label"
              class="home-list-item home-list-item-link"
              :href="link.href"
              target="_blank"
              rel="noreferrer"
            >
              <span class="home-list-item-text">{{ link.label }}</span>
              <img class="home-list-item-arrow" :src="arrowRight" alt="" aria-hidden="true" />
            </a>
          </div>
        </section>
      </section>
    </section>
  </main>
</template>
