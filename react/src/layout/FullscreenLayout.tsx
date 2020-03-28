import React from "react";
import { Layout } from "antd";
const { Content } = Layout;

export default class FullscreenLayout extends React.Component {
    render() {
        const { children } = this.props;

        return (
            <Layout>
                <Content>{children}</Content>
            </Layout>
        );
    }
}
