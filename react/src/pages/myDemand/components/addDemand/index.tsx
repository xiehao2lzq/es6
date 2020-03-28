import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { Button,Typography,Modal, Form,Input,Checkbox,Icon,message,Upload,DatePicker} from 'antd';
import { FormComponentProps } from 'antd/es/form';
import 'braft-editor/dist/index.css'
import FormItem from "antd/lib/form/FormItem";
import BraftEditor from 'braft-editor'
import {IMG_URL} from './../../../../utils/config'
import { pca, pcaa } from 'area-data'
import 'react-area-linkage/dist/index.css'; // v2 or higher
import { AreaSelect, AreaCascader } from 'react-area-linkage'
import NoticeSize from '@pages/compoents/noticeSize'


const { Title } = Typography;
const { TextArea } = Input;
const {RangePicker } = DatePicker;


import "./index.scss";

interface IProps extends FormComponentProps {
    visible:boolean,
    celButtons:() => void,
    ownTcAdd:(param) =>void,
    LabelList:any,
    itemMessage:any
    // userMessage:any
  }
var id= 1
class AddDemand extends Component<IProps,any>{
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //       value: '学习学习',
    //     };
    // }
   
    state = {
        loading: false,
        imageUrl:[],
        LabelList:this.props.LabelList.map(item=>{
          item.value = item.id
          item.label = item.labelname
          // { label: 'Apple', value: 'Apple' },
          return item
        }),
        cheked:false,
        checkedList:[],
       
        // imageUrl:this.props.userMessage.head_portrait,
      };
      componentDidMount(){
        
      }
      handleSubmit = e => {
        //   console.log(e)
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            // console.log(err,values)
          if (!err) {
              let label = []
              this.props.LabelList.forEach(item=>{
                  if(values.label[0]==item.id||values.label[1]==item.id||values.label[2]==item.id){
                    label.push(item)
                  }
              })
            let param={
              title:'1',
              img:this.state.imageUrl,
              desc:values.desc,
              tel:values.tel,
              province:values.adress[0],
              label:values.label.toString(),
              industry:values.industry,
              city:values.adress[1],
            //   label:label.toString
            //   head_portrait:this.state.imageUrl
            }
            // console.log(param,'parma')
            // return
            this.props.ownTcAdd(param)
          }
        });
      };
     
      handleChange = e => {
        //  console.log(e,'上传')
        if(e.file.response){
          if(e.file.response.code!='200') return message.info('上传图片出错了！');
           
          if(this.state.imageUrl.length===6) return message.info('最多传6张！')
          id++
          this.state.imageUrl.push(e.file.response.data.filename)
         }
         if (e.file.status === 'uploading') {
          this.setState({ loading: true });
          return;
        }
        if (e.file.status === 'done') {
          this.setState({
              loading: false,
            })
        }
      };
      onChange=(e)=>{
        if(e.length>=3){
          message.info('最多选3')
          this.setState({cheked:true,})
          return
         
        } 
        this.setState({checkedList:e})
      }
      reMove=(e)=>{
          console.log(e,'shanchu')
        if(e.response){
            let index=this.state.imageUrl.indexOf(e.response.data.filename)
            this.state.imageUrl.splice(index,1)

        }
      }
      checkContent(rule,value,callback){
        let re = /^1\d{10}$/
        if(!re.test(value)){
            callback('请输入手机号！')
        }
      }
    
    render() {
      console.log(this.props.visible)
      const { getFieldDecorator,setFieldsValue } = this.props.form;
    //   const {userMessage} = this.props
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
     
      const options = [
        { label: 'Apple', value: 'Apple' },
        { label: 'Pear', value: 'Pear' },
        { label: 'Orange', value: 'Orange' },
      ];
      const uploadButton = (
        <div>
          <Icon type="plus" />
          <div className="ant-upload-text">Upload</div>
        </div>
      );
      let areList= []
      const ps = {
                    headers: {'X-Requested-With': null},
                    accept: "image/jpg,image/jpeg,image/png,image/bmp",
                };
        return <div className='PersonalInformation'>
            <Modal
              visible={this.props.visible}
              title="添加"
              onCancel={this.props.celButtons}
              className='myDemand-model'
              width='40%'
              footer={null}
              >
                <div className='from'>
                    <Form  onSubmit={this.handleSubmit}>
                        <Form.Item label="内容标签">
                        {getFieldDecorator('label', {
                                rules: [
                                    {
                                    required: true,
                                    message: '请选择标签！',
                                    },
                                ],
                        })( <Checkbox.Group
                            options={this.state.LabelList}
                            onChange={this.onChange}
                            disabled={this.state.cheked}
                        />)}
                        {this.state.cheked&&<Button type='primary' onClick={()=>{this.setState({cheked:!this.state.cheked});setFieldsValue({ label: [] })}} >重新选择</Button>}
                        </Form.Item>
                    <Form.Item label="描述">
                        {getFieldDecorator('desc', {
                                rules: [
                                    {
                                    required: true,
                                    message: '请输入你的个人简介！',
                                    },
                                ],
                        })(<TextArea autoSize={{minRows:4,maxRows:8 }} maxLength={600} />)}
                    </Form.Item>
                    <Form.Item label="">
                    {getFieldDecorator('img', {
                                rules: [
                                    {
                                    required: true,
                                    message: '请上传图片！',
                                    },
                                ],
                        })(<Upload
                            {...ps}
                            action="https://xcx.ctrl.cn:6061/image_upload"
                            listType="picture-card"
                            onChange={this.handleChange}
                            onRemove={this.reMove}
                            >
                            {this.state.imageUrl.length == 6? null : uploadButton}
                            </Upload>)}
                            <NoticeSize title='建议尺寸：650*300' />
                         
                    </Form.Item>
                    <Form.Item label="所属行业">
                        {getFieldDecorator('industry', {
                                rules: [
                                
                                    {
                                    required: true,
                                    message: '请输入所属行业！',
                                    },
                                ],
                        })(<Input />)}

                        </Form.Item>
                        <Form.Item label="位置信息">
                        {getFieldDecorator('adress', {
                                rules: [
                                    
                                    {
                                    required: true,
                                    message: '请输入你的位置信息',
                                    },
                                ],
                        })( <AreaSelect data={pcaa} type='text' defaultArea={areList} onChange={(e)=>{console.log(e)}} />)}
                        </Form.Item>
                        <Form.Item label="联系方式">
                        {getFieldDecorator('tel', {
                                rules: [
                                    {
                                        required: true, message: "联系方式不能为空",
                                    }, {
                                        pattern: new RegExp(/^1[3456789]\d{9}$/), message: "请输入正确手机号",
                                    }
                                ],
                        })(<Input />)}
                        </Form.Item>
                        <Form.Item>
                        <div className='Buttons'>
                            <Button type="primary" htmlType="submit" className='button-1'>
                            提交
                            </Button>
                            <Button type="primary" onClick={this.props.celButtons}>
                            取消
                            </Button>

                        </div>
                        
                        </Form.Item>
                    
                    </Form>
                    {/* <AreaSelect /> */}
                  
                </div>
               
            </Modal>
        </div>
    }
}
export default Form.create<IProps>({ name: 'register' })(AddDemand);