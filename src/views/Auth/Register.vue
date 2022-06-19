
<script setup lang="ts">
/* 
    Types 
*/
import type { RegisterInterface } from '@/types/register.interface';
import type { FormInstance } from 'element-plus/lib/components/form';

/*
    Vue Components and 3rd party
*/
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAxios } from '@/plugins/axios';

/*
    Element Plus Ui
*/
import { ElNotification } from 'element-plus';

/*
    State Management 
*/
import { useUserStore } from '@/stores/user';

const { axios } = useAxios()
const userStore = useUserStore();
const { t } = useI18n();


const registerFormRef = ref<FormInstance>();

// Form Rules Validation 
const registerFormRule = reactive({
    name: [
        {
            required: true,
            message: t('FormRules.Required'),
        }
    ],
    email: [
        {
            required: true,
            message: t('FormRules.Required'),
        },
        {
            type: 'email',
            message: t('FormRules.Email'),
            trigger: ['change', 'blur']
        }
    ],
    password: [
        {
            required: true,
            message: t('FormRules.Required'),
        },
    ]
})

const registerForm = ref<RegisterInterface>({
    name: "",
    email: "",
    password: ""
})


const submitRegister = (): void => {
    registerFormRef.value?.validate(async (valid) => {
        if(valid) {
            let registerResponse = await axios.post(`/register`, registerForm.value);
            // if request failed 
            if(registerResponse?.data?.status === 'failed') {
                    const emailErrorMsg: string = registerResponse.data?.message?.["email"]?.[0];
                    if(emailErrorMsg){
                        ElNotification({
                            title: t('Notify.EmailAlreadtToken'),
                            message: t('Notify.ErrorInRegister') ,
                            type: "error",
                            showClose: false,
                        })
                    }
                return;
            }
            userStore.login({ 
                email:registerForm.value.email, 
                password: registerForm.value.password 
            }, registerForm.value.name)
        }
    })
}

</script>

<template>
    <section class="register">
        <div class="register__container">
            <h2 class="register__title"> {{ t("Register.SignUp") }} </h2>
            <el-form
               :model="registerForm"
               :rules="registerFormRule"
               ref="registerFormRef"
            >
                <el-form-item prop="name">
                    <template #label> {{ t("Register.Name") }} </template>
                    <el-input
                       v-model="registerForm.name"
                       :placeholder="t('Register.NamePlaceholder')"
                    ></el-input>
                </el-form-item>

                <el-form-item prop="email">
                    <template #label>{{ t('Register.Email') }}</template>
                    <el-input
                       v-model="registerForm.email"
                       :placeholder="t('Register.EmailPlaceholder')"
                    ></el-input>
                </el-form-item>

                <el-form-item prop="password">
                    <template #label> {{ t('Register.Password') }} </template>
                    <el-input
                       v-model="registerForm.password"
                       :placeholder="t('Register.PasswordPlaceholder')"
                    ></el-input>
                </el-form-item>
            </el-form>
            <button
               @click="submitRegister"
               class="button button--secondary register__btn"
            >
                {{ t('Register.SignUp') }}
            </button>
            <div class="register__already-member">
                {{ t("Register.AlreadyMember") }} 
                ? 
                <RouterLink
                   class="register__already-member-link"
                   to="/login"
                >{{ t("Register.LoginHere") }}</RouterLink>
            </div>
        </div>
    </section>
</template>
