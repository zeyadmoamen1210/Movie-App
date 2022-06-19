import { defineStore } from 'pinia'
import { useAxios } from '@/plugins/axios';

// Types
import type { AxiosResponse } from 'axios';
import type { Router } from 'vue-router';

import { ElNotification } from 'element-plus';
import type { LoginInterface } from '@/types/login.interface';

import { i18n } from '@/locales/i18n'

// const { locale, t } = useI18n();
const { axios } = useAxios();

interface AuthInterface {
  token: string | null,
  loggedIn: boolean
}

interface UserStoreInterface {
  baseUrl: string,
  authorisation: AuthInterface,
  router: Router,
  t: any
}

// router: Router

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    baseUrl: "https://test-api.storexweb.com/",
    authorisation: {
      token: null,
      loggedIn: false,
    },
  } as UserStoreInterface),
  getters: {
  },

  actions: {
    async login(loginForm: LoginInterface, username: string | null = null) {
      const { axios } = useAxios();
      try {

        const loginResponse: AxiosResponse = await axios.post(`/login`, {
          email: loginForm.email,
          password: loginForm.password
        });

        // set user status
        this.setUserToken(loginResponse.data?.authorisation?.token)

        ElNotification({
          title: `${i18n.t('Notify.Welcome')} ${username ? username : ''}`,
          message: '😍 ' + i18n.t("Notify.HopeYouEnjoy"),
          type: "success",
          showClose: false,
        })

        // Redirect To Home Page After Login
        this.router.push('/');

      } catch (err) {
        console.log(err)
        // reset
        this.authorisation = {
          token: null,
          loggedIn: false,
        }

        ElNotification({
          title: i18n.t("Notify.InvalidEmailOrPassword"),
          message: i18n.t("Notify.EnterAValidEmailOrPassword"),
          type: "error",
          showClose: false,
        })

      }
    },


    setUserToken(access_token: string) {
      this.authorisation.token = access_token;
      localStorage.setItem("access_token", this.authorisation.token);
      this.authorisation.loggedIn = true;
    },

    logout() {
      this.authorisation = {
        token: null,
        loggedIn: false,
      }
      localStorage.removeItem("access_token");
      this.router.push('/login');
    },

    setCurrLang(lang: string) {
      i18n.locale = lang;
      localStorage.setItem("currLang", i18n.locale);
    }

  }
})
