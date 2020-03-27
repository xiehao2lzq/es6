import axios from 'axios'
import { message } from 'antd';
// import React from 'react'
// import ReactDOM from 'react-dom';
import EventUtil from './eventUtil'
import Cookies from 'js-cookie';

import {
    BASE_URL as baseURL,
    headers,
    GLOBAL_LOADING
} from './config';

import { to } from '@/utils/util'

interface Resp {
    pageInfo: any;
    list: any;
    data?: any;
    status?:string | number;
} 

// 测试
const own_app_id = 1

// 响应成功 code
const respSuccCode: string = '200'

// 在此配置code后 不会主动弹出错误提示框 将错误处理权交给页面
const respErrCodeWhiteList: string = ''

// 在respCodeWhiteList没有配置错误code时 会默认调用该函数处理错误信息
const customErrorTips = (data: any): void => {
    message.error(data.msg);
}

// 显示全局loading
const showSpin = () => {
    GLOBAL_LOADING && EventUtil.tiggerEvent(EventUtil.EventType.FETCH_DATA, true)
}

// 隐藏全局loading
const hideSpin = () => {
    GLOBAL_LOADING && EventUtil.tiggerEvent(EventUtil.EventType.FETCH_DATA, false)
}

const instance = axios.create({
    baseURL,
    timeout: 10000,
});

//请求临时token便于开发
async function getToken() {
    const res = await axios({
        url: 'https://coc.ctrl.cn:6060/api/login/login?user=member'
    })
    Cookies.set('tokenUcenter',res.data)
}
getToken();

// // 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // console.log(config)
    // 在发送请求之前做些什么
    let headers:any = {}
    if(config.url !== 'image_upload'){
        headers = {
            'x-requested-with':'XMLHttpRequest',
            'Authorization': 'Bearer ' + Cookies.get('tokenUcenter')
        }
    }
    config.headers = headers
    showSpin()
    return config;
}, function (error) {
    hideSpin()
    // 对请求错误做些什么
    return Promise.reject(error);
});


// 添加响应拦截器
instance.interceptors.response.use(
    res => {
        const { status, data, config: { url } } = res
        hideSpin()
        // 网络错误
        if (status !== 200) {
            message.error(`${status} 网络错误`);
            console.error(`request error url = ${url} statusCode ${status} data ${data}`)
            return to(Promise.reject(new Error(`${url} 请求错误 res.status = ${status}`)))
        }
        // 业务请求异常
        if (respSuccCode != data.code) {
            if (!respErrCodeWhiteList.includes(data.code)) {
                console.error(`request error url = ${url} data = ${JSON.stringify(data)}} respCodeWhiteList call`)
                customErrorTips(data)
                return to(Promise.reject(data))
            }
            console.error(`request error url = ${url} data = ${JSON.stringify(data)}}`)
            return to(Promise.reject(data))
        }
        // 请求成功
        return to(Promise.resolve(data.data))
    },
    error => {
        hideSpin()
        console.error(`request error `, error)
        
        if(error.response.status == 401){
            error && error.response && message.error(`登录失效`)
            // Cookies.remove('mobile')
            // Cookies.remove('tokenUcenter')
            // Cookies.remove('_act_ctrl')
            setTimeout(()=>{
                window.location.href = 'https://xcx.ctrl.cn:6060/api/login/logout?urlcode=https://coc.ctrl.cn'
            },500)  
        }else{
            error && error.response && message.error(`${error.response.status} 网络错误`)
        }
        return to(Promise.reject(error))
    }
)
interface GetParams {
    key: {
        param: object
        pageInfo?: object
    }
}
// 构建get请求参数
function normalizeGetParams(params): Object {
    let obj = { key: {} } as GetParams
    let _params = Object.assign({}, params)
    const { curpage, pageSize } = _params

    // 如果有分页参数
    if (pageSize) {
        delete _params.curpage
        delete _params.pageSize
        obj.key.pageInfo = {
            curpage,
            pageSize
        }
    }
    obj.key.param = {
        own_app_id,
        ..._params
    }
    return obj
}

// 构建get请求参数
function normalizePostParams(params): Object {
    return {
        param: {
            own_app_id,
            ...params
        }
    }

}
// get 请求方法
function GET(url: string, params?: object): Promise<Array<Resp>> {
    return instance.get(url, { params: normalizeGetParams(params) })
}
// function GETFFORM async(url: string, params?: object): Promise<Array<Resp>> {
//     const res =  await axios({
//         url: 'https://coc.ctrl.cn:6060/api/login/login?user=member'
//     })
// }
// post 请求方法
function POST(url: string, data: object,type:number=0 ): Promise<Array<Resp>> {
    if(type){
        return instance.post(url, normalizePostParams(data),{baseURL:'https://coc.ctrl.cn:6060/api'})
    }
    return instance.post(url, normalizePostParams(data))
}

// 上传 请求方法
function UPLOAD(url: string,data): Promise<Array<Resp>> {
    data.set('own_app_id',own_app_id)
    console.log(data.get('files'))
    return instance.post(url, data)
}
// 上传 请求方法
function UPLOADs(data: object, onUploadProgress = null): Promise<Array<any>> {
    return instance.post('image_upload', data, { baseURL: "https://xcx.ctrl.cn:6061/", onUploadProgress })
}


// function put(url, data) {
//     return fetch(baseURL + url, {
//         method: 'PUT',
//         headers: headers,
//         body: JSON.stringify(data)
//     }).then(response => {
//         return handleResponse(url, response);
//     }).catch(err => {
//         // console.error(`Request failed. Url = ${url} . Message = ${err}`);
//         return { error: { message: 'Request failed.' } };
//     })
// }


// function handleResponse(url, response) {
//     if (response.status < 500) {
//         return response.json();
//     } else {
//         // console.error(`Request failed. Url = ${url} . Message = ${response.statusText}`);
//         return { error: { message: 'Request failed due to server error ' } };
//     }
// }

export {
    GET,
    POST,
    UPLOAD,
    UPLOADs,
    own_app_id
    // put,
    // upload
}
