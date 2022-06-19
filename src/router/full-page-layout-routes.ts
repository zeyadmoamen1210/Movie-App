// Views => Auth
import LoginPage from '@/views/Auth/Login.vue'
import RegisterPage from '@/views/Auth/Register.vue'

export default [
    {
        path: '/login',
        name: "Login",
        component: LoginPage
    },
    {
        path: '/register',
        name: "Register",
        component: RegisterPage
    }
]