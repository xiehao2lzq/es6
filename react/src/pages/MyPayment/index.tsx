import React, { Component } from 'react';
import {div} from '@/decorators/div';
import HomeLayout from "@/layout/HomeLayout";
import {Radio,Input,DatePicker,Select,Form,Table,Col,Button,Modal,Typography,Pagination, message } from 'antd';
import {delDues,myduesList} from './../../api';
import { formatDateStr } from "@/utils/util" 
import {IMG_URL} from '../../utils/config'
import FormItem from "antd/lib/form/FormItem";
import moment from 'moment';
import 'moment/locale/zh-cn';
import './index.scss'
// import ChangeCharge from '../components/changCharge'
// import UploadCredentials from '../components/UploadCredentials'
// import ToExamine from '../components/ToExamine'

// import {timeForMat} from './../../../utils/util'
const { Title } = Typography
moment.locale('zh-cn')
const { Option } = Select
const {  RangePicker } = DatePicker;
const { confirm } = Modal;
var id  = 0 

@(div({
    name: "ChargeRecord",
    route: ["/mydues"],
    component: HomeLayout,
    reducers: {
        // navlists(state, action) {
        //     console.log(action.navList)
        //     state = action.navList
        //     return {...state};
        // },
    },
    sagas: {
        // *getNavList(action, { call, put }) {
        //     const [err, res] = yield call(bannerList, action.payload)
        //     if (err) return console.log(err)
        //     yield put({ type: "navlists", navList:res.list})
        // }
    }
}) as any)


export default class MyPayment extends Component<any,any>{
    duespeopleLists= async (e)=>{
        const { name } =this.state
        this.state.pagination.current = e
        this.setState({
           data:[]
       },async ()=>{
        let curpage =e,pageSize=this.state.pagination.pageSize
        let param={
            name,
            pay_status:this.state.pay_status,//审核状态
            curpage, 
            pageSize,
        }
        const [err,res] = await myduesList(param)
        if(err) return console.log(err)
        this.setData(res)
       })
    }
    state={
        expand: false,
        OptionList:[],
        loading: false,
        pagination: {
            current: 1,
            pageSize:10,
            total:0,
            showTotal: total => {
                return `总共${total}条`
            },
            onChange:this.duespeopleLists.bind(this,)
        },
        pay_status:null,//审核状态
        recordList:[],
        checkAll: false,
        name:''
    }
    componentDidMount(){
   
      this.duespeopleLists(1)
    }
    setData(res){
            // eslint-disable-next-line react/no-direct-mutation-state
            
          // eslint-disable-next-line react/no-direct-mutation-state
          this.state.pagination.total = res.pageInfo.total
           this.setState({
            recordList:res.list.map(item=>{
                id++
                item.key=item.id
                item.sort =id
                item.pay_time=item.pay_time?this.getTime(item.pay_time):'---'
                item.checked=true
                
               
                return item
             }),
            
           })
       }
    //删除
     del=async (id)=>{
        const [err,data] = await delDues({id:id})
        if(err) return console.log(err)
        message.success('删除成功')
    }
    delInfo=(id)=>{
        confirm({
            title: '删除',
            cancelText:'取消',
            okText:'确定',
            content: (
              <div>
                <p>确定要删除么，删除后无法恢复！</p>
                
              </div>
            ),
            onOk:()=>{this.del(id)},
            onCancel() {
                console.log('Cancel');
              },
          });
    }
    //时间戳转时间
    getTime(nS){
        console.log(nS)
        return new Date(parseInt(nS)).toLocaleString().replace(/:\d{1,2}$/,' ')
    }
    onChange(pageNumber) {
        // console.log('Page: ', pageNumber);
    }
   
    setTime=(data)=>{
         this.setState({
          starttime:data.start_time,
          endtime:data.end_time,
          levelid:data.level_name.id
         },()=>{
           this.duespeopleLists(1)
         })
      
    }   

     
    
      onShowSizeChange=(current,pageSize)=>{
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.pagination.current= current
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.pagination.pageSize= pageSize
            this.setState({
                pagination:this.state.pagination
            })
            this.duespeopleLists(current)
      }
      //获取时间戳
      getTimeRAnge=(date, dateString)=>{
        let start = new Date(dateString[0].replace(/-/g,'/')+' '+'00:00:00').getTime()
        let end = new Date(dateString[1].replace(/-/g,'/')+' '+'23:59:59').getTime()
        this.setState({
          starttime:start,
          endtime:end
        })
      }
      //重置按钮
      setReset=()=>{
          this.setState({
            starttime:'',
            endtime:'',
            pay_status:null,//审核状态
            pay_type:null,//缴费方式
          },()=>{
            this.duespeopleLists(1)
          })
      }
      //去定
      handleOk = e => {
        this.setState({
          visible: false,
        });
        this.duespeopleLists(1)
      };
      //取消
      handleCancel = e => {
        this.setState({
          visible: false,
        });
      };
      // daochu = async() => {
      //   // window.location.href= `https://xcx.ctrl.cn:6062/web/admin/myDues/myduesList?key={"pageInfo":{"curpage":1,"pageSize":10},"param":{"own_app_id":1,"starttime":"","endtime":"","pay_status":null,"levelid":null,"pay_type":null,'type':'1'}}`
      //   window.location.href= `https://xcx.ctrl.cn:6062/web/admin/myDues/myduesList?key={"param":{"starttime":"","endtime":"","own_app_id":1,"pay_status":"","pay_type":"","type":"1"},"pageInfo":{"curpage":"1","pageSize":"3"}}`
      // }

