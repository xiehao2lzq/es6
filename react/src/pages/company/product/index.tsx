import React, { Component } from "react";
import { div } from "@/decorators/div";
import HomeLayout from "@/layout/HomeLayout";
import { IMG_URL } from "@/utils/config";
import { Card, Tag, Table, Button, Switch,Popconfirm  } from 'antd';
import { ColumnProps } from 'antd/es/table';
import ProductModel from './model/model'
import "./index.scss";
import { getProductList, getDelProduct, getProductDetail, postEditProduct } from "@/api/index"
@(div({
    name: "Product",
    route: ["/company/product", { exact: true }],
    component: HomeLayout
}) as any)
export default class Product extends Component<any, any> {
    state = {
        is_passInfo: { 1: '审核通过', 2: '未通过', 3: '待审核' },
        keyword :'',
        curpage:1,
        pageSize:5,
        dataSource:[],
        visible: false,
        editVisible:false,
        detail:null,
        is_pass:3,
        total:0,
    }
    closeModal = () => {
        this.setState({
            visible: false,
        });
    }
    closeEditModal  = ()=>{
        this.setState({
            editVisible: false,
        });
    }
    componentDidMount() {
        this.getProductListInfo()
    }
    getProductListInfo = async () => {
        let { curpage, pageSize, keyword } = this.state
        let [err, data] = await getProductList({ curpage, pageSize, keyword })
        if (err) return false
        this.setState({
            dataSource: data.list,
            is_pass:data.is_pass,
            curpage: data.pageInfo.curpage,
            total: data.pageInfo.total
        })
    } 

    // 是否推荐
    onChangeSwitch = async(is_hot, item)=>{
        let hot = is_hot?0:1
        let [err, success] = await postEditProduct({ is_hot:hot,id:item.id})
        if(err){
            // console.log(e.target)
        }
    }

    // 编辑
    edit = async(item)=>{
        let [err, data] = await getProductDetail({ id:item.id})
        if(err)return false
        this.setState({
            editVisible: true,
            detail: data,
        });

    }

    // 删除
    del = async(id)=>{
        let [err, data] = await getDelProduct({id})
        if(err)return false
        this.getProductListInfo()
    }

    // 新增
    add = ()=>{
        this.setState({
            visible: true,
        });
    }
    render() {
        let { dataSource, visible, editVisible, detail, is_passInfo, is_pass, curpage, total, pageSize} = this.state;
        let that = this;
        const columns: ColumnProps<any>[] = [
            {
                title: '产品名称',
                dataIndex: 'name',
                key: 'name',
                align: 'center',
            },
            {
                title: '产品价格',
                dataIndex: 'price',
                key: 'price',
                align: 'center',
            },
            {
                title: '封面图',
                dataIndex: 'img',
                key: 'img',
                align: 'center',
                render: img => (
                    <span>
                        {img&&<img style = {{height:'50px'}} src={ IMG_URL+img } alt=""/>}
                    </span>
                ),
            },
            {
                title: '产品标签',
                dataIndex: 'tag',
                key: 'tag',
                align: 'center',
                render: tag => (
                    <span>
                        {tag&&tag.split(',').map(tag => {
                            let color = tag.length > 5 ? 'geekblue' : 'green';
                            if (tag === 'loser') {
                                color = 'volcano';
                            }
                            return (
                                <Tag color={color} key={tag}>
                                    {tag.toUpperCase()}
                                </Tag>
                            );
                        })}
                    </span>
                ),
            },
            {
                title: '热门推荐',
                dataIndex: 'is_hot',
                key: 'is_hot',
                align: 'center',
                render: (is_hot,item) => (
                    <span>
                        <Switch defaultChecked={is_hot ? true : false} 
                        onClick={()=>that.onChangeSwitch(is_hot, item)} />
                    </span>
                ),
            },
            {
                title: '操作',
                dataIndex: 'id',
                key: 'id',
                align:'center',
                render: (id,item) => (
                    <div>
                        <Button style={{ marginRight: '10px' }} type="primary" onClick={() => that.edit(item)}>编辑</Button>
                        <Popconfirm onConfirm={() => that.del(id)} title="你确定要删除吗？" okText="是" cancelText="否">
                            <Button type="danger" >删除</Button>
                        </Popconfirm>
                    </div>
                    
                ),
            },
        ];
        const pagination = {
            current: curpage, total,pageSize,
            onChange: (curpage, pageSize)=>{
                this.setState({
                    curpage, pageSize
                },()=>{
                    this.getProductListInfo()
                })
            }
        }
        // let { detail, is_pass, visible } = this.state
        return (<div className="product">
            <h3 style={{ margin: '16px 0' }}> 状态：{is_passInfo[is_pass]}    <Button style={{ margin: '0 16px' }} onClick={this.add}> 新增产品 </Button></h3>
            <Table pagination={pagination} rowKey='id' dataSource={dataSource} columns={columns} />
            {visible && <ProductModel closeModal={this.closeModal} getProductListInfo={this.getProductListInfo} visible={visible } /> }
            {editVisible && <ProductModel detail={detail} closeModal={this.closeEditModal} getProductListInfo={this.getProductListInfo} visible={editVisible} />}
        </div>)
    }
}