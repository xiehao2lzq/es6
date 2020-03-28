import React, { Component } from 'react';
import {Form,Input,Button} from 'antd';
import {editPassword} from './../../../api'
import Cookie from 'js-cookie'
import './index.scss'
class PassWord extends Component<any,any>{
    state={
        confirmDirty: false,
        autoCompleteResult: [],
    }
    editPasswords=async (param)=>{
        const [err,data] = await editPassword(param)
        if(err) return console.warn(err)
        Cookie.remove('token')
        window.location.href = '/commerce'
        
    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
            this.editPasswords(values)
          }
        });
      };
      handleConfirmBlur = e => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
      };
     
      compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password')) {
          callback('两次输入的密码不一致！');
        } else {
          callback();
        }
      };
      validateToNextPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      };
    
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 8 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 16 },
            },
          };
          const tailFormItemLayout = {
            wrapperCol: {
              xs: {
                span: 24,
                offset: 0,
              },
              sm: {
                span: 16,
                offset: 8,
              },
            },
          };
        return (
            <div className='PassWord'>
             <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                   
                    <Form.Item label="原密码" hasFeedback>
                    {getFieldDecorator('oldpassword', {
                        rules: [
                        {
                            required: true,
                            message: '请输入原始密码！',
                        },
                        {
                            validator: this.validateToNextPassword,
                        },
                        ],
                    })(<Input.Password />)}
                    </Form.Item>
                    <Form.Item label="新密码" hasFeedback>
                    {getFieldDecorator('password', {
                        rules: [
                        {
                            required: true,
                            message: '请输入新密码！',
                        },
                        {
                            validator: this.validateToNextPassword,
                        },
                        {
                            pattern:new RegExp(/(?=.*([a-zA-Z].*))(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&*()]{6,20}$/),
                            message:'密码必须为至少六位数字+英文字母组合！'
                        },
                        ],
                    })(<Input.Password />)}
                    </Form.Item>
                    <Form.Item label="确认密码" hasFeedback>
                    {getFieldDecorator('repassword', {
                        rules: [
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        {
                            validator: this.compareToFirstPassword,
                        },
                        ],
                    })(<Input.Password onBlur={this.handleConfirmBlur} />)}
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">
                            提交
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

export default Form.create({ name: 'PassWord' })(PassWord);
