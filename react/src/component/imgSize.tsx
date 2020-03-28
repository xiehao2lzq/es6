import React, { Component } from "react";
interface SizeIMG{
    size:string
}
export default class Size extends Component<SizeIMG,any>{
    render(){
        return <span>
            推荐尺寸{this.props.size}
        </span>
    }
}