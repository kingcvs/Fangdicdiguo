import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'MainMenu',
      component: () => import('@/views/MainMenu.vue')
    },
    {
      path: '/game',
      name: 'GameMain',
      component: () => import('@/views/GameMain.vue')
    },
    {
      path: '/registration/:step',
      name: 'RegistrationWizard',
      component: () => import('@/views/Registration/RegistrationWizard.vue')
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('@/views/Settings/SettingsPage.vue')
    },
    {
      path: '/saves',
      name: 'SavesManager',
      component: () => import('@/views/Settings/SavesManager.vue')
    },
    {
      path: '/changelog',
      name: 'Changelog',
      component: () => import('@/views/Settings/Changelog.vue')
    }
  ]
})

export default router
