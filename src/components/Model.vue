 
<script lang="ts" setup>
import { onMounted } from 'vue';

defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue']);

onMounted(() => {
    // handle esc button to close the model
    document.addEventListener('keydown',(e) => {
        if(e.keyCode === 27){
            emit('update:modelValue', false);
        }
    })
})
</script>

<template>
    <section v-if="modelValue" @click="emit('update:modelValue', false)" class="app-model">
        <div @click.stop class="app-model__inner">
            <header class="app-model__header">
                <h5 class="font font--title font--semi"> <slot name="header" /> </h5>
            </header>
            <article >
                <slot name="body" />
            </article>
        </div>
    </section>
</template>