import { createI18n } from 'vue-i18n'

import ar from './ar.json';
import en from './en.json';

export const instance = createI18n({
    locale: 'ar',
    fallbackLocale: 'en',
    messages: {
        "ar": ar,
        "en": en
    }
})

export const i18n = instance.global