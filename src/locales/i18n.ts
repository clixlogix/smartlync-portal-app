import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// import * as de from 'date-fns/locale/de';
// import * as hi from 'date-fns/locale/de';
// import * as cn from 'date-fns/locale/zh-CN';
// import * as fr from 'date-fns/locale/fr';

// import { registerLocale } from 'react-datepicker';

import moment from 'moment';
import 'moment/locale/hi';
import 'moment/locale/de';
import 'moment/locale/fr';
import 'moment/locale/zh-cn';

import tran_en from './en/translation';
import tran_de from './de/translation';
import tran_hi from './hi/translation';
import tran_cn from './cn/translation';
import tran_fr from './fr/translation';

import { convertLanguageJsonToObject } from './translations';

export const translationsJson = {
    en: {
        translation: tran_en,
    },
    de: {
        translation: tran_de,
    },
    hi: {
        translation: tran_hi,
    },
    cn: {
        translation: tran_cn,
    },
    'zh-cn': {
        translation: tran_cn,
    },
    fr: {
        translation: tran_fr,
    },
};

// Create the 'translations' object to provide full intellisense support for the static json files.
convertLanguageJsonToObject(tran_en);

export const i18n = i18next
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector) // commented To pick german by default
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        resources: translationsJson,
        fallbackLng: 'en',
        // debug: process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test', /*Uncomment only when testing i18 */

        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
            format: function (value, format, lng) {
                if (format === 'uppercase') return value.toUpperCase();
                if (value instanceof Date) return moment(value).format(format);
                return value;
            },
        },
    });

// TODO: add flag icons to languages
// @ts-ignore
i18next.availableLanguages = [
    { key: 'en', label: 'English', value: 'en', icon: undefined /* flag */ },
    { key: 'de', label: 'Deutsch', value: 'de', icon: undefined /* flag */ },
    // { key: 'hi', label: 'हिन्दी', value: 'hi', icon: undefined /* flag */ },
    // { key: 'cn', label: '中文', value: 'zh-cn', icon: undefined /* flag */ },
    // { key: 'cn', label: '中文', value: 'cn', icon: undefined /* flag */ },
    // { key: 'fr', label: 'Français', value: 'fr', icon: undefined /* flag */ },
    //  { key: 'ar': lebel: 'عربي',  value: 'ar', icon: undefined /* flag */ },
];

export default i18next;
