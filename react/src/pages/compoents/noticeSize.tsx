import React, { Component } from 'react'

export default class NoticeSize extends Component<any>{
   
    render() {
      let style={
            color:'red',
            marginTop:'-20px'
        }
        return (
            <div style={style}>
                *{this.props.title} 
            </div>
        )
    }
}