    handleChange = (type,value)=>{
      this.setState({
        [type]:value
      })
    }
     
    render() {
        const { name } = this.state
        const columns = [
            {
              title: '序号',
              dataIndex: 'index',
              render:(text,record,index)=>{
                const { current, pageSize } = this.state.pagination
                return(
                   <span >{(current - 1) * pageSize + (index + 1)}</span>
                )
              }
            },
            {
              title: '会费标题',
              dataIndex: 'name',
              render:(text)=>{
                return (
                <span style={{ color:'#1890ff' }} >{text}</span>
                )
              }
            },
            {
              title: '缴纳周期',
              dataIndex: 'deadline',
              render:(text,record)=>{
                // formatDateStr(date, fmt = 'yyyy-MM-dd hh:mm:ss')
                return (
                 <span> { formatDateStr(new Date(record.startline),'yyyy-MM-dd') } ~ {formatDateStr(new Date(record.deadline),'yyyy-MM-dd') } </span>
                )
              }
            },
            {
              title: '应缴金额',
              dataIndex: 'money',
              render:(text,record)=>{
                return (
                 <span>{text}元</span>
                )
              }
            },


            {
              title: '状态',
              dataIndex: 'pay_status',
              render:(text,record)=>{
                let pay_status={
                    '1':'已支付',
                    '2':'未支付',
                  }
                  return(
                  <span>{pay_status[text]}</span>
                  )
              }
            },
          
            // {
            //   title: '操作',
            //   dataIndex: 'caozuo',
            //   render:(text,record)=>{
            //       console.log(record)
            //     return(
            //       <div className='operation'>
            //           <Button type='danger' onClick={this.delInfo.bind(this,record.id)}>删除</Button>
            //           {/* <Button type='default' 
            //             className='operation-button' 
            //             onClick={this.evidenceDetails.bind(this,1,record)}
            //             >
            //               {record.has_img==0?'缴纳收据':'查看收据'}
            //           </Button> */}
            //           {/* {record.pay_status==3&&<Button type='danger'  onClick={this.evidenceDetails1.bind(this,4,record)}>审核</Button>} */}
            //       </div>
                 
            //     )
            //   }
            // },
          ];
         
          const dateFormat = 'YYYY-MM-DD';
        return (
            <div className='ChargeRecord'>
               <FormItem className='formItem' >
                        <span className='formItem-span'>缴费状态：</span>
                        <Col xxl={3} xl = {3} lg = {4} xs = {5} className='memberName'>
                            <Select value={this.state.pay_status?this.state.pay_status:'请选择'} style={{ width: 140 }} onChange={(value) => this.handleChange('pay_status',value)}>
                            {/* // 审核状态【1：已支付2：未支付 】 */}
                                            <Option  value={null}>全部</Option>
                                            <Option  value={1}>已支付</Option>
                                            <Option  value={2}>未支付</Option>
                            </Select>
                        </Col>

                        <span className='formItem-span'>会费标题：</span>
                        <Col xxl={4} xl = {4} lg = {5} xs = {6} className='memberName'>
                            <Input 
                              value = {name} 
                              placeholder = '请输入会费标题' 
                              onChange={(e) => this.handleChange('name',e.target.value)}
                              style = {{width:'90%'}}/>
                        </Col>
                        <div  style={{display:'inline-block'}}>
                            <Button type="primary" onClick={this.duespeopleLists.bind(this,1)} >查询</Button>
                            <Button type="primary" className='button-1' onClick={this.setReset} >重置</Button>
                            {/* <Button type="primary" onClick={this.daochu.bind(this)} >导出</Button> */}
                        </div>
                       
                </FormItem>
                <div>
                   
                    <Table columns={columns} dataSource={this.state.recordList} pagination={false}  />
                    <div className='record-pagination'>
                        <Pagination 
                            showQuickJumper  
                            onChange={this.onChange} 
                            {...this.state.pagination} 
                            showSizeChanger
                            onShowSizeChange={this.onShowSizeChange.bind(this)}
                            pageSizeOptions={['10','20']}
                        />
                    </div>
                    
                </div>


            </div>
        )
    }
}


