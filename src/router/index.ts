import { createRouter, createWebHistory } from 'vue-router';

//Layouts Folder
import FullPageLayout from '@/layouts/full-page.vue';
import AppContentLayout from '@/layouts/app-content.vue';

// App Content Layout Roues
import AppContentLayoutRoutes from './app-content-layout-roues'

// Full Page Layout Roues
import FullPageLayoutRoutes from './full-page-layout-routes'


import { useUserStore } from '@/stores/user';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    /*
      ------------------------------------------
      App Content Layout (pages includes navbar - sidebar - footer)
      ------------------------------------------
    */
    {
      path: '',
      name: "AppContentLayout",
      component: AppContentLayout, // ( full-page.vue ) in layouts folder
      // route guard if user not logged in redirect to login 
      beforeEnter: (from, to, next) => {
        const userStore = useUserStore();
        if (userStore.authorisation?.loggedIn) {
          next();
        } else {
          next('/login');
        }
      },
      children: [
        ...AppContentLayoutRoutes
      ]
    },

    /*
      ------------------------------------------
      Full Page Layout e.g (Login - Register)
      ------------------------------------------
    */
    {
      path: '',
      name: "FullPageLayout",
      component: FullPageLayout, // ( full-page.vue ) in layouts folder
      beforeEnter: (from, to, next) => {
        const userStore = useUserStore();
        if (userStore.authorisation?.loggedIn) {
          next('/');
        } else {
          next();
        }
      },
      children: [
        ...FullPageLayoutRoutes
      ]
    },

  ],
  linkExactActiveClass: "active-route"
})

export default router
