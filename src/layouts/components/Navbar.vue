
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@/stores/user';
import {ElLoading} from 'element-plus';
import { ref } from 'vue'
const { locale } = useI18n();
const userStore = useUserStore();

 const changeLocale = (lang: string):void => {
    userStore.setCurrLang(lang);
    ElLoading.service({
        lock: true,
        text: 'Loading',
    })
    location.reload();
 }

 const logout = () => {
    userStore.logout();
 }

 const colors = ref<string[]>([
    "7367f0",
    "ee5253",
    "1dd1a1",
    "ff9f43",
    "222f3e",
 ]);

const selectedColor = ref<string>();

const setPrimaryColor = (color: string) => {
    let colorIndex = colors.value.findIndex(ele => ele === color);
    let cloneColors = [...colors.value];
    cloneColors.splice(colorIndex, 1)
    console.log(cloneColors)
    document.body.classList.remove(...document.body.classList);
    document.body.classList.add(`theme_${color}`);
}
</script>

<template>
    <section class="app-navbar">
        <div class="app-navbar__colors">
            <button @click="setPrimaryColor(color)" v-for="(color, index) in colors" :key="index" :style="{'background': '#'+color}" class="app-navbar__color"></button>
        </div>
        <div class="app-navbar__btns">
            <button @click="changeLocale('ar')" v-if="locale == 'en'" class="app-navbar__btn"> 
                <img class="app-navbar__flag" src="../icons/arabic-lang.svg" alt="">
            </button>
            <button @click="changeLocale('en')" v-else class="app-navbar__btn">
                <img class="app-navbar__flag" src="../icons/english-lang.svg" alt="">
            </button>

            <button @click="logout()" class="app-navbar__btn">
                <img class="app-navbar__logout" src="../icons/logout-2.svg" alt="">
            </button>

        </div>
    </section>
</template>