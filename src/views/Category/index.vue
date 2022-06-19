<script lang="ts" setup>
/* Types */
import type { CategoryInterface } from '@/types/category.interface';
import type { FormInstance } from 'element-plus/lib/components/form';
import type { UpdateAddCategoryResponse } from '@/types/UpdateAddCategoryResponse.interface';

/* Vue */
import { ref, onMounted } from 'vue'; 
import { useI18n } from 'vue-i18n';
import { useAxios } from '@/plugins/axios'
/* Composables */
import { useCategories } from '@/use/useCategories';

/* Components */
import Category from '@/components/Category.vue';
import Model from '@/components/Model.vue';
import { ElNotification } from 'element-plus';
import { isArray } from 'lodash';

const { axios } = useAxios();
const { t } = useI18n();
const { getAll } = useCategories();
const categories = ref<CategoryInterface[]>();

onMounted(async () => {
  const categoriesResponse = await getAll();
  categories.value = categoriesResponse.message;

   // Flag For Get All Categories
  categories.value?.unshift({
    id: 0,
    name: 'All',
    created_at: new Date(),
    updated_at: new Date()
  })
})

// Remove Element From DOM locally ( Preformance Tip )
const removeElementFromDom = (index: number) => {
    categories.value?.splice(index, 1);
}



const updateModel = ref<boolean>(false)
// Intial Value For Type Safety
const currentCategory = ref<CategoryInterface>({
  id: 0,
  name: '',
  created_at: new Date(),
  updated_at: new Date(),
});

const currentCategoryRef = ref<FormInstance>();
const currentCategoryIndex = ref<number>(-1);

// Form Rules validation
const addUpdateCategoryFormRules = ref({
  name: {
    required: true,
    message: t('FormRules.Required')
  }
})

// open model for update and save category index to update in DOM
const openUpdateModel = (index: number, category: CategoryInterface) => {
  updateModel.value = true;
  currentCategory.value = {...category};
  currentCategoryIndex.value = index;
}

const saveCategory = (category: CategoryInterface) => {
  currentCategoryRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        const res = await axios.put(`/category/${currentCategory.value.id}`, category);
        const categoryRes: UpdateAddCategoryResponse = res.data;

        if(isArray(categories.value)){
          categories.value[currentCategoryIndex.value] = categoryRes.message;
          console.log(categories.value[currentCategoryIndex.value])
        }

        updateModel.value = false;

        ElNotification({
          title: t('messages.UpdatedSuccessfully'),
          type: "success",
          showClose: false,
        })

      } catch {

        ElNotification({
          title: t('messages.ThereAreSomethingWrong'),
          message: t('messages.CheckYourConnection'),
          type: "error",
          showClose: false,
        })

      }
    }
  })
}


const addModel = ref<boolean>(false);
const addCategory = ref<{name: string}>({name: ''});
const addCategoryRef = ref<FormInstance>()

const submitAddCategory = (category: {name: string}) => {

  addCategoryRef.value?.validate(async (valid) => {
    if (valid) {
      try {

        const res = await axios.post(`/category`, category);
        const categoryRes: UpdateAddCategoryResponse = res.data;
        categories.value?.push(categoryRes.message);
        addModel.value = false;

        ElNotification({
          title: t('messages.CreatedSuccesssfully'),
          type: "success",
          showClose: false,
        })

      } catch {

        ElNotification({
          title: t('messages.ThereAreSomethingWrong'),
          message: t('messages.CheckYourConnection'),
          type: "error",
          showClose: false,
        })

      }
    }
  })
  
}

</script>

<template>
  <div class="catergories">
    <header class="d-flex justify-content-between align-items-center">
      <h5 class="margin-bottom-1rem font font--title"> أقسام الأفلام </h5>
      <div>
        <button class="button button--secondary" @click="addCategory.name = '' ,addModel = true">إضافة قسم </button>
      </div>
    </header>
    <div class="catergories__grid">
      <div v-for="(category, index) in categories" :key="index">
        <Category
           @categoryDeleted="removeElementFromDom(index)"
           @openUpdateForm="openUpdateModel(index, $event)"
           :category="category"
           :editable="true"
           class="catergories__category-card"
        />
      </div>
    </div>

    <!-- Start Update Category  -->
    <Model v-model="updateModel">
      <template #header> {{ $t('Category.Update') }}  </template>
      <template #body>
        <el-form :model="currentCategory" ref="currentCategoryRef" :rules="addUpdateCategoryFormRules">
          <el-form-item prop="name">
            <template #label> {{ $t('Category.Name') }} </template>
            <el-input size="large" v-model="currentCategory.name"></el-input>
          </el-form-item>
        </el-form>

        <div class="mt-3 d-flex flex-row-reverse">
          <button
              @click="saveCategory(currentCategory)"
             class="button button--primary button--classic"
          > {{ $t('Category.Update') }} </button>
        </div>
      </template>
    </Model>
    <!-- End Update Category  -->
    <!-- Start Add Category  -->
    <Model v-model="addModel">
      <template #header> {{ $t('Category.Add') }}  </template>
      <template #body>
        <el-form :model="addCategory" ref="addCategoryRef" :rules="addUpdateCategoryFormRules">
          <el-form-item prop="name">
            <template #label> {{ $t('Category.Name') }} </template>
            <el-input size="large" v-model="addCategory.name"></el-input>
          </el-form-item>
        </el-form>

        <div class="mt-3 d-flex flex-row-reverse">
          <button
              @click="submitAddCategory(addCategory)"
             class="button button--primary button--classic"
          > {{ $t('Category.Add') }} </button>
        </div>
      </template>
    </Model>
    <!-- End Add Category  -->
  </div>

  
</template>

