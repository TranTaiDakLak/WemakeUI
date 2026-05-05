import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
  },
  {
    path: '/app',
    component: () => import('../layouts/MainLayout.vue'),
    redirect: '/app/facebook',
    children: [
      {
        path: 'facebook',
        name: 'Facebook',
        component: () => import('../views/FacebookView.vue'),
      },
      {
        path: 'instagram',
        name: 'Instagram',
        component: () => import('../views/ComingSoonView.vue'),
        props: { platform: 'instagram' },
      },
      {
        path: 'youtube',
        name: 'YouTube',
        component: () => import('../views/ComingSoonView.vue'),
        props: { platform: 'youtube' },
      },
      {
        path: 'zalo',
        name: 'Zalo',
        component: () => import('../views/ComingSoonView.vue'),
        props: { platform: 'zalo' },
      },
      {
        path: 'devices',
        name: 'Devices',
        component: () => import('../views/ComingSoonView.vue'),
        props: { platform: 'devices' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
