import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Layout, Menu, Icon, Breadcrumb, Typography, Spin } from "antd";
import { RouteComponentProps } from "react-router";
import Cookies from "js-cookie";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import EventUtil from '@/utils/eventUtil'
import { getMenu } from '@/api/base';
import GobalHeader from './GobalHeader'



const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;
const { Title } = Typography;

import "./HomeLayout.scss";

export interface route {
    path: string;
    breadcrumbName: string;
    icon: string;
    children?: route[];
    is_hidden?: number // 是否隐藏 0 隐藏
}

interface BreadProps {
    routes: route[];
}
interface MenuProps extends BreadProps {
    selectedKeys: Array<string>;
    defaultOpenKeys: Array<string>;
    onSelect: ({ item, key, keyPath, selectedKeys, domEvent }) => void;
}

//面包屑导航生成组件
const Bread = withRouter(
    class BreadComponent extends React.Component<
        RouteComponentProps & BreadProps,
        any
        > {
        render() {
            let { location, routes } = this.props;

            let pathSnippets = location.pathname.split("/").filter(i => i);

            let currentRoot: route[] | any = routes;
            let extraBreadcrumbItems =
                routes.length > 0 ? (
                    pathSnippets.map((_, index) => {
                        currentRoot = currentRoot && currentRoot.filter(
                            // item => item.path === `/${_}`
                            item => item.path.startsWith(`/${_}`)
                        );
                        if (currentRoot && currentRoot.length > 0) {
                            let name = currentRoot[0] ? currentRoot[0].breadcrumbName : ""; //判断是否具有面包屑
                            currentRoot = currentRoot[0] ? currentRoot[0].children : null;
                            return (
                                <Breadcrumb.Item key={_}>{name}</Breadcrumb.Item>
                            );
                        }
                        return <Breadcrumb.Item key="999"></Breadcrumb.Item>
                    })
                ) : (
                        <Breadcrumb.Item key="999"></Breadcrumb.Item>
                    );
            const BreadcrumbItems = [
                <Breadcrumb.Item key="home">
                    <Link className="HomeLink" to="/">
                        {routes.map((_, index) => {
                            return index === 0 && _.breadcrumbName;
                        })}
                    </Link>
                </Breadcrumb.Item>
            ].concat(extraBreadcrumbItems);

            return <Breadcrumb>{BreadcrumbItems}</Breadcrumb>;
        }
    }
);


//左侧导航生成组件
const BaseMenu: React.FC<MenuProps> = props => {
    return (
        <Menu
            theme="dark"
            mode="inline"
            selectedKeys={props.selectedKeys}
            defaultSelectedKeys={["/"]}
            onSelect={props.onSelect}
            defaultOpenKeys={props.defaultOpenKeys}
            className="home-layout-menu"
        >
            {props.routes.map((_, index) => {
                return _.children ? (
                    <SubMenu
                        key={_.path}
                        title={
                            <span>
                                {_.icon.includes("icon") ? (
                                    <span className={`iconfont ${_.icon}`} />
                                ) : (
                                        <Icon type={_.icon} />
                                    )}
                                <span>{_.breadcrumbName}</span>
                            </span>
                        }
                    >
                        {_.children.map((__, sindex) => {
                            return __.is_hidden === 0 ? null : (
                                <Menu.Item key={_.path + __.path} >
                                    <Link to={_.path + __.path}>
                                        {__.icon.includes("icon") ? (
                                            <span
                                                className={`iconfont ${__.icon}`}
                                            />
                                        ) : (
                                                <Icon type={__.icon} />
                                            )}
                                        {__.breadcrumbName}
                                    </Link>
                                </Menu.Item>
                            );
                        })}
                    </SubMenu>
                ) : (
                        <Menu.Item key={_.path}>
                            <Link to={_.path}>
                                {_.icon.includes("icon") ? (
                                    <span className={`iconfont ${_.icon}`} />
                                ) : (
                                        <Icon type={_.icon} />
                                    )}
                                <span>{_.breadcrumbName}</span>
                            </Link>
                        </Menu.Item>
                    );
            })}
        </Menu>
    );
}

class HomeLayout extends React.Component<any, any> {
    state = {
        collapsed: false,
        selectedKeys: [],
        openKeys: [],
        showPhone: true,
        username: Cookies.get("username"),
        routes: [],
        showSpin: false
    };

    constructor(props) {
        super(props)
        NProgress.set(0.7);
        EventUtil.addListener(EventUtil.EventType.FETCH_DATA, this._toggleSpin)
    }

    componentWillUnmount() {
        EventUtil.removeListener(EventUtil.EventType.FETCH_DATA, this._toggleSpin)
    }

    _toggleSpin = (flag) => {
        this.setState({
            showSpin: flag
        })
    }

    componentWillMount() {
        this.loadMenu()
        let { pathname } = this.props.location;
        this.setState({
            selectedKeys: [pathname],
            openKeys: pathname
                .split("/")
                .filter((item, index) => item && index == 1)
                .map(item => `/${item}`)
        });
    }

    async loadMenu() {
        const [err, res] = await getMenu()
        if (err) return
        this.setState({
            routes: res,
        }, () => {
            setTimeout(() => NProgress.done(), 300)
        })
    }
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
            showPhone: !this.state.showPhone
        });
    };
    change({ item, key, keyPath, selectedKeys, domEvent }) {
        this.setState({
            selectedKeys: keyPath
        });
    }
    render() {
        const { children } = this.props;
        const { routes, showSpin } = this.state;
        return (
            <div className="page-all">
                <Layout>
                    {/* height: '100vh', position: 'fixed', left: 0,  */}
                    <Sider
                        trigger={null}
                        collapsible
                        collapsed={this.state.collapsed}
                        style={{ overflow: "auto" }}
                    >
                        <div
                            className={
                                this.state.showPhone ? "logo" : "logo textAlign"
                            }
                        >
                            <img src={require('@/assets/images/logo.png')} />
                            <span className="phone-number">
                                {this.state.username}
                            </span>
                        </div>
                        <BaseMenu
                            routes={routes}
                            selectedKeys={this.state.selectedKeys}
                            defaultOpenKeys={this.state.openKeys}
                            onSelect={this.change.bind(this)}
                        />
                    </Sider>
                    {/* style={{ marginLeft: 200 }} */}
                    {/* style={{ height: "100vh" }} */}
                    <Layout>
                        {/* position: 'fixed', top: 0, width: '100%', zIndex: 999 */}
                        <Header className="layout-header">
                            <Icon
                                className="trigger"
                                type={
                                    this.state.collapsed
                                        ? "menu-unfold"
                                        : "menu-fold"
                                }
                                onClick={this.toggle}
                            />
                        {/* <span className='username'>{Cookies.get('username')}</span> */}
                        <GobalHeader history={this.props.history} />
                        </Header>
                      
                        {/* marginTop: 88, */}
                        <Content className="layout-content">
                            <Title className="breadcrumb-panel">
                                {/* <Breadcrumb
                                    itemRender={itemRender}
                                    routes={routes}
                                /> */}
                                <Bread routes={routes} />
                            </Title>
                            <div className="routes-content">
                                {
                                    showSpin && <div className="spin-wrapper" onClick={e => { e.stopPropagation() }}><Spin size="large" /></div>}
                                {children}
                            </div>
                        </Content>
                    </Layout>
                </Layout>
            </div>
        );
    }
}

export default withRouter(HomeLayout);
