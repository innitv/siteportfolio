import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import CaseListView from './views/CaseListView.vue'
import ProjectDetailView from './views/ProjectDetailView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/a3/cases', component: CaseListView, props: { company: 'a3' } },
  { path: '/a3/dashboard-redesign', component: ProjectDetailView, props: { slug: 'a3-dashboard-redesign' } },
  { path: '/a3/ai-landing-lab', component: ProjectDetailView, props: { slug: 'a3-ai-landing-lab' } },
  { path: '/a3/figma-tokens-export', component: ProjectDetailView, props: { slug: 'a3-figma-tokens-export' } },
  { path: '/a3/flow', component: ProjectDetailView, props: { slug: 'a3-flow' } },
  { path: '/a3/design-system', component: ProjectDetailView, props: { slug: 'a3-design-system' } },
  { path: '/rtk/cases', component: CaseListView, props: { company: 'rtk' } },
  { path: '/smlt/cases', component: CaseListView, props: { company: 'smlt' } },
  { path: '/rtk/redisign', component: ProjectDetailView, props: { slug: 'rtk-redisign' } },
  { path: '/rtk/web', component: ProjectDetailView, props: { slug: 'rtk-web' } },
  { path: '/rtk/onboarding', component: ProjectDetailView, props: { slug: 'rtk-onboarding' } },
  { path: '/smlt/mdg', component: ProjectDetailView, props: { slug: 'smlt-mdg' } },
  { path: '/smlt/map', component: ProjectDetailView, props: { slug: 'smlt-map' } },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
