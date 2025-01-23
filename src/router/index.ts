import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import CameraView from '../views/CameraView.vue'
import MapsView from '../views/MapsView.vue'
import PhoneView from '../views/PhoneView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
  {
    path: '/camera',
    name: 'camera',
    component: CameraView
  },
  {
    path: '/maps',
    name: 'maps',
    component: MapsView
  },
  {
    path: '/phone',
    name: 'phone',
    component: PhoneView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
