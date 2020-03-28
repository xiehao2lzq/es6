import React, { Component } from "react";
import { Button,Typography,Modal, Form,Input,Tooltip,Icon,message,Upload,Col} from 'antd';
import { FormComponentProps } from 'antd/es/form';
import 'braft-editor/dist/index.css'
import FormItem from "antd/lib/form/FormItem";
import BraftEditor from 'braft-editor'
import {IMG_URL} from '@/utils/config'
import NoticeSize from '@pages/compoents/noticeSize'
import ImgCrop from 'antd-img-crop'; //引入图片裁剪组件



const { Title } = Typography;
const { TextArea } = Input;


import "./index.scss";

interface IProps extends FormComponentProps {
    visible:boolean,
    celButton:() => void,
    changeUserinfos:(param) =>void,
    userMessage:any
  }
var id = 0
class ShowEdit extends Component<IProps,any>{
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //       value: '学习学习',
    //     };
    // }
    
    state = {
        loading: false,
        visible:this.props.visible,
        imageUrl:this.props.userMessage.head_portrait,
        picture:this.props.userMessage.picture,
        piclist:this.props.userMessage.img?this.props.userMessage.img:[],
        fileList:this.props.userMessage.img,
        Loading:false,
        Loading1:false
      };
     componentDidMount(){
    
     }
    handleOk = () => {
        this.setState({ loading: true });
        setTimeout(() => {
          this.setState({ loading: false, visible: false });
        }, 3000);
      };
    
