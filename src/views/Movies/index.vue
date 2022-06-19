<script lang="ts" setup>


import { useAxios } from '@/plugins/axios';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/* Types */
import type { MovieInterface } from '@/types/movie.interface';
import type { CategoryInterface } from '@/types/category.interface';

/* Composables */
import { useCategories } from '@/use/useCategories'

/* Components */
import Category from '@/components/Category.vue'
import NoData from '@/components/NoData.vue'
import Movie from '@/components/Movie.vue'

const { t } = useI18n();
const { getAll } = useCategories();
const { axios } = useAxios();

const movies = ref<MovieInterface[]>([]);
const categories = ref<CategoryInterface[]>()


const fakeCategoryForFetchAll = ref<CategoryInterface>({
  created_at: new Date(),
  id: 0,
  name: "All",
  updated_at: new Date(),
})

const selectedCategory = ref<CategoryInterface>();

const getMoviesList = async () => {
  let qry = `/movies`;

  if(selectedCategory.value?.name !== 'All'){
    qry = `/moviesByCategory/${selectedCategory.value?.id}`
  }

  let res = await axios.get(qry);
  return res.data
}

onMounted(async () => {
  selectedCategory.value = fakeCategoryForFetchAll.value;
  let [movieCategories, moviesList] = await Promise.all([getAll(),getMoviesList()]);
  categories.value = movieCategories.message;
  // Push Flag For Get All Categories
  categories.value?.unshift({
    id: 0,
    name: 'All',
    created_at: new Date(),
    updated_at: new Date()
  })
  movies.value = moviesList.message;
})

const selectCategory = async (e: CategoryInterface) => {
  selectedCategory.value = {...e};
  const moviesList = await getMoviesList();
  movies.value = moviesList.message;
}

const removeMovieFromDom = (index: number) => {
  movies.value?.splice(index, 1);
}
</script>

<template>
  <div class="movies">
    <div class="movies__header">
      <h4 class="font font--title"> {{ t('Movies.All') }} </h4>
      <RouterLink
         class="movies__add button button--secondary"
         to="/movies/add"
      > {{ t('Movies.Add') }} </RouterLink>

    </div>
    <section class="movies__categories">
      <article v-for="(category, index) in categories" :key="index">
        <Category
           :category="category"
           :class="{'selected-category': selectedCategory?.id === category.id}"
           :editable="false"
           @select="selectCategory"
        />
      </article>
    </section>
    <section class="movies__grid" v-if="movies.length > 0">
        <article
          v-for="(movie, index) in movies"
          :key="index"
        >
          <Movie @movieDeleted="removeMovieFromDom(index)" :movie="movie" />
        </article>
    </section>
    <template v-else>
        <NoData :text="t('NoData.NoMoviesFound')" />
    </template>
  </div>
</template>

<style>

</style>
