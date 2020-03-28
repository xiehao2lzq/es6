import Cookies from 'js-cookie'

// 是否显示全局loding
const GLOBAL_LOADING = true

// 请求相关配置
// 01.正式地址
let BASE_DOMAIN = `https://coc.ctrl.cn:6060`
let BASE_URL = `${BASE_DOMAIN}/`
//图片
let IMG_URL = 'https://xcx.ctrl.cn:6061/'
// 02.测试地址
let BASE_TEST_URL = "https://cms.face-books.cn"

// Cookies.set('tokenUcenter', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wveGN4LmN0cmwuY246NjA2MFwvYXBpXC9sb2dpblwvY2FsbGJhY2siLCJpYXQiOjE1NzM4Njc4NzgsImV4cCI6MTU3NDI5OTg3OCwibmJmIjoxNTczODY3ODc4LCJqdGkiOiJyeDg0eDg2NVp4Rm53U1NtIiwic3ViIjoxNSwicHJ2IjoiMjIxOWYxMGM4NjAzMmMxMjI5ZDU5ZThjNzYzYTYzZTQ0YzJjNjEyMyIsInJvbGUiOiJtZW1iZXIifQ.2U-mQsqGiGRgBq6iHE-tir-_BxauP4HFb0bo_So6Xp4')
// console.log('---cookie---', Cookies.get('tokenUcenter'))

// 03.header设置
let headers = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + Cookies.get('tokenUcenter')
});

let headers1 = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
});

export {
    BASE_DOMAIN,
    BASE_URL,
    BASE_TEST_URL,
    headers,
    GLOBAL_LOADING,
    IMG_URL
}