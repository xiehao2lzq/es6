import * as React from 'react';
import { Icon, Modal, Upload, message } from 'antd';
import { addPic } from "@/api/base";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { IMG_URL } from "@/utils/config";
import ImgCrop from 'antd-img-crop'; //引入图片裁剪组件
import "./uploadImage.scss"
export default class UploadImage extends React.Component<any,any> {
    state = {
        imageUrl: "",
        loading:false,
    };
    //文件上传
    customRequest = async (option) => {
        const formData = new FormData();
        formData.append('file', option.file);
        let [err,data] = await addPic(formData);
        this.setState({ loading: false });
        if(err)return false
        this.setState({
            imageUrl: data.filename
        })
        this.props.onChangeLogoImg(data.filename)
    }
    handleChangeImage = info => {
        console.log(info)
        if (info.file.status === 'uploading') {
            this.setState({
                loading: true,
                imageUrl: null
            });
            return;
        }
        
    };
    render() {
        const { image,type,size } = this.props;
        const { imageUrl } = this.state;
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        // console.log(imageUrl , image,"111111111111")
        const uploadImage =(
            <div className = 'upload_img_box'>
                <img className='r_upload_Img' src={`${IMG_URL}${imageUrl ? imageUrl : image}`} /> 
            </div>
        )
        let props ={}
        if(size != undefined){
            props = {
                width: size.width,  //裁剪宽度
                height: size.height, //裁剪高度
                resize: true, //裁剪是否可以调整大小
                resizeAndDrag: true, //裁剪是否可以调整大小、可拖动
                modalTitle: "上传图片", //弹窗标题
                modalWidth: 600, //弹窗宽度
            };
        }
        
        return (<div>
            {size != undefined?<ImgCrop {...props}>
                <Upload
                    name="logo"
                    listType="picture-card"
                    className={type+'-uploader'}
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={this.handleChangeImage}
                    customRequest={this.customRequest}
                >
                    {imageUrl || image ? uploadImage : uploadButton}
                </Upload>
            </ImgCrop>:(
                <Upload
                name="logo"
                listType="picture-card"
                className={type+'-uploader'}
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={this.handleChangeImage}
                customRequest={this.customRequest}
            >
                {imageUrl || image ? uploadImage : uploadButton}
            </Upload>
            )}
        </div>
            
                
        );
    }
}


function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('请上传 JPG/PNG 格式的图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('图片的大小不能大于 2MB!');
    }
    return isJpgOrPng && isLt2M;
}


export class UploadManyPic extends React.Component<any> {
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [],
    };
    componentDidMount(){
        let { detail } = this.props;
        if (detail){
            let fileList = []
            detail.pictureList.map((item,index)=>{
                fileList.push({
                    uid: -(index+1),
                    url: IMG_URL + item.img,
                    name: item.id,
                    status: 'done',
                })
            })
            this.setState({
                fileList
            })
        }
    }
    customRequest = async (option) => {
        let { fileList } = this.state;
        let uidReduce, uid = -1
        const formData = new FormData();
        formData.append('file', option.file);
        let [err, data] = await addPic(formData);
        // this.setState({ loading: false });
        if (err) return false
        if (fileList.length){
            uidReduce = fileList[fileList.length - 1].uid
            uid += uidReduce
        }
        this.setState({
            fileList: [...this.state.fileList, {
                uid: uid,
                url: IMG_URL+ data.filename,
                name: data.filename,
                status: 'done',
            }]
        })
        this.props.onChangeImg(data.filename,1)
    }


    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    onRemove = (e) =>{
        console.log(e)
        let { fileList } = this.state;
        let filterList = fileList.filter(item=>{
            return item.uid != e.uid
        })
        this.setState({
            fileList:filterList
        })
        this.props.onChangeImg(e.url,0)
    };

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const List:any = [...fileList]
        return (
            <div className="clearfix">
                <Upload
                    listType="picture-card"
                    fileList={List}
                    onPreview={this.handlePreview}
                    beforeUpload={beforeUpload}
                    onRemove={this.onRemove}
                    customRequest={this.customRequest}
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}