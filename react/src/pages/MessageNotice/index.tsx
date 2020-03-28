import * as React from 'react';
import { Component } from 'react';
import { div } from '@/decorators/div';
import HomeLayout from '@/layout/HomeLayout';
import { Collapse, Icon, Select,Button, Checkbox,Pagination} from 'antd'
import { noticeList,delNotice} from './../../api'
import './index.scss'
const { Panel } = Collapse;
const { Option } = Select;


@(div({
  name: "messagesend",
  component: HomeLayout,
  route: ["/message/messagesend"]
}) as any)
export default class MessageNotice extends Component {
  state = {
    visible: false,
    visible1: false,
    pagination: {
      current: 1,
      pageSize:10,
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
    itemMessage:{},
    checkList:[]
  


  }
  componentDidMount() {
    this.getVoteLists(1)
    // this.getLabels()
  }
  //获取gongxu列表
  getVoteLists(e) {
    this.state.pagination.current = e
    this.setState({
      RecordList: []
    }, async () => {
      let curpage = e, pageSize = this.state.pagination.pageSize
      const [err, res] = await noticeList({ curpage, pageSize, keyWord: '', type: 1 })
      if (err) return console.log(err)
      this.setData(res)
      
    })
  }
  setData=(res)=>{
    let obj = Object.assign(this.state.pagination,{
      total:res.pageInfo.total
    })
    let types={
        1:'商机',
        2:'企业风采',
        3:'入驻',
        4:'会员信息',
    }
    let states={
        '0':'默认',
        '1':'通过',
        '-1':'拒绝'
    }
    this.setState({
      RecordList: res.list.map((item) => {
        item.launch_time =new Date(item.launch_time).toLocaleString()
            item.header = types[item.type] +'审核'+states[item.state]
        return item
      }),
      pagination:obj
    })
  }

  //标签列表
  
  //xiugai
   
  //删除
  async delTcs(){
    const [err,data] = await delNotice({
        id:this.state.checkList.toString()
    })
    if(err) return console.log('err',err)
    this.setState({
        checkList:[]
    })
    this.getVoteLists(1)
  }
  getInfo=(record)=>{
    // console.log(record)
    this.setState({
      itemMessage:record,
      visible:true
    })
  }
   callback(key) {
    console.log(key);
  }
  checkBox=(id,e)=>{
      console.log(id)
      if(e.target.checked){
        this.state.checkList.push(id)
      }else{
       let index=this.state.checkList.indexOf(id)
       this.state.checkList.splice(index,1)
       this.setState({
        checkList:this.state.checkList
       })
      }
  }
 
genExtra = () => (
    <Icon
      type="setting"
      onClick={event => {
        // If you don't want click extra trigger collapse, you can prevent this:
        event.stopPropagation();
      }}
    />
  );
  onPositionChange = expandIconPosition => {
    this.setState({ expandIconPosition });
  };
  render() {
   
    const genExtra = (item) =>{
        console.log(item)
        return(
            <Checkbox onClick={(e)=>{e.stopPropagation()}} onChange={this.checkBox.bind(this,item)} ></Checkbox>
        )
    };
    let noticeList=[
        {
            id:1,
            title:'审核成功',
            desc:'1'
        },
        {
            id:2,
            title:'审核失败',
            desc:'1'
        },
        {
            id:3,
            title:'已发布', desc:'1'
        }
    ]
    // const customPanelStyle = {
    //     background: '#f7f7f7',
    //     borderRadius: 4,
    //     marginBottom: 24,
    //     border: 0,
    //     overflow: 'hidden',
    //     width:'50%'
    //   };
    
    return (
      <div className='MyDemand'>
       
        <div className='Collapse'>
        <Collapse
          defaultActiveKey={['1']}
          onChange={this.callback}
          expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
          bordered={true}
        >
        {
            this.state.RecordList.map(item=>{
                return(
                    <Panel header={item.header} key={item.id} extra={genExtra(item.id)}>
                         <div className='Panel'>{item.desc?item.desc:'暂无更多消息！'}</div>
                    </Panel>
                )
            })
        }
        </Collapse>
       
        <br />
      </div>
      {this.state.RecordList.length>0&&<div className='Pagination'>
        <Pagination 
                {...this.state.pagination}
            />
      </div>}
      <div className='primary-button'>
          <Button type="danger" onClick={this.delTcs.bind(this)}>删除</Button>
      </div>
      </div>
    )

  }
}
