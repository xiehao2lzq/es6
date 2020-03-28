import React, { Component } from "react";
import { div } from "@/decorators/div";
import FullscreenLayout from "@/layout/FullscreenLayout";
import { FormComponentProps } from "antd/lib/form";
import { Dispatch, AnyAction } from "redux";
import Cookies from "js-cookie";
import { withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";
import { Form, Icon, Input, Button, Checkbox, message,Select } from "antd";
import { login,owmAppId } from "@/api";
const { Option } = Select;
import "./index.scss";

interface LoginFormProps extends FormComponentProps {
    handleSubmit(form);
}

const LoginForm = Form.create<LoginFormProps>({ name: "login" })(
    class extends Component<LoginFormProps, any> {
        state = {
            loading: false,
            list:[]
        };
        formHandleSubmit = e => {
            e.preventDefault();
            let { form } = this.props;
            form.validateFields(async (err, values) => {
                if (!err) {
                    this.setState({ loading: true });
                    this.props.handleSubmit(values);
                    this.setState({ loading: false });
                }
            });
        };
        search = async()=>{
            let { form } = this.props;
            form.setFieldsValue({
                own_app_id:undefined
            })
            let username = form.getFieldsValue(['username']);
            if(username.username === '' || username.username.length != 11)return false
            const[err,list] = await owmAppId(username)
            if(err)return
            console.log(list)
            this.setState({
                list
            },()=>{
                if(!this.state.list || this.state.list.length<1)return
                form.setFieldsValue({
                    own_app_id:list[0].own_app_id
                })
            })
        }
        render() {
            const { getFieldDecorator } = this.props.form;
            const { list } = this.state
            return (
                <Form onSubmit={this.formHandleSubmit} className="login-form">
                    <Form.Item>
                        {getFieldDecorator("username", {
                            rules: [
                                {
                                    required: true,
                                    min:11,
                                    max:11,
                                    message: "请正确的手机号!"
                                }
                            ]
                        })(
                            <Input prefix={
                                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                                }
                                placeholder="手机号"
                                onBlur  = { this.search }
                            />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator("password", {
                            rules: [
                                {
                                    required: true,
                                    message: "请输入密码!"
                                }
                            ]
                        })(
                            <Input
                                prefix={
                                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                                }
                                type="password"
                                placeholder="密码"
                            />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator("own_app_id", {
                            rules: [
                                {
                                    required: true,
                                    message: "请选择商会"
                                }
                            ],
                            initialValue:list&&list.length>0?list[0].own_app_id:undefined
                        })(<Select placeholder = '请选择商会'>
                            {list&&list.map((item,index)=>(
                                <Option key = {item} value = {item.own_app_id}>{item.getcommerce[0].name}</Option>
                            ))}
                        </Select>)}
                    </Form.Item>
                    <Form.Item>
                        {/* {getFieldDecorator("remember", {
                            valuePropName: "checked",
                            initialValue: true
                        })(<Checkbox>记住我！</Checkbox>)} */}
                        {/* <a className="login-form-forgot" href="">
                            Forgot password
                        </a> */}
                        <Button type="primary" htmlType="submit" className="login-form-button" loading={this.state.loading} >登 录 </Button>
                    </Form.Item>
                </Form>
            );
        }
    }
);

interface LoginProps {
    dispatch: Dispatch<AnyAction>;
    user: any;
}
@(div({
    name: "login",
    route: ["/", {exact: true}],
    component: FullscreenLayout,
    state: {
        userInfo: {}
    },
    reducers: {
        user(state, userInfo) {
            return {
                ...state,
                userInfo
            };
        }
    },
    sagas: {
        *loginController(action, { call, put }) {
            const [err, user] = yield call(login, action.payload);
            // console.log(user.token)
            if (err) return
            yield put({ type: "login/user", data: user });
        }
    }
}) as any)
@(withRouter as any)
export default class Login extends Component<RouteComponentProps & LoginProps & LoginFormProps, any> {
    constructor(props) {
        super(props);
    }
    componentWillReceiveProps(nextProps) {
        const { data } = nextProps.login.userInfo
       
        Cookies.set("token", data.token);
        Cookies.set("username", data.username);
        Cookies.set("head_portrait", data.head_portrait);
        Cookies.set("own_app_id", data.own_app_id);

        this.props.history.push('/index');
    }
    loginHandleSubmit = values => {
        this.props.dispatch({
            type: "login/loginController",
            payload: { ...values }
        });
    };
    render() {
        return (
            <div className="login-layout">
                <div className="login-content">
                    <LoginForm handleSubmit={this.loginHandleSubmit} />
                </div>
            </div>
        );
    }
}

