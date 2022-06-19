import { createApp } from 'vue'
import pinia from '@/plugins/pinia';

import App from './App.vue'
import router from './router'

import { ElButton, ElInput, ElForm, ElFormItem, ElSelect, ElOption, ElPopconfirm } from '@/plugins/element-plus';

// axios
import '@/plugins/axios.ts'

// lazy loading images
import VueLazyLoad from 'vue3-lazyload'

// I18n
import { instance } from '@/locales/i18n'

// App Style
import "@/assets/style/main.scss";
const app = createApp(App)

app.use(instance)
app.use(router)
app.use(pinia)

app.use(VueLazyLoad)

app.mount('#app')

app.component('ElButton', ElButton)
app.component('ElInput', ElInput)
app.component('ElForm', ElForm)
app.component('ElFormItem', ElFormItem)
app.component('ElSelect', ElSelect)
app.component('ElOption', ElOption)
app.component('ElPopconfirm', ElPopconfirm)



