<script setup lang="ts">

import { useI18n } from 'vue-i18n';
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/user';

const { locale } = useI18n();
const userStore = useUserStore();

onMounted(() => {
  const access_token: string | null = localStorage.getItem("access_token");
  const currLang: string | null = localStorage.getItem("currLang");

  if(access_token){
    userStore.setUserToken(access_token);
  }

  if(currLang){
    userStore.setCurrLang(currLang);
  }

})

</script>

<template>
  <div :dir="locale == 'ar' ? 'rtl' : 'ltr'">
    <RouterView />
  </div>
</template>

<style lang='scss'>
</style>
