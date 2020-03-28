import React, { Component } from 'react';
import { div } from "@/decorators/div";
import HomeLayout from "@/layout/HomeLayout";
import {Form,Input,Button} from 'antd'
import PassWord from './../compenont/PassWord'

@(div({
    name: "SetPassWord",
    route: ["/usermanage/setPassWord"],
    component: HomeLayout
}) as any)

export default class SetPassword extends Component {
    render() {
        return (
            <div className='SetPassword'>
               <PassWord /> 
            </div>
        )
    }
}
