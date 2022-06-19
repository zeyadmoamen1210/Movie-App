<script lang="ts" setup>
import Navbar from './components/Navbar.vue';
import Sidebar from './components/Sidebar.vue';
import { useI18n } from 'vue-i18n';
const { locale } = useI18n();
</script>

<template>
    <section class="app-content-layout">
        
        <Sidebar />
        <div
           class="app-content-layout__contant"
           :class="{
            'app-content-layout__contant--margin-left': locale == 'en',
            'app-content-layout__contant--margin-right': locale == 'ar',
           }"
        >
            <Navbar />
            <RouterView/>
        </div>
    </section>
</template>