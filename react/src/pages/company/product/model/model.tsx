import React, { Component } from "react";
import { div } from "@/decorators/div";
import HomeLayout from "@/layout/HomeLayout";
import { IMG_URL } from "@/utils/config";
import { Button, Modal, Form, Select, Input, Radio, Icon, InputNumber,message} from 'antd';
import { postAddProductList, postEditProduct, addPic } from "@/api/index";
import UploadImage, { UploadManyPic } from "../../UploadImage";
import BraftEditor from 'braft-editor'
import "./../index.scss"
import { BraftEditorIMG } from "@/utils/util"
import NoticeSize from '@pages/compoents/noticeSize'
class ProductModel extends Component<any, any> {
    state = {
        visible: this.props.visible,
        piclist:[],
    }
    handleOk = ()=>{
        let { detail } = this.props
        this.props.form.validateFields().then(async()=>{
            let data = this.props.form.getFieldsValue()
            data.describe = BraftEditorIMG(data.describe.toHTML())
            if (detail) {
                data.id = detail.id
                let [err, success] = await postEditProduct(data)
                if (err) return false
            } else {
                let [err, success] = await postAddProductList(data)
                if (err) return false
            }
            this.props.getProductListInfo()
            this.props.closeModal()
        }).catch(({errors})=>{
            message.error('请按要求填写信息！');
        })        
        
    }
    onChangeLogoImg = (url) => {
        // console.log("img:"+url)
        this.props.form.setFieldsValue({
            'img': url
        })
    }
    componentDidMount(){
        const { detail } = this.props;
        if(detail){
            let piclist = [];
            detail.pictureList.map(item => {
                piclist.push(item.img)
            })
            this.setState({
                piclist
            })
        }
    }
    onChangeImg = (url,type) => {
        let { piclist } = this.state
        console.log("pic:" + url)
        if(type ==1){
            this.setState({
                piclist: [...piclist, url]
            }, () => {
                this.props.form.setFieldsValue({
                    'piclist': this.state.piclist
                })
            })
        }
        if(type ==0 ){
            this.setState({
                piclist: piclist.filter((item) => url.indexOf(item) == -1)
            }, () => {
                this.props.form.setFieldsValue({
                    'piclist': this.state.piclist
                })
            })
        }       
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
        let { visible, piclist } = this.state;
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
        return (<Modal
            title="产品与服务"
            visible={visible}
            onOk={this.handleOk}
            onCancel={this.props.closeModal}
            okText = "确认"
            cancelText = "关闭"
            width={800}
        >
            <Form {...formItemLayout}>
                <Form.Item label='产品名称'>
                    {
                        getFieldDecorator('name', {
                            rules: [
                                {
                                    required: true,
                                    message: '请填写这是必填项'
                                }
                            ],
                            initialValue: detail ? detail.name:''
                        })(<Input placeholder="请填写产品名称" />)
                    }
                </Form.Item>
                <Form.Item label='产品价格'>
                    {
                        getFieldDecorator('price', {
                            // rules: [
                            //     {
                            //         required: true,
                            //         message: '这是必填项'
                            //     }
                            // ],
                            initialValue: detail ? detail.price: ''
                        })(<InputNumber
                            style = {{ width:'100%' }}
                            placeholder="请填写产品价格"
                            min = {0}
                            // formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            // parser={value => value.replace(/\￥\s?|(,*)/g, '')}
                        />)
                    }
                </Form.Item>
                <Form.Item label='产品标签'>
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
                            initialValue: detail ? detail.tag:''
                        })(<Input placeholder="请填写标签，多个请用英文字符‘,’(逗号)隔开" />)
                    }
                </Form.Item>
                <Form.Item label='企业热线'>
                    {
                        getFieldDecorator('mobile', {
                            rules: [
                                {
                                    required: true, message: "联系方式不能为空",
                                }
                                // , {
                                //     pattern: new RegExp(/^1[3456789]\d{9}$/), message: "请输入正确手机号",
                                // }
                            ],
                            initialValue: detail? detail.mobile:''
                        })(<Input placeholder="请填写企业热线" />)
                    }
                </Form.Item>
                <Form.Item label='热门推荐'>
                    {
                        getFieldDecorator('is_hot', {
                            rules: [
                                {
                                    required: true,
                                    message: '这是必填项'
                                }
                            ],
                            initialValue: detail ? detail.is_hot:1
                        })(<Radio.Group >
                            <Radio value={1}>是</Radio>
                            <Radio value={0}>否</Radio>
                        </Radio.Group>)
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
                            initialValue: detail ? detail.img:''
                        })(<UploadImage image={detail ? detail.img: ""} type={'basic-bg'} onChangeLogoImg={this.onChangeLogoImg} />)
                    }
                     <NoticeSize title='建议尺寸：330*265' />  
                </Form.Item>
                <Form.Item label='轮播图'>
                    {
                        getFieldDecorator('piclist', {
                            rules: [
                                {
                                    required: true,
                                    message: '这是必填项'
                                }
                            ],
                            initialValue: detail ? piclist : ''
                        })(<UploadManyPic detail={detail ? detail:''} onChangeImg={this.onChangeImg} />)
                    }
                     <NoticeSize title='建议尺寸：750*370' />  
                </Form.Item>
                <Form.Item label='商品详情' >
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
                        initialValue: detail ? BraftEditor.createEditorState(detail.describe) : BraftEditor.createEditorState(null)
                    })(
                        <BraftEditor
                            media={{ uploadFn: this.myUploadFn, accepts: myAccept }}
                            className="my-editor"
                            style={{ border: '1px solid #e8e8e8' }}
                        />
                    )}
                </Form.Item>
            </Form>
            
        </Modal>)
    }
}

const ProductModelForm = Form.create<any>({ name: 'ProductModelForm' })(ProductModel);
export default ProductModelForm