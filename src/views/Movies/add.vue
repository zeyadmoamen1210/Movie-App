<script lang="ts" setup>

/* Vue components + 3rd party */
import { ref , onMounted, reactive} from 'vue';
import { useAxios } from '@/plugins/axios';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

/* Element Plus UI */
import { ElNotification } from 'element-plus';

/* My Composables */
import { useCategories } from '@/use/useCategories'


/* Types */
import type { FormInstance } from 'element-plus/lib/components/form';
import type { CategoryInterface } from '@/types/category.interface';

interface AddMovieInterface {
    name: string,
    description: string,
    category_id: string,
    image: File | null
}

const router = useRouter();
const { t } = useI18n();
const { axios } = useAxios();


const imageUrl = ref<string>();
let categories = ref<CategoryInterface[]>();

// get movies categories when page is loaded
const { getAll } = useCategories();
onMounted(async () => {
    const categoriesRes = await getAll();
    categories.value = categoriesRes.message
})



const newMovieRef = ref<FormInstance>();
const newMovie = reactive<AddMovieInterface>({
    name: '',
    description: '',
    category_id: '',
    image: null
})


// Rules Form Validation
const addMovieRule = reactive({
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


// Handle Select Image 
interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}

const setSelectedImage = (e: HTMLInputEvent) => {
    const file = e?.target?.files?.[0];
    if(file){
        newMovie.image = file;
        imageUrl.value = URL.createObjectURL(newMovie.image);
    }
}

// Submit Add 
const submitAddMovie = () => {
    newMovieRef.value?.validate(async (valid) => {
        if(valid) {
            if(!newMovie.image){
                ElNotification({
                    title: "Movie Image Is Required",
                    message: "Please attach a image for movie",
                    type: 'error',
                    showClose: false,
                })
                return;
            }
            let formData = new FormData();
            formData.append("name", newMovie.name);
            formData.append("description", newMovie.description);
            formData.append("image", newMovie.image);
            formData.append("category_id", newMovie.category_id);

            // loading handled in plugin/axios.ts in interceptor
            const res = await axios.post(`/movies`, formData);
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
        <h5
           class="font font--title margin-top-bottom-1rem"
        > {{ t('AddMovie.Add') }} </h5>

        <div class="add-movies__uploader">
            <input
               @change="setSelectedImage($event as HTMLInputEvent)"
               class="add-movies__uploader-input"
               accept="image/*"
               type="file"
            >
            <img class="add-movies__uploader-img" v-if="imageUrl" :src="imageUrl" alt="">
            <div v-else>
                <img
                   class="add-movies__uploader-icon"
                   alt=""
                   src="@/assets/imgs/camera.svg"
                >
                <h6
                   class="add-movies__uploader-label"
                > {{ t('AddMovie.AttachImgForMovie') }} </h6>
            </div>
        </div>

        <section>
            <el-form :model="newMovie" ref="newMovieRef" :rules="addMovieRule">
                <div class="d-flex gap-1rem">
                    <el-form-item class="flex-fill" prop="name">
                        <template #label> {{ t('AddMovie.MovieName') }} </template>
                        <el-input v-model="newMovie.name"></el-input>
                    </el-form-item>
                    <el-form-item class="flex-fill" prop="category_id">
                        <template #label> {{ t('AddMovie.MovieCategory') }} </template>
                        <el-select placeholder="." class="w-100" v-model="newMovie.category_id">
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
                    <el-input :autosize="{'minRows': 6,'maxRows': 7}" type="textarea" v-model="newMovie.description"></el-input>
                </el-form-item>
            </el-form>

            <div class="d-flex flex-row-reverse mt-3">
                <button
                   @click="submitAddMovie"
                   class="button button--primary"
                >{{ t('AddMovie.SubmitAddMovie') }} </button>
            </div>
        </section>
    </section>
</template>