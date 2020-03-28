import React, { Component } from "react";
import { div } from "@/decorators/div";
import HomeLayout from "@/layout/HomeLayout";
import { IMG_URL } from "@/utils/config";
import { Card, Modal, Avatar, Button, Tag  } from 'antd';
const { Meta } = Card;
import "./index.scss";
import {getBusinessList} from "@/api/index"
import CompanydescModel from "./model/model"

@(div({
    name: "Companydesc",
    route: ["/company/companydesc", {exact:true}],
    component: HomeLayout
}) as any)
export default class Companydesc extends Component<any, any> {
    state = {
        detail:{
            name:'',
            tag:"",
            intro:'',
            img:"",
            is_pass:3,
            logo:''
        },
        is_pass:{ 1:'审核通过',2:'未通过',3:'待审核'},
        visible: false,
        visible1:false
    }
    showModal = () => {
        console.log(this.state.visible)
        this.setState({
            visible: true,
        });
    };
    closeModal = () =>{
        this.setState({
            visible: false,
        });
    }
    componentDidMount(){
        this.getCompanyInfo()
    }
    getCompanyInfo = async()=>{
        let [err, data] =  await getBusinessList()
        if(err)return false
        this.setState({
            detail:data
        })
    }
    render() {
        let { detail, is_pass, visible } = this.state
        const descriptionNode = detail.tag && detail.tag.split(",").map(item=>{
            return (
                <Tag color="blue"  className= "descriptionNodeitem"  key={item}>
                    {item}
                </Tag > 
            )
        })
        return (<div className="Companydesc">
            {detail.name &&<Card
                style={{ width: 425 }}
            >
                <Meta
                    avatar={detail.logo&&<Avatar className="avatar54px" src={IMG_URL+ detail.logo} />}
                    title={detail.name}
                    description={<div className= "descriptionNode">{descriptionNode}</div>}
                />
                <div className= "describe" >
                    {detail.intro}
                </div>
                <div>
                    {detail.img&&<img style={{width:"100%"}} src={IMG_URL + detail.img} alt="" />}
                </div>
                <div className="operate"> 
                    <div className = "opeterateState">{is_pass[detail.is_pass]}</div>
                    <div className="opeterateBtn">
                        <Button onClick={this.showModal} type="primary">编辑</Button>
                        {/* <Button type="default" onClick={()=>{this.setState({visible1:true})}}>预览</Button> */}
                    </div>
                </div>
            </Card>}
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
            {visible && <CompanydescModel getCompanyInfo={this.getCompanyInfo} closeModal={this.closeModal} visible={visible} detail={detail} />}
        </div>)
    }
}