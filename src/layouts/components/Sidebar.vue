
<script lang="ts" setup>
 import { useRoute } from 'vue-router';
 import { useI18n } from 'vue-i18n';

 const { t } = useI18n();
 const route = useRoute();
</script>

<template>
    <section class="app-sidebar">
        <div class="app-sidebar__logo-box">
            <img
               class="app-sidebar__logo"
               alt=""
               src="../icons/logo.png"
            >
        </div>

        <ul class="app-sidebar__links">
            <li>
                <RouterLink
                   class="app-sidebar__link"
                   :class="{'active-route': route.path.startsWith('/movie') || route.path == '/'}"
                   to="/"
                >  <span> {{ t('Sidebar.Movies') }} </span> </RouterLink>
            </li>
            <li>
                <RouterLink
                   class="app-sidebar__link"
                   to="/categories"
                > <span> {{ t('Sidebar.Categories') }} </span> </RouterLink>
            </li>
        </ul>
    </section>
</template>