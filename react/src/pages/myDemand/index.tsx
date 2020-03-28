import * as React from 'react';
import { Component } from 'react';
import { div } from '@/decorators/div';
import HomeLayout from '@/layout/HomeLayout';
import { Button, Modal, Table, message } from 'antd';
import ShowEdit from './components/showEdit/index'
import AddDemand from './components/addDemand'
import { owntcList, ownTcEdit, ownTcAdd, getLabel,delTc,submitTc } from './../../api'
import './index.scss'
const { confirm } = Modal

@(div({
  name: "mysupple",
  component: HomeLayout,
  route: ["/supple/mysupple"]
}) as any)
export default class MyDemand extends Component {
  state = {
    visible: false,
    visible1: false,
    pagination: {
      current: 1,
      pageSize: 8,
      total: 0,
      showTotal: total => {
        return `总共${total}条`
      },
      onChange: this.getVoteLists.bind(this)
    },
    RecordList: [],
    detailIfo: {},
    configId: null,
    LabelList: [],
    itemMessage:{}
    


  }
  componentDidMount() {
    this.getVoteLists(1)
    this.getLabels()
  }
  //获取gongxu列表
  getVoteLists(e) {
    this.state.pagination.current = e
    this.setState({
      RecordList: []
    }, async () => {
      let curpage = e, pageSize = this.state.pagination.pageSize
      const [err, res] = await owntcList({ curpage, pageSize, keyWord: '', type: 1 })
      if (err) return console.log(err)
      this.setData(res)
      
    })
  }
  setData=(res)=>{
    let obj = Object.assign(this.state.pagination,{
      total:res.pageInfo.total
    })
    this.setState({
      RecordList: res.list.map((item) => {
        item.delivery_time =item.delivery_time?new Date(item.delivery_time).toLocaleString():'暂未发布'
        item.key = item.id
        return item
      }),
      pagination:obj
    })
  }
  //添加
   ownTcAdds=async (param)=>{
    const [err, data] = await ownTcAdd(param)
    this.setState({
      visible1:false
    })
    this.getVoteLists(1)
  }
  //标签列表
  async getLabels() {
    const [err, data] = await getLabel()
    this.setState({
      LabelList: data
    })
    // { label: 'Apple', value: 'Apple' },
    // console.log(data)
  }
  //xiugai
   changeUserinfos=async (param)=>{
    let params = {
      ...param,
    }
    const [err, data] = await ownTcEdit(params)
    if(err) return console.log(err)
    this.setState({
      visible:false
    })
    this.getVoteLists(1)
  }
  //删除
  async delTcs(id){
    const [err,data] = await delTc({id:id}) 
    if(err) return console.log(err)
    this.getVoteLists(1)
  }
  //审核
  submitTcs=async (id)=>{
      const [err,data] = await submitTc({id})
      if(err) return console.warn(err);
      message.success('提交审核成功！');
      this.getVoteLists(1)
      
  }
  getInfo=(record)=>{
    // console.log(record)
    this.setState({
      itemMessage:record,
      visible:true
    })
  }
  render() {
    const columns = [
      {
        title: '标签',
        dataIndex: 'tclabel',
        key: 'tclabel',
        render: (text, record) => {
          return (
            <div className='buttons'>
              {
                text.map(item=>{
                  return <span className='sapn-1' key={item.label_id}>
                    {item.label.labelname}
                  </span>
                })
              }
            </div>
          )
        }
      },
      {
        title: '所属行业',
        dataIndex: 'industry',
        key: 'industry',
      },
      {
        title: '位置信息',
        dataIndex: 'province',
        key: 'province',
        render: (text, record) => {
          return (
            <div className='buttons'>
              {record.province}{record.city}
            </div>
          )
        }
      },

      {
        title: '发布时间',
        dataIndex: 'delivery_time',
        key: 'delivery_time'

      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        render: (text, record) => {
          return (
            <div className='buttons'>
              {
                {
                  '0':'待审核',
                  '1':'审核中',
                  '2':'已发布',
                  '-1':'未通过'
                }[text]
              }
            </div>
          )
        }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => {
          return (
            <div className='buttons'>
              {record.state==0&&<Button type="primary" className='button-1' onClick={this.submitTcs.bind(this,record.id)}>审核</Button>}
              <Button type="primary" className='button-1' onClick={this.getInfo.bind(this,record)}>编辑</Button>
              <Button type="danger" onClick={this.delTcs.bind(this,record.id)}>删除</Button>
            </div>
          )
        }
      },
    ];
    return (
      <div className='MyDemand'>
        <div className='primary-button1'>
          <Button type="primary" onClick={() => { this.setState({ visible1: true })}}>添加</Button>
        </div>
        <Table
          columns={columns}
          dataSource={this.state.RecordList}
          bordered
          title={() => '需求列表'}
          pagination={this.state.pagination}
        />
        {this.state.visible && <ShowEdit
          visible={this.state.visible}
          celButtons={()=>{this.setState({visible:false})}}
          changeUserinfos={this.changeUserinfos}
          LabelList={this.state.LabelList}
          itemMessage={this.state.itemMessage}
        />}
        {this.state.visible1 && <AddDemand
          visible={this.state.visible1}
          celButtons={()=>{this.setState({visible1:false})}}
          ownTcAdd={this.ownTcAdds}
          LabelList={this.state.LabelList}
          itemMessage={this.state.itemMessage}
        />}
      </div>
    )

  }
}
