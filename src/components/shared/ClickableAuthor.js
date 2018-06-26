import React, { Component } from 'react';
import { base } from '../Firebase'
class ClickableAuthor extends Component {

  constructor(props){
    super(props)
    this.state={"userName": ""}
  }

  componentDidMount(){
    this.fetchUserName()
  }

  //Duplicando codigo en 2018 lul
  fetchUserName(){
    base.fetch('users/', {
        context: this,
        asArray: true,
        queries: {
          orderByChild: 'userEmail',
          equalTo: this.props.userEmail
        },
        then(data){
          this.setState({'userName': data[0].key})
        }
      });
  }

  render(){
    return <a onClick={()=>this.props.history.push('/profile/'+this.state.userName)}> {this.state.userName} </a>
  }
}

export default ClickableAuthor;
