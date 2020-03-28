import React, { Component } from "react";
import { div } from "@/decorators/div";
import HomeLayout from "@/layout/HomeLayout";
import FullscreenLayout from "@/layout/FullscreenLayout";
import { Carousel,Col,Table,Pagination,Modal,Typography,Icon} from 'antd'
import {IMG_URL} from 'utils/config'
import {activeList,contentList,homeList,contentDetail} from './../api'
// import  Cookies  from 'js-cookie'
import "./index.scss";
const { Title} = Typography;


@(div({
    name: "index",
    route: ["/index"],
    component: HomeLayout,
}) as any)

export default class Index extends Component<any, any> {
    duespeopleLists= async (e)=>{
      
        this.state.pagination.current = e
        this.setState({
           data:[]
       },async ()=>{
        let curpage =e,pageSize=this.state.pagination.pageSize
        let param={
            curpage, 
            pageSize,
        }
        const [err,res] = await activeList(param)
        if(err) return console.log(err)
        this.setData(res,1)
       })
    }
      //获取列表
   
    duespeopleList1s= async (e)=>{
        this.state.pagination1.current = e
        this.setState({
           data:[]
       },async ()=>{
        let curpage =e,pageSize=this.state.pagination1.pageSize
        let param={
            curpage, 
            pageSize,
        }
        const [err,res] = await contentList(param)
        if(err) return console.log(err)
        this.setData(res,2)
       })
    }
   
