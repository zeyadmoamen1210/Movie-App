<script setup lang="ts">
/* Types */
import type { MovieInterface } from '@/types/movie.interface';
import type { PropType } from 'vue';


import { useUserStore } from '@/stores/user';
import { useAxios } from '@/plugins/axios';
import { useI18n } from 'vue-i18n';

/* Components From Element-Plus */
import { ElNotification } from 'element-plus';


const emit = defineEmits(['movieDeleted']);


const { axios } = useAxios();
const store = useUserStore();
const { t } = useI18n();

const props = defineProps({
    movie: {
        type: Object as PropType<MovieInterface>,
        required: true,
    }
})

const deleteMovie = async (movie: MovieInterface) => {
    try {
        let res = await axios.delete(`/movies/${movie.id}`);
        if(res.data.status === "success"){
            emit("movieDeleted", movie);
            ElNotification({
                title: t('messages.DeletedSuccessfully'),
                type: "success",
                showClose: false,
            })
        }
    }catch {
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
    <section class="movie-card">
        <div class="movie-card__actions"></div>
        <img v-lazy="{
            src: store.baseUrl + movie.image,
            loading: 'https://i.ibb.co/2Wq8X3z/loading.webp',
            error: 'your error image url'
        }" class="movie-card__img" alt="">

        <div class="movie-card__body">
            <h6 class="movie-card__name">{{ movie.name }}</h6>

            <div class="movie-action">
                <div class="movie-action__wrapper">
                    <div class="movie-action__delete">


                        <el-popconfirm
                           :cancel-button-text="t('PopConfirm.No')"
                           :confirm-button-text="t('PopConfirm.Yes')"
                           :title="t('PopConfirm.AreYouSure')"
                           @confirm="deleteMovie(movie)"
                           icon-color="#626AEF"
                        >
                            <template #reference>
                                <button class="button button--icon">
                                    <img class="movie-action__icon" src="@/assets/imgs/trash.svg" alt="">
                                </button>
                            </template>
                        </el-popconfirm>
                    </div>


                    <div class="movie-action__edit">
                        <RouterLink :to="`/movies/${movie.id}/update`">
                            <button class="button button--icon">
                                <img class="movie-action__icon" src="@/assets/imgs/edit.svg" alt="">
                            </button>
                        </RouterLink>
                    </div>
                </div>
            </div>
            <!-- <p class="movie-card__description">
                {{ movie.description }}
            </p> -->
        </div>
    </section>
</template>
