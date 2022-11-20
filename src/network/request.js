import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
export function request(config) {
    const instance = axios.create({
        baseURL: 'http://localhost:3001',
        timeout: 50000
    })
    instance.interceptors.request.use(config => {
        config.headers.Authorization = sessionStorage.getItem('token')
        NProgress.start();
        return config
    })
    instance.interceptors.response.use(config => {
        NProgress.done();
        return config;
    })
    return instance(config)
}