    state={
        pagination: {
            current: 1,
            pageSize:5,
            total:0,
            // showTotal: total => {
            //     return `总共${total}条`
            // },
            onChange:this.duespeopleLists.bind(this,)
        },
        pagination1: {
            current: 1,
            pageSize:5,
            total:0,
            // showTotal: total => {
            //     return `总共${total}条`
            // },
            onChange:this.duespeopleList1s.bind(this,)
        },
        recordList:[],
        recordList1:[],
        startIndex:0,
        endIndex:0,
        bannerList:[],
        visible:false,
        ItemIfo:{
            title:'',
            start_time:'',
            organize_company:'',
            introduce:'',
            name:'',
            viewnum:null,
            describe:'',
            created_at:'',
            author: {name: "山东企业商会2"}
        },
        sizeSmall:false
    }
   componentDidMount(){
       this.duespeopleLists(1)
       this.duespeopleList1s(1)
       this.homeList()
       console.log( window.screen.width  )
       if(window.screen.width<1400){
           this.setState({
               sizeSmall:true
           })
       }
       
   
   }
   contentDetails=async (id)=>{
       const [err,data] = await contentDetail({id:id})
       if(err) return console.warn(err);
        this.setState({
            visible:true,
            ItemIfo:data
        })
       
   }
   setData(res,type){
    switch(type){
        case 1:
            this.state.pagination.total = res.pageInfo.total
            this.setState({
             recordList:res.list.map(item=>{
                 item.key=item.aid
                 return item
              }),
            })
            break;
        case 2:
            this.state.pagination1.total = res.pageInfo.total
            this.setState({
                recordList1:res.list.map(item=>{
                    item.key=item.aid
                    item.created_at = this.setTime(item.created_at)
                    return item
                }),
            })
            break;
        case 3:
            this.setState({
                bannerList:res.bannerList
            })
            // Cookies.set("username", res.username);
            // Cookies.set("head_portrait", res.head_portrait);
            break;
        default:return;
    }
}
setTime=(start_time)=>{
    start_time =  new Date(parseInt(start_time)).toLocaleString('chinese',{hour12:false}).replace(/:\d{1,2}$/,' ').split(' ',2);
    //'chinese',{hour12:false} 去掉显示12小时制
    let time =  start_time[1]//获取钟表时间
    start_time =  start_time[0].split('/')//获取年月日数组
    let [year,month,day] = start_time
    //不到十的前面加0
    month = month>9?month:'0'+month
    day  =  day >9 ? day :'0' + day 
        //如果是2019-07-08 12:00
    start_time = year+'-'+month+'-'+day+' '+time
    return start_time
   
}
homeList= async ()=>{
    const [err,data] = await homeList()
    if(err) return console.warn(err)
    this.setData(data,3)
}
//刷新
reset=(type)=>{
    if(type===1) return this.duespeopleLists(1)
    if(type===2) return this.duespeopleList1s(1)
}
handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };
    render() {
        const {recordList,recordList1,pagination1,ItemIfo,sizeSmall,pagination} = this.state
        const { current, pageSize } = this.state.pagination
        console.log(this.props)
        // const { current1, pageSize1 } = this.state.pagination1
        const columns = [
            {
              title: '序号',
              dataIndex: 'index',
              className: 'column-data',
              render:(text,record,index)=>{
                const { current, pageSize } = this.state.pagination
                return(
                   <span >{(current - 1) * pageSize + (index + 1)}</span>
                )
              }
            },
          
            {
              title: '会议活动名称',
              dataIndex: 'title',
              ellipsis:true,
              className: 'column-data',
            },
            {
              title: '举办时间',
              dataIndex: 'start_time',
              ellipsis:true,
              className: 'column-data',
            },
         
          ];
        const columns1 = [
            {
              title: '序号',
              dataIndex: 'index',
              className: 'column-data',
              render:(text,record,index)=>{
                const { current, pageSize } = this.state.pagination1
                return(
                   <span >{(current - 1) * pageSize + (index + 1)}</span>
                )
              }
            },
            {
              title: '商会资讯标题',
              dataIndex: 'name',
              className: 'column-data',
              ellipsis:true,
            },
            {
              title: '发布时间',
              dataIndex: 'created_at',
              className: 'column-data',
              ellipsis:true,
            },
         
          ];
        return <div className='HomePage'>
            {/* 轮播 */}
            <div className='HomeSwiper'>
                <Carousel autoplay>
                       {
                           this.state.bannerList.map(item=>{
                               return (
                                <div className='swiperItem' key={item.id}>
                                     <img src={IMG_URL+item.img} className='swiper-img' alt=""/>
                                </div>
                               )
                           })
                       }
                </Carousel>
            </div>
            {/* 分类 */}
            <div className='tabels'>
              
                <div className='left'>
                    <div className='table-title'><img className='title-img' src={require('assets/images/huiyi.png')} alt=""/> <span>会议活动</span> </div>
                    <Table 
                        columns={columns} 
                        size='middle' 
                        dataSource={recordList}  
                        rowClassName={(record,index)=>index%2==0?'curour':'curour color1'}  
                        pagination={false}
                        onRow={(record,index)=>{return{
                            onClick:()=>{
                               this.setState({
                                ItemIfo:record,
                                visible:true
                               })
                              
                            }
                        }}} 
                    />
                    <div className='record-pagination'>
                        <div className='pagination-text'>
                            <span>第{(current - 1) * pageSize+1}到{(current - 1) * pageSize+recordList.length}条</span><span>总记条数：{this.state.pagination.total}</span> 
                            <img className='text-img' src={require('assets/images/shuaxin.png')} alt="" onClick={this.reset.bind(this,1)}/> 
                        </div>
                        <Pagination 
                            showQuickJumper  
                            // onChange={this.onChange} 
                            {...pagination} 
                            // showSizeChanger
                            // onShowSizeChange={this.onShowSizeChange.bind(this)}
                            size={(pagination.total>20&&sizeSmall)?'small':(pagination.total>50?'small':'')}
                            className='Pagination'

                        />
                    </div>
                </div>
                <div className='right'>
                    <div className='table-title'><img className='title-img' src={require('assets/images/zixun.png')} alt=""/> <span>商会资讯</span> </div>
                    <Table columns={columns1} 
                            size='middle' 
                            dataSource={recordList1} 
                            rowClassName={(record,index)=>index%2==0?'curour':'curour color1'}  
                            pagination={false}
                            onRow={(record,index)=>{return{
                                onClick:()=>this.contentDetails(record.id)
                            }}} 
                    />
                    <div className='record-pagination'>
                    <div className='pagination-text'>
                            <span>第{(pagination1.current - 1) * pagination1.pageSize+1}到{(pagination1.current - 1) *pagination1. pageSize+recordList1.length}条</span><span>总记条数：{pagination1.total}</span> 
                            <img className='text-img' src={require('assets/images/shuaxin.png')} alt="" onClick={this.reset.bind(this,2)}/> 
                        </div>
                        <Pagination 
                            showQuickJumper  
                            {...this.state.pagination1} 
                            className='Pagination'
                            size={(pagination1.total>20&&sizeSmall)?'small':(pagination1.total>50?'small':'')}
                        />
                    </div>
                    {/* 详情 */}
                </div>
               
                    <Modal
                    title="详情"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    className='HomePage-Model'
                    width='50%'
                    >
                        <div className='detail-title'><Title level={2}>{ItemIfo.title ||ItemIfo.name }</Title> </div>
                        <div className={!ItemIfo.viewnum?'detail-content':'detail-content detail-width'}>
                        <div className='time'>{ItemIfo.start_time || ItemIfo.created_at}</div>
                        <div className={!ItemIfo.viewnum?'writer ':'writes'}>作者：{ItemIfo.organize_company || ItemIfo.author.name}</div>
                            {ItemIfo.viewnum&&<div className='Browse-Time'>
                            <Icon type="eye" />
                                {ItemIfo.viewnum}
                            </div>}

                        </div>
                        <div className='content'>
                        <div dangerouslySetInnerHTML={{
                            __html:ItemIfo.introduce || ItemIfo.describe
                            }}/>
                        </div>
                     
                    </Modal>
            </div>
        </div>
    }
}
