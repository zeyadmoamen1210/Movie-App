
<script setup lang="ts">
/* Types */
import type { FormInstance } from 'element-plus/lib/components/form';
import type { LoginInterface } from '@/types/login.interface'

/* Vue Components and 3rd party */
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

/* State Management */
import { useUserStore } from '@/stores/user'


const { t } = useI18n();
const userStore = useUserStore();
const router = useRouter();

/* Form Rules Validation */
const loginRules = ref({
    email: [
        {
            required: true,
            message: t('FormRules.Required'),
            trigger: 'blur',
        },
        {
            type: 'email',
            message: t('FormRules.Email'),
            trigger: ['blur', 'change'],
        },
    ],
    password: [
        {
            required: true,
            message: t('FormRules.Required'),
            trigger: 'blur',
        },
    ]
})

const formRef = ref<FormInstance>();

const loginForm = reactive<LoginInterface>({
    email: 'zeyad@test.com',
    password: 'zeyad'
})

const submitLogin = (): void => {
    formRef.value?.validate((valid): void => {
        if (valid) {
            userStore.login(loginForm);
        }
    })
}

</script>

<template>
    <section class="login">
        <div>
            <div class="login__form-container">
                <h2
                   class="login__title"
                > {{ t("Login.LoginToYourAccount") }} </h2>

               <el-form
                   :model="loginForm"
                   :rules="loginRules"
                   class="login__form"
                   ref="formRef"
                >
                    <el-form-item prop="email">
                        <template #label> {{ t("Login.Email") }} </template>
                        <el-input
                           v-model="loginForm.email"
                           :placeholder="t('Login.EmailPlaceholder')"
                           class="input input--grey"
                           size="large"
                        ></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <template #label> {{ t("Login.Password") }} </template>
                        <el-input
                           v-model="loginForm.password"
                           :placeholder="t('Login.PasswordPlaceholder')"
                           class="input input-grey input--password"
                           size="large"
                           type="password"
                        >
                        </el-input>
                    </el-form-item>
                </el-form>

                <div class="login__btns">
                    <button
                       @click="submitLogin"
                       class="button button--primary login__btn"
                    >
                        {{ $t("Login.Login") }}
                    </button>
                    <button
                       @click="router.push('/register')"
                       class="button button--secondary login__btn"
                    >
                        {{ $t("Login.Register") }}
                    </button>
                </div>

            </div>
        </div>
    </section>
</template>
