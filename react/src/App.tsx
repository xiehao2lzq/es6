import React, { Component } from "react";
//	测试：主分支更新合并到线上分支
import { HashRouter as Router } from "react-router-dom";
//登录框
import { div } from "@/decorators/div";
import './App.css'

// 01.路由
import ReactRouterDom from "./routes";
@(div.entry() as any)
class App extends Component<any, any> {
    render() {
        return (
                <Router>
                    <ReactRouterDom />
                </Router>
        )
    }
}
export default App;
