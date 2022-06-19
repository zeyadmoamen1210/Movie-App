import AddMoviesView from '@/views/Movies/add.vue'
import UpdateMoviesView from '@/views/Movies/update.vue';
import CategoriesView from '@/views/Category/index.vue'

export default [
    {
        path: '',
        name: "MoviesView",
        component: () => import('@/views/Movies/index.vue')
    },
    {
        path: '/movies/add',
        name: "AddMoviesView",
        component: AddMoviesView
    },
    {
        path: '/movies/:id/update',
        name: "UpdateMoviesView",
        component: UpdateMoviesView
    },
    {
        path: '/categories',
        name: "Categories",
        component: CategoriesView
    }
]