import * as React from 'react'
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Cookies from "js-cookie";
// import { getCookie, getUrlValue, formatDate } from '@/utils/util'
import { Dropdown, Menu, Icon, Badge } from 'antd';
import {IMG_URL} from './../../utils/config'
import './index.scss'
// import { getTplInfo } from "@/redux/manage/action"
// import { unreadNoticeListApi, readAllNoticeApi, getTplInfoApi } from '@/api'

interface Props {
    // manage?: {
    //     tplInfo: {
    //         app_name: string
    //     }
    // }
}
interface IState {
    noticeNull: boolean
    unreadNum: number
    unreadNoticeList: Array<any>
}

const mapStateToProps = (state) => {
    console.log(state,'data')
    return {
        // manage: state.manage,
    };
};
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        // getTplInfo,
    }, dispatch)
};

@(connect(
    mapStateToProps,
    // mapDispatchToProps
) as any)
class GobalHeader extends React.Component<any> {
    constructor(props: Props){
        super(props);
    }
    public state: IState = {
        noticeNull: true,
        unreadNum: 0,
        unreadNoticeList: [
            // {
            //     id: 1,
            //     title: '可视化平台最新通知公告 可视化平台最新通知公告可视化平台最新通知公告',
            //     content: '开创云提交于 2019-11-25，需在 2019-11-30 前完成代码变更任务,开创云提交于 2019-11-25，需在 2019-11-30 前完成代码变更任务1',
            //     type: '系统通知',
            //     readed: 0,
            //     created_at: '2019-11-26 11:23:46'
            // },{
            //     id: 2,
            //     title: '可视化平台最新通知公告',
            //     content: '开创云提交于 2019-11-25，需在 2019-11-30 前完成代码变更任务2',
            //     type: '系统通知',
            //     readed: 0,
            //     created_at: '2019-11-26 11:23:46'
            // },{
            //     id: 3,
            //     title: '可视化平台最新通知公告',
            //     content: '开创云提交于 2019-11-25，需在 2019-11-30 前完成代码变更任务3',
            //     type: '系统通知',
            //     readed: 0,
            //     created_at: '2019-11-26 11:23:46'
            // },
        ]
    }
    
    componentWillMount() {
        // this.getTplInfo()
        // this.unreadNoticeList()
    }

    // 1.获取应用信息
    // async getTplInfo() {
    //     const [res, err] = await getTplInfoApi(this.props.manage.paramObj1)
    //     if (err) return console.log('获取应用信息请求出错了')
    //     this.props.getTplInfo(res.data)
    // }
    // 1.获取未读通知列表
    // async unreadNoticeList() {
    //     const paramObj = {
    //         param: {
    //             own_app_id: this.props.manage.own_app_id,
    //             num: 3
    //         },
    //     }
    //     const [res, err] = await unreadNoticeListApi(JSON.stringify(paramObj))
    //     if (err) return console.log('获取未读通知列表请求出错了')
    //     this.setState({
    //         unreadNum: res.data.count,
    //         unreadNoticeList: res.data.list
    //     })
    // }
    // 2.全部已读
    // async readAllNotice() {
    //     if(this.state.unreadNoticeList.length>0){
    //         const paramObj = {
    //             param: {
    //                 own_app_id: this.props.manage.own_app_id,
    //                 type: 2
    //             }
    //         }
    //         const [res, err] = await readAllNoticeApi(JSON.stringify(paramObj))
    //         if (err) return console.log('读取全部消息请求出错了')
    //         this.setState({
    //             unreadNum: 0,
    //             unreadNoticeList: []
    //         })
    //     }
    // }

    // 04.读取全部消息
    readAllNoticeClick = () => {
        // this.readAllNotice()
    }
    // 01.个人中心
    onClick = ({ key }) => {
        // console.log(`Click on item ${key}`);
        // return  console.log(this.props);
        if(key==1){ 
            this.props.history.push({pathname:'/usermanage/setPassWord'})
        }else if(key==2){
            Cookies.remove('token')
            Cookies.remove('username')
            Cookies.remove('head_portrait')
            Cookies.remove('own_app_id')
            window.location.href = 'https://coc.ctrl.cn/commerce/#/'
        }
    };
    // 02.消息通知
    noticeClick = ({ key }) => {
        console.log(`Click on item ${key}`);
        if(key){
            this.props.history.push({ pathname: `/setUp/messageNotification`});
            console.log('跳转到消息详情页面: id=' + key)
        }
    };
    // 03.跳转消息列表页面
    toNoticeList = () => {
        this.props.history.push({ pathname: `/setUp/messageNotification`});
    }

    public render() {
        const { noticeNull, unreadNum, unreadNoticeList } = this.state
        // const { tplInfo } = this.props.manage
        // 01.个人中心-下拉菜单
        const menuList = (
            <div className="userBox">
                <Menu onClick={this.onClick}>
                    {/* {tplInfo.app_name} */}
                    {/* <Menu.Item key="1"><Icon type="home" />切换小程序</Menu.Item> */}
                    <Menu.Item key="1"><Icon type="setting" />修改密码</Menu.Item>
                    <Menu.Item key="2"><Icon type="logout" />退出登录</Menu.Item>
                </Menu>
            </div>
        );
        // 02.1 消息通知列表
        const noticeItem = unreadNoticeList.map((item) => {
            return <Menu.Item key={item.id}>
                <div className="noticeItem">
                    <h3>{item.title}</h3>
                    <p>{item.content}</p>
                    {/* <p className="date">{formatDate(new Date(item.created_at*1000))}</p> */}
                </div>
            </Menu.Item>
        })
        // 02.个人中心-消息通知
        const noticeList = (
            <div className="noticeBox">
                <div className="topTitle">
                    <div className="left">通知</div>
                    <div className="right" onClick={this.readAllNoticeClick}>全部已读</div>
                </div>
                <div className="noticeList">
                    {unreadNoticeList.length>0?
                        <Menu onClick={this.noticeClick}>
                            {noticeItem}
                        </Menu>
                        :
                        <div className="noticeItem noticeNone">
                            <img src={require('../../assets/images/notice_none_icon.svg')} alt=""/>
                            <p>您已查看所有通知</p>
                        </div>
                    }
                </div>
                <div className="bottomButton" onClick={this.toNoticeList}>前往通知中心</div>
            </div>
        );

        return (
            <div className="rightUserInfo">
                <ul className="list">
                    <li className="item">
                        {/* trigger={['click']} */}
                        <Dropdown overlay={menuList} placement="bottomCenter">
                            <a className="ant-dropdown-link">
                                <span>个人中心</span>
                                <div className="userIcon">
                                    <img src={Cookies.get('head_portrait')?(IMG_URL+Cookies.get('head_portrait')):require("../../assets/images/iconUser.png")} alt=""/>
                                </div>
                            </a>
                        </Dropdown>
                    </li>
                    <li className="item">
                        {/* visible={false} */}
                       {false&&<Dropdown overlay={noticeList} placement="bottomRight">
                            <Badge count={unreadNum} overflowCount={9}>
                                <a className="ant-dropdown-link" onClick={this.toNoticeList}>
                                    <span>消息</span>
                                    <img src={require("../../assets/images/iconlingdang.png")} alt=""/>
                                </a>
                            </Badge>
                        </Dropdown>}
                    </li>
                </ul>
            </div>
        )
    }
}

// export default withRouter(GobalHeader)
export default  GobalHeader
