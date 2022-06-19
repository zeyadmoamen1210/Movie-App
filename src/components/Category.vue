<script setup lang="ts">
import type { CategoryInterface } from '@/types/category.interface';
import type { PropType } from 'vue';
import { useAxios } from '@/plugins/axios';
import { ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { axios } = useAxios();
defineProps({
    category: {
        required: true,
        type: Object as PropType<CategoryInterface>
    },
    editable: {
        required: true,
        type: Boolean
    }
})

const emit = defineEmits(['categoryDeleted', 'openUpdateForm', 'select'])


const deleteCategory = async (category: CategoryInterface) => {
    
    try {
        let res = await axios.delete(`/category/${category.id}`);
        console.log(res.data)
        if(res.data.status === "success"){
            emit('categoryDeleted', category );
            ElNotification({
                title: t('messages.DeletedSuccessfully'),
                type: "success",
                showClose: false,
            })
        }
    } catch {
        ElNotification({
            title: t('messages.ThereAreSomethingWrong'),
            message: t('messages.CheckYourConnection'),
            type: "error",
            showClose: false,
        })
    }
    
}

</script>

<template>
    <button @click="$emit('select', category)" class="category-card" :class="{'editable': editable}">
          {{ category.name }}

          <div
             v-if="editable"
             class="category-card__btns"
          >

          <el-popconfirm
                :confirm-button-text="t('PopConfirm.Yes')"
                :cancel-button-text="t('PopConfirm.No')"
                icon-color="#626AEF"
                :title="t('PopConfirm.AreYouSure')"
                @confirm="deleteCategory(category)"
            >
                <template #reference>
                    <button
                    class="button button--icon"
                    >
                        <img class="category-card__icon" src="@/assets/imgs/trash.svg" alt="">
                    </button>
                </template>
            </el-popconfirm>
            

            <button
            class="button button--icon"
            @click="emit('openUpdateForm', category)"
            >
                <img class="category-card__icon" src="@/assets/imgs/edit.svg" alt="">
            </button>
          </div>
    </button>
</template>