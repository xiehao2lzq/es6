import { GET, POST, UPLOAD } from '@/utils/fetch'


export const getMenu = () => GET('/web/admin/Menu/getMenu')
//登录
export const login = (param) => POST('/web/admin/login',param);

export const owmAppId = (param) =>POST('web/admin/login/getOwn',param)

// 上传图片
export const addPic = (formData, onUploadProgress = null) => UPLOAD(formData,onUploadProgress)