<script lang="ts" setup>

/* vue components , 3rd part */
import { ref , onMounted, reactive} from 'vue';
import { useI18n } from 'vue-i18n';
import { useAxios } from '@/plugins/axios';
import {useRoute , useRouter} from 'vue-router'

/* Element Plus UI */
import { ElNotification } from 'element-plus';

/* My Composables */
import { useCategories } from '@/use/useCategories'
import { useUserStore } from '@/stores/user';

/* Types */
import type { FormInstance } from 'element-plus/lib/components/form';
import type { CategoryInterface } from '@/types/category.interface';
interface UpdateMovieInterface {
    id: number,
    name: string,
    description: string,
    category_id: string,
    image: File | null
}


const store = useUserStore();
const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const { axios } = useAxios();



const imageUrl = ref<string>("");
let categories = ref<CategoryInterface[]>();

const getMovie = async () => {
    let res = await axios.get(`/movies/${route.params.id}`);
    return res.data;
}



const updateMovieRef = ref<FormInstance>();
const updateMovie = ref<UpdateMovieInterface>({
    id: 0,
    name: '',
    description: '',
    category_id: '',
    image: null
})


const { getAll } = useCategories();
onMounted(async () => {
    let [categoriesRes, movieRes] = await Promise.all([getAll(), getMovie()]);

    categories.value = categoriesRes.message
    updateMovie.value = movieRes.message;

    if(typeof updateMovie.value.image === 'string'){
        imageUrl.value = store.baseUrl + updateMovie.value.image
    }

})

// Form Rules Validations
const updateMovieRule = reactive({
    name: [
        {
            required: true,
            message: t('FormRules.Required'),
        }
    ],
    category_id: [
        {
            required: true,
            message: t('FormRules.Required'),
        },
    ],
    description: [
        {
            required: true,
            message: t('FormRules.Required'),
        },
    ]
})


interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}

const setSelectedImage = (e: HTMLInputEvent) => {
    const file = e?.target?.files?.[0];
    if(file){
        updateMovie.value.image = file;
        imageUrl.value = URL.createObjectURL(updateMovie.value.image);
    }
}


const submitAddMovie = () => {
    updateMovieRef.value?.validate(async (valid) => {
        if(valid) {
            if(!updateMovie.value.image){
                ElNotification({
                    title: "Movie Image Is Required",
                    message: "Please attach a image for movie",
                    type: 'error',
                    showClose: false,
                })
                return;
            }
            let formData = new FormData();
            formData.append("name", updateMovie.value.name);
            formData.append("description", updateMovie.value.description);
            formData.append("image", updateMovie.value.image);
            formData.append("category_id", updateMovie.value.category_id);
            formData.append("_method", "put");

            // loading handled in plugin/axios.ts in interceptor
            const res = await axios.post(`/movies/${updateMovie.value.id}`, formData);
            if(res?.data?.status === "failed") {
                ElNotification({
                    title: t('messages.ThereAreSomethingWrong'),
                    message: t('messages.CheckYourConnection'),
                    type: 'error',
                    showClose: false,
                })
                return;
            }
            ElNotification({
                title: t('messages.CreatedSuccesssfully'),
                type: 'success',
                showClose: false,
            });
            router.push('/')
        }
    })
}

</script>


<template>
    <section class="add-movies">
        <h5 class="font font--title margin-top-bottom-1rem"> {{ t('AddMovie.Update') }} </h5>
        <div class="add-movies__uploader">
            <input @change="setSelectedImage($event as HTMLInputEvent)" class="add-movies__uploader-input" type="file" accept="image/*">
            <img class="add-movies__uploader-img" v-if="imageUrl" :src="imageUrl" alt="">
            <div v-else>
                <img class="add-movies__uploader-icon" src="@/assets/imgs/camera.svg" alt="">
                <h6 class="add-movies__uploader-label"> {{ t('AddMovie.AttachImgForMovie') }} </h6>
            </div>
        </div>

        <section>
            <el-form :model="updateMovie" ref="updateMovieRef" :rules="updateMovieRule">
                <div class="d-flex gap-1rem">
                    <el-form-item class="flex-fill" prop="name">
                        <template #label> {{ t('AddMovie.MovieName') }} </template>
                        <el-input v-model="updateMovie.name"></el-input>
                    </el-form-item>
                    <el-form-item class="flex-fill" prop="category_id">
                        <template #label> {{ t('AddMovie.MovieCategory') }} </template>
                        <el-select placeholder="." class="w-100" v-model="updateMovie.category_id">
                            <el-option
                                v-for="item in categories"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            />
                        </el-select>
                    </el-form-item>
                </div>
                
                <el-form-item prop="description">
                    <template #label> {{ t('AddMovie.MovieDescription') }} </template>
                    <el-input :autosize="{'minRows': 6,'maxRows': 7}" type="textarea" v-model="updateMovie.description"></el-input>
                </el-form-item>
            </el-form>

            <div class="d-flex flex-row-reverse mt-3">
                <button @click="submitAddMovie" class="button button--primary"> {{ t('AddMovie.Update') }} </button>
            </div>
        </section>
    </section>
</template>