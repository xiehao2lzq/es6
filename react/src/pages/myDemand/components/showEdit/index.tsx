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
import { AreaSelect, AreaCascader } from 'react-area-linkage';
import NoticeSize from '@pages/compoents/noticeSize'


const { Title } = Typography;
const { TextArea } = Input;
const {RangePicker } = DatePicker;


import "./index.scss";

interface IProps extends FormComponentProps {
    visible:boolean,
    celButtons:() => void,
    changeUserinfos:(param) =>void,
    LabelList:any,
    itemMessage:any
    // userMessage:any
  }
var id= 1
class ShowEdit extends Component<IProps,any>{
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //       value: '学习学习',
    //     };
    // }
   
    state = {
        loading: false,
        imageUrl:[],
        imageUrl1:JSON.parse(this.props.itemMessage.img),
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
        const {setFieldsValue } = this.props.form;
        let arr = this.props.itemMessage.label.split(',').map(item=>{
          item = Number(item)
          return item
        })
        //获取所需的图片列表格式
        let arr1=[]
        JSON.parse(this.props.itemMessage.img).map((item,index)=>{
         id++
          arr1.push({
            uid:id,
            url:IMG_URL+item
          })
      })
        this.setState({
          imageUrl:arr1
        })
        setFieldsValue({ label:arr})
      }
      handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            if(this.state.imageUrl1.length==0){
              return message.info('请上传描述图片！')
            }
            let param={
              title:'1',
              img:this.state.imageUrl1,
              desc:values.desc,
              tel:values.tel,
              province:values.adress[0],
              label:values.label.toString(),
              industry:values.industry,
              city:values.adress[1],
              id:this.props.itemMessage.id
            //   head_portrait:this.state.imageUrl
            }
            // return
            this.props.changeUserinfos(param)
          }
        });
      };
     
      handleChange = e => {
            this.setState({
              imageUrl:e.fileList
            })
        if(e.file.response){
          if(e.file.response.code!='200') return message.info('上传图片出错了！');
          if(this.state.imageUrl.length===6) return message.info('最多传6张！')
          this.state.imageUrl1.push(e.file.response.data.filename)
          this.setState({
            imageUrl1:this.state.imageUrl1
          })
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
      //删除图片
      reMove=(e)=>{
        this.state.imageUrl.forEach((item,index)=>{
          if(item.uid===e.uid){
            this.state.imageUrl1.splice(index,1)
          }
      })
        
          this.setState({
            imageUrl1:this.state.imageUrl1
          },()=>{
            console.log(this.state.imageUrl1)
          })
      }
    
    render() {
   
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
        const {itemMessage} = this.props
        areList.push(itemMessage.province)
        areList.push(itemMessage.city)
        return <div className='PersonalInformation'>
            <Modal
              visible={this.props.visible}
              title="修改需求"
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
                                initialValue:itemMessage.label.split(',')
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
                                initialValue:itemMessage.desc
                        })(<TextArea autoSize={{minRows:4,maxRows:8 }} maxLength={600} />)}
                    </Form.Item>
                    <Form.Item label="">
                          <Upload
                            {...ps}
                            action="https://xcx.ctrl.cn:6061/image_upload"
                            fileList={this.state.imageUrl}
                            listType="picture-card"
                            onChange={this.handleChange}
                            onRemove={this.reMove}
                            >
                            {this.state.imageUrl.length == 6? null : uploadButton}
                            </Upload>
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
                                initialValue:itemMessage.industry
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
                                initialValue:`${itemMessage.province}${itemMessage.city}`
                        })( <AreaSelect data={pcaa} type='text' defaultArea={areList} onChange={(e)=>{console.log(e)}} />)}
                        </Form.Item>
                        <Form.Item label="联系方式">
                        {getFieldDecorator('tel', {
                                rules: [
                                    
                                    {
                                    required: true,
                                    message: '请输入你的联系方式',
                                    },
                                ],
                                initialValue:itemMessage.tel
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
export default Form.create<IProps>({ name: 'register' })(ShowEdit);