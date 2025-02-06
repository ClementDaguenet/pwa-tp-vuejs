import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ChatView from '../views/ChatView.vue'
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
    path: '/chat',
    name: 'chat',
    component: ChatView
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
