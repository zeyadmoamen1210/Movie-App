
<script setup lang="ts">
defineProps({
    text: {
        type: String,
        required: true
    }
})
</script>

<template>
    <section class="no-data">
        <img class="no-data__img" src="@/assets/imgs/no-data.svg" />
        <h5 class="no-data__title"> {{ text }} </h5>
    </section>
</template>