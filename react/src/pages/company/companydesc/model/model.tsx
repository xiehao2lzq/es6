import React, { Component } from "react";
import { div } from "@/decorators/div";
import HomeLayout from "@/layout/HomeLayout";
import { IMG_URL } from "@/utils/config";
import { Button, Modal, Form, Select, Input, Upload, Icon, } from 'antd';
import { postChangeBusiness, addPic } from "@/api/index";
import UploadImage from "../../UploadImage";
import BraftEditor from 'braft-editor'
import "./../index.scss"
import { BraftEditorIMG } from "@/utils/util"
import NoticeSize from '@pages/compoents/noticeSize'

const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
class CompanydescModel extends Component<any, any> {
    state = {
        is_pass: { 1: '审核通过', 2: '未通过', 3: '待审核' },
        visible: this.props.visible
    }
    handleOk = async()=>{
       
       this.props.form.validateFields( async(error,values)=>{
           if(!error){
                let data =  this.props.form.getFieldsValue()
                data.describe = BraftEditorIMG(data.describe.toHTML())
                let [err,success] = await postChangeBusiness(data)
                if(err) return false
                this.props.getCompanyInfo()
                this.props.closeModal()
           }
       })
       
        
    }
    onChangeLogoImg = (url) => {
        this.props.form.setFieldsValue({
            'logo': url
        })
    }
    onChangeImg = (url) => {
        this.props.form.setFieldsValue({
            'img': url
        })
    }

    // 富文本上传
    myUploadFn = async (param) => {
        const fd = new FormData()
        const successFn = (pic) => {
            // 假设服务端直接返回文件上传后的地址
            // 上传成功后调用param.success并传入上传后的文件地址
            param.success({
                url: IMG_URL + pic.filename,
                meta: {
                    id: 'xxx',
                    title: 'xxx',
                    alt: 'xxx',
                    loop: true, // 指定音视频是否循环播放
                    autoPlay: true, // 指定音视频是否自动播放
                    controls: true, // 指定音视频是否显示控制栏
                    // poster: 'http://xxx/xx.png', // 指定视频播放器的封面
                }
            })
        }
        const progressFn = (event) => {
            // 上传进度发生变化时调用param.progress
            param.progress(event.loaded / event.total * 100)
        }
        const errorFn = () => {
            // 上传发生错误时调用param.error
            param.error({
                msg: 'unable to upload.'
            })
        }
        fd.append('file', param.file)

        let [err, data] = await addPic(fd, progressFn);
        if (err) return errorFn()
        successFn(data)
    }


    render() {
        let { is_pass, visible } = this.state;
        const { form: { getFieldDecorator }, detail} = this.props;
        const formItemLayout = {
            labelCol: {
                xs: { span: 8 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        const myAccept = {
            image: 'image/png,image/jpeg,image/gif',
            video: '',
            audio: ''
        };
        const size = {height:600,width:600}
        return (<Modal
            title="企业信息编辑"
            visible={visible}
            onOk={this.handleOk}
            onCancel={this.props.closeModal}
            okText = "确认"
            cancelText="关闭"
            width={800}
        >
            <Form {...formItemLayout}>
                <Form.Item label='LOGO' className="logoHeight" >
                    {
                        getFieldDecorator('logo', {
                            rules: [
                                // {
                                //     required: true,
                                //     message: '这是必填项'
                                // }
                            ],
                            initialValue: detail.logo
                        })( <UploadImage  size ={ size } image={detail ? detail.logo : ""} type={'basic-logo'} onChangeLogoImg={this.onChangeLogoImg} />)
                    }
                    <NoticeSize title='建议尺寸：88*88' />
                </Form.Item>
                
                <Form.Item label='公司标签'>
                    {
                        getFieldDecorator('tag', {
                            rules: [
                                {
                                    required: true,
                                    message: '这是必填项,多个标签请用英文字符‘,’(逗号)隔开'
                                },
                                {
                                    pattern: new RegExp(/^[^\uff0c]+$/, "g"), message: "多个标签请用英文字符‘,’(逗号)隔开",
                                },
                                {
                                    max	: 12,
                                    message:'最多填写12个字符'
                                }
                            ],
                            initialValue: detail.tag
                        })(<Input placeholder="请填写标签，多个请用英文字符‘,’(逗号)隔开" />)
                    }
                </Form.Item>
                <Form.Item label='公司地址'>
                    {
                        getFieldDecorator('address', {
                            rules: [
                                {
                                    required: true,
                                    message: '这是必填项'
                                }
                            ],
                            initialValue: detail.address
                        })(<Input placeholder="请填写公司地址" />)
                    }
                </Form.Item>
                <Form.Item label='企业官网'>
                    {
                        getFieldDecorator('website', {
                            rules: [
                                // {
                                //     required: true,
                                //     message: '这是必填项'
                                // }
                            ],
                            initialValue: detail.website
                        })(<Input placeholder="请填写企业官网" />)
                    }
                </Form.Item>
                <Form.Item label='企业热线'>
                    {
                        getFieldDecorator('mobile', {
                            rules: [
                                {
                                    required: true,
                                    message: '这是必填项'
                                }
                            ],
                            initialValue: detail.mobile
                        })(<Input placeholder="请填写企业热线" />)
                    }
                </Form.Item>
                <Form.Item label='官方微信'>
                    {
                        getFieldDecorator('wechat', {
                            rules: [
                                // {
                                //     required: true,
                                //     message: '这是必填项'
                                // }
                            ],
                            initialValue: detail.wechat
                        })(<Input placeholder="请填写官方微信" />)
                    }
                </Form.Item>
                <Form.Item label='封面图'>
                    {
                        getFieldDecorator('img', {
                            rules: [
                                {
                                    required: true,
                                    message: '这是必填项'
                                }
                            ],
                            initialValue: detail.img
                        })(<UploadImage image={detail ? detail.img : ""} type={'basic-bg'} onChangeLogoImg={this.onChangeImg} />)
                    }
                    <NoticeSize title='建议尺寸：330*265' />
                </Form.Item>
                <Form.Item label= "企业简介">
                    {
                        getFieldDecorator('intro', {
                            rules: [
                                {
                                    required: true,
                                    message: '这是必填项'
                                },
                                {
                                    max: 100,
                                    message: '最多100个字！'
                                }
                            ],
                            initialValue: detail.intro
                        })(<TextArea
                            placeholder="请填写企业简介"
                            autoSize={{ minRows: 3, maxRows: 5 }}
                        />)
                    }
                </Form.Item>
                <FormItem label='企业描述' >
                    {getFieldDecorator('describe', {
                        rules: [{
                            required: true,
                            validator: (_, value, callback) => {
                                if (value.isEmpty()) {
                                    callback('请输入正文内容')
                                } else {
                                    callback()
                                }
                            }
                        }],
                        initialValue: BraftEditor.createEditorState(detail.describe)
                    })(
                        <BraftEditor
                            media={{ uploadFn: this.myUploadFn, accepts: myAccept }}
                            className="my-editor"
                            style={{ border: '1px solid #e8e8e8' }}
                        />
                    )}
                </FormItem>
            </Form>
            
        </Modal>)
    }
}

const CompanydescModelForm = Form.create<any>({ name: 'CompanydescModel' })(CompanydescModel);
export default CompanydescModelForm