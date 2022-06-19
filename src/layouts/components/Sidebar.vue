
<script lang="ts" setup>
 import { useRoute } from 'vue-router';
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
                >  <span>الأفلام</span> </RouterLink>
            </li>
            <li>
                <RouterLink
                   class="app-sidebar__link"
                   to="/categories"
                > <span>أقسام الأفلام</span> </RouterLink>
            </li>
        </ul>
    </section>
</template>