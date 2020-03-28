import React, { Component } from "react";
import { div } from "@/decorators/div";
import HomeLayout from "@/layout/HomeLayout";
import ShowEdit from './components/showEdit'
import { Button,Typography,Modal } from 'antd';
import {userinfoDetail,changeUserinfo} from './../../api'
import {IMG_URL} from '../../utils/config'
const { Title } = Typography;

import "./index.scss";



@(div({
    name: "PersonalInformation",
    route: ["/usermanage/chancesmanage"],
    component: HomeLayout
}) as any)
export default class PersonalInformation extends Component{
    UNSAFE_componentWillMount(){
        console.log(123);
        
    }
    state = {
        visible: false,
        visible1:false,
        userMessage: {
            company_name:'',
            name:'',
            company_position:'',
            head_portrait:'',
            is_pass:0
        },
        hasMessege:true
      };
      componentDidMount(){
          this.userinfoDetails()
      }
      //获取会员信息
    async userinfoDetails(){
        const [err,data] = await userinfoDetail()
        if(err) return console.log('err')
        let len=Object.keys(data)
        if(len.length===0) return false
        this.setState({
            userMessage:data
        })
        // console.log(data)
    }
     //提交编辑信息
      changeUserinfos=async (param)=>{
         let params = {
             ...param,
         }
        const [err,data] = await changeUserinfo(params)
        if(err) return console.log(err)
        this.setState({
            visible:false
        })
        this.userinfoDetails()
      }
    render() {
       const {userMessage }= this.state
    //    审核状态【1：审核通过2：未通过3：待审核】',
       let is_pass={
           1:'审核通过',
           2:'未通过',
           3:'待审核'
       }
        return <div className='PersonalInformation'>
            <div className='information-container'>
                <div className='img-div'>{userMessage.head_portrait?<img src={IMG_URL+userMessage.head_portrait} alt="" className='information-img' />:'暂无头像'}</div>
                <Title level={3}>{userMessage.name}</Title>
                <div><span className='span-1'>{userMessage.company_name}</span> <span>{userMessage.company_position}</span></div>
                <div className='information-state'>
                    <span >{is_pass[userMessage.is_pass]}</span>
                    <Button type="primary" onClick={()=>{this.setState({visible:true})}} className='button-1'>编辑</Button>
                    {/* <Button type="default" onClick={()=>{this.setState({visible1:true})}}>预览</Button> */}
                </div>
                {this.state.visible&&<ShowEdit 
                                        visible={this.state.visible} 
                                        celButton={()=>{this.setState({visible:false})}} 
                                        changeUserinfos={this.changeUserinfos}
                                        userMessage={userMessage}
                                        />}
            </div>
            <Modal
                title="预览"
                visible={this.state.visible1}
                className='PersonalIn-model'
                onCancel={()=>{this.setState({visible1:false})}}
                footer={null}
                >
                <div className='iframe-div'>
                    <iframe src="https://xcx.ctrl.cn/h5?key=10" className='iframe' ></iframe>
                </div>
                <Button type='primary' className='button' onClick={()=>{this.setState({visible1:false})}} >确定</Button>
              
             </Modal>
           
        </div>
    }
}