      handleCancel = () => {
       this.props.celButton()
      };
      handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            // console.log('Received values of form: ', values);
            // values.user_show = values.user_show.toHTML()
            if(!this.state.imageUrl) return message.info('请上传头像！')
          if(this.state.piclist.length==0) return message.info('请上传个人风采素材！')
          if(!this.state.picture) return message.info('请上传海报头像！')
            let param={
              ...values,
              head_portrait:this.state.imageUrl,
              piclist:this.state.piclist.map(item=>{
                item.pic=item.img 
                delete item.id
                // delete item.url
                return item
              }),

              picture:this.state.picture
            }
            // return console.log(param)
            this.props.changeUserinfos(param)
          }
        });
      };
     
      handleChange = (type,e) => {
      if(type==2){
        // this.state.fileList=e.fileList
        this.setState({
          fileList:e.fileList,
          Loading:true
        })
      }
      if(type==1) this.setState({
        Loading1:true
      })
        // if(status==="removed") return
        if(e.file.response){
          if(e.file.response.code!='200') return message.info('上传图片出错了！');
            switch (type){
                case 0 :
                  this.setState({
                    imageUrl:e.file.response.data.filename
                  })
                  break;
                case 1:
                  this.setState({
                    picture:e.file.response.data.filename
                  })
                break;
                case 2:
                  if(this.state.piclist.length===6) return message.info('最多传6张！')
                  
                  // {
                  //   url:IMG_URL+ e.file.response.data.filename,
                  //   uid: e.file.uid
                  //  }
                  // console.log(e.file.type.split('/')[0])
                  id++
                  this.state.piclist.push({
                    img:e.file.response.data.filename,
                    id:e.file.uid,
                    class:e.file.type.split('/')[0]=='image'?1:2
                  })
                  this.setState({
                    piclist:this.state.piclist,
                    Loading:false,
                    Loading1:false
                  },()=>{
                    console.log(this.state.piclist)
                  })
                 
                break;
                default:
                  return message.info('上传图片出错了！')
            }
          // this.state.imageUrl=e.file.response.data.filename
         
         }
        //  if (e.file.status === 'uploading') {
        //   this.setState({ loading: true });
        //   return;
        // }
        if (e.file.status === 'done') {
          this.setState({
              loading: false,
              Loading1:false
            })
        }
      };
    reMove=(it)=>{
      // console.log( this.state.piclist)
        this.state.piclist.forEach((item,index)=>{
          // console.log(it,item.id)
          if(it.id==item.id){
            this.state.piclist.splice(index,1)
          }
        })
        // console.log(this.state.piclist)
          this.setState({
            piclist:this.state.piclist
          })
      
    }
     
    render() {
      const { getFieldDecorator } = this.props.form;
      const {userMessage} = this.props
      const formItemLayout = {
        labelCol: {
          xs: { span: 8 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 8},
          sm: { span: 8 },
        },
      };
      
      const uploadButton = (
        <div>
          <Icon type="plus" />
          <div className="ant-upload-text">Upload</div>
        </div>
      );
      const ps = {headers: {'X-Requested-With': null}};
      const props = {
          width: 500,  //裁剪宽度
          height: 500, //裁剪高度
          resize: true, //裁剪是否可以调整大小
          resizeAndDrag: true, //裁剪是否可以调整大小、可拖动
          modalTitle: "上传图片", //弹窗标题
          modalWidth: 600, //弹窗宽度
      };
        return <div className='PersonalInformation'>
            <Modal
              visible={this.state.visible}
              title="个人信息编辑"
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              className='PersonalInformation-model'
              width='800px'
              footer={null}
              > 
                <Form className='formList' {...formItemLayout} onSubmit={this.handleSubmit}>
                  <Form.Item label='头像'>
                    <ImgCrop {...props}>
                      <Upload method='post' {...ps} showUploadList={false} action='https://xcx.ctrl.cn:6061/image_upload' onChange={this.handleChange.bind(this,0)}>
                        {!this.state.imageUrl&&<Button>
                            <Icon type={this.state.loading ? 'loading' : 'plus'} className='anticon-plus' />
                        </Button>}
                        {this.state.imageUrl&&
                            <img className='nav-img coursor' src={(this.state.imageUrl?IMG_URL+ this.state.imageUrl:'')} alt=""/>
                        }
                      </Upload>
                    </ImgCrop>
                    </Form.Item>
                  <Form.Item label="姓名">
                    {getFieldDecorator('name', {
                              rules: [
                                {
                                  required: true,
                                  message: '请输入你的姓名！',
                                },
                              ],
                              initialValue:userMessage.name
                      })(<Input />)}
                    </Form.Item>
                  <Form.Item label="商会职务">
                        {userMessage.level_name}
                  </Form.Item>
                  <Form.Item label="会员分组">
                      {userMessage.group_name}
                  </Form.Item>
                  <Form.Item label="所在公司">
                    {getFieldDecorator('company_name', {
                              rules: [
                               
                                {
                                  required: true,
                                  message: '请输入你的公司！',
                                },
                              ],
                              initialValue:userMessage.company_name
                      })(<Input />)}
                    </Form.Item>
                  <Form.Item label="公司职务">
                    {getFieldDecorator('company_position', {
                              rules: [
                                // {
                                //   required: true,
                                //   message: '请输入你的职位！',
                                // },
                              ],
                              initialValue:userMessage.company_position
                      })(<Input />)}
                    </Form.Item>
                  <Form.Item label="联系电话">
                    {getFieldDecorator('phone', {
                              rules: [
                                {
                                  required: true,
                                  message: '请输入你的联系方式',
                                },
                              ],
                              initialValue:userMessage.phone
                      })(<Input />)}
                    </Form.Item>
                  <Form.Item label="电子邮箱">
                    {getFieldDecorator('email', {
                              rules: [
                                {
                                  type: 'email',
                                  message: '请输入你的邮箱!',
                                },
                                // {
                                //   required: true,
                                //   message: '请输入你的邮箱!',
                                // },
                              ],
                              initialValue:userMessage.email
                      })(<Input />)}
                    </Form.Item>
                  <Form.Item label="微信号">
                    {getFieldDecorator('wechat', {
                              rules: [
                                
                                // {
                                //   required: true,
                                //   message: '请输入你的微信号！',
                                // },
                              ],
                              initialValue:userMessage.wechat
                      })(<Input />)}
                    </Form.Item>
                  <Form.Item label="联系地址">
                    {getFieldDecorator('company_address', {
                              rules: [
                               
                                {
                                  required: true,
                                  message: '请输入你的联系地址！',
                                },
                              ],
                              initialValue:userMessage.company_address
                      })(<Input />)}
                    </Form.Item>
                    {/* <FormItem wrapperCol={{ span: 12, offset: 5 }}> */}
                
                </Form>
                <Form>
                </Form>
               
                <Form  onSubmit={this.handleSubmit}>
                  <Form.Item label="个人简介">
                    {getFieldDecorator('profile', {
                              rules: [
                               
                                // {
                                //   required: true,
                                //   message: '请输入你的个人简介！',
                                // },
                              ],
                              initialValue:userMessage.profile
                      })(<TextArea autoSize={{minRows:4,maxRows:8 }} />)}
                  </Form.Item>
                    <Form.Item label='海报头像'>
                        
                        <Upload method='post' {...ps} showUploadList={false} action='https://xcx.ctrl.cn:6061/image_upload' onChange={this.handleChange.bind(this,1)}>
                        {!this.state.picture&&<Button>
                            <Icon type={this.state.Loading1 ? 'loading' : 'plus'} className='anticon-plus' />
                        </Button>}
                        {this.state.picture&&
                            <img className='nav-img coursor' src={(this.state.picture?IMG_URL+ this.state.picture:'')} alt=""/>
                        }
                      </Upload>
                  </Form.Item>
                  <NoticeSize title='海报建议尺寸：600*600' />
                  <Form.Item label="个人风采">
                    
                          {
                              this.state.piclist.length>0&&this.state.piclist.map(item=>{
                                  return(
                                    <Col span={3} key={item.img}>
                                      <div  className='item-div'>
                                          <Icon type="close" className='close-icon' onClick={this.reMove.bind(this,item)} />
                                          {item.class==1&&<img src={IMG_URL+item.img} alt="" title='图片' className='item-img' />}
                                          {item.class==2&&<video src={IMG_URL+item.img}  className='item-video' title='视频' ></video>}
                                      </div>
                                    </Col>
                                  )
                                })
                            }
                    {this.state.Loading&&<Col span={3}>
                      <div className='icon-Loading'>
                          <Icon type='loading'></Icon>    
                      </div>
                    </Col>}
                    <Col span={1}>
                      <Upload
                            {...ps}
                            action="https://xcx.ctrl.cn:6061/image_upload"
                            listType="picture-card"
                            onChange={this.handleChange.bind(this,2)}
                            multiple={true}
                            onRemove={this.reMove}
                            // onPreview={this.handlePreview}
                            // fileList={this.state.fileList}
                            >
                              
                            {this.state.piclist.length == 6? null : uploadButton}
                        </Upload>
                    </Col>
                 
                   
                         
                    </Form.Item>
                    <NoticeSize title='个人风采图片视频建议尺寸：690*400' />
                    <Form.Item>
                      <div className='Buttons'>
                      <Button type="danger" className='button-1' onClick={this.props.celButton}>
                          取消
                        </Button>
                        <Button type="primary" htmlType="submit" >
                          提交
                        </Button>
                       
                      </div>
                     
                    </Form.Item>
                 
                </Form>
            </Modal>
        </div>
    }
}
export default Form.create<IProps>({ name: 'register' })(ShowEdit);