import { GET, POST } from '@/utils/fetch'
//首页
export const activeList = (param) => GET('/web/admin/homepage/activeList',param)//会议列表
export const contentList = (param) => GET('/web/admin/homepage/contentList',param)//资讯列表
export const homeList = () => GET('/web/admin/homepage/homeList')//轮播用户信息
export const contentDetail = (param) => GET('/web/admin/homepage/contentDetail',param)//资讯详情

export const userinfoDetail = () => GET('/web/admin/UserInfo/userinfoDetail')
export const changeUserinfo = (param) => POST('/web/admin/UserInfo/changeUserinfo',param)
//gongxu
export const owntcList = (param) => GET('/web/admin/tradeChances/owntcList',param)
export const ownTcAdd = (param) => POST('/web/admin/tradeChances/ownTcAdd',param) //供需发布
export const ownTcEdit = (param) => POST('/web/admin/tradeChances/ownTcEdit',param) //供需修改
export const submitTc = (param) => POST('/web/admin/tradeChances/submitTc',param) //供需审核
export const getLabel = () => GET('/web/admin/label/getLabel') //标签列表
export const delTc = (param) => POST('/web/admin/tradeChances/delTc',param) //删除
export const noticeList = (param) => GET('/web/admin/notice/noticeList',param) //通知管理
export const delNotice = (param) => GET('/web/admin/notice/delNotice',param) //删除通知
export const delDues= (param) => GET('/web/admin/myDues/delDues',param) //会费记录删除
export const myduesList= (param) => GET('/web/admin/myDues/myduesList',param) //会费记录删除
export const editPassword= (param) => POST('/web/admin/editPassword',param) //修改密码