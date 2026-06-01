import axios from 'axios';
// ✅ i18n инстансын импорттау
import i18n from './../i18n'; // ✅ Жолдың дұрыстығын тексеріңіз.

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // ✅ Ағымдағы тілді Accept-Language хедеріне қосу
        // Әрбір сұрау жіберілгенде i18n.language-ден тілді қайта аламыз
        const currentLanguage = i18n.language;
        if (currentLanguage) {
            config.headers['Accept-Language'] = currentLanguage;
            // Диагностикалық лог: Interceptor-дың қандай тілді жіберетінін көрсетеді
            console.log('Axios Interceptor: Setting Accept-Language to', currentLanguage, 'for URL:', config.url);
        } else {
            console.warn('Axios Interceptor: i18n.language is not defined. Accept-Language header will not be set.');
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export default api;