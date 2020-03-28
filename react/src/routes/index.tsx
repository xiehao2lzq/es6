import React, { Component } from "react";
import { Switch } from "react-router-dom";
import { div } from "@/decorators/div";

//pages
import Index from '@pages/index'
import Login from '@pages/Login'
import PersonalInformation from '@pages/PersonalInformation/index'
import Companydesc from "@/pages/company/companydesc"
import MyDemand from '@pages/myDemand/index'
import MessageNotice from '@pages/MessageNotice/index'
import MyPayment from '@pages/MyPayment/index' //我的缴费
import SetPassword from '@pages/Set/setPassword/index' //修改密码

import Product from "@/pages/company/product"
@(div.fc(
    Index,
    Login,
    PersonalInformation,
    MyDemand,
    MessageNotice,
    Companydesc,
    PersonalInformation,
    MyDemand,
    Product,
    MyPayment,
    SetPassword,
) as any)
export default class RouterDom extends Component<any, any> {
    render() {
        return (
            <Switch>
                {this.props.routes}
            </Switch>
        );
    }
}
