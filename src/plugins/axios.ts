import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { ElLoading } from 'element-plus';
import { useUserStore } from '@/stores/user';
const token = localStorage.getItem('access_token');

export const axiosApi: AxiosInstance = axios.create({
    baseURL: 'https://test-api.storexweb.com/api/',
    headers: {
        'Content-type': 'application/json',
    }
})

// Global Loading shared in all http requests
let loading: any;

axiosApi.interceptors.request.use((config: AxiosRequestConfig) => {
    if (config.headers === undefined) {
        config.headers = {};
    }
    const userStore = useUserStore();
    config.headers['Authorization'] = `Bearer ${userStore.authorisation.token}`;
    loading = ElLoading.service({
        lock: true,
        text: 'Loading',
    })
    return config
}, (error) => {
    loading.close();
    return Promise.reject(error);
})



axiosApi.interceptors.response.use((res) => {
    loading.close();
    return res
}, (error) => {
    if (error.response.status === 401) {
        const userStore = useUserStore();
        userStore.logout();
    }
    loading.close();
    return Promise.reject(error);
})

export const useAxios = () => ({ axios: axiosApi })
