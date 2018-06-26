import React, { Component } from 'react';
import { Menu, Feed, Card, Icon, Image } from 'semantic-ui-react'
import DefaultAvatar from '../../assets/default-avatar.png'
import UserContent from './UserContent'

class UserInfo extends Component {

  constructor(props){
    super(props)
    this.state = {optionPicked: "preguntas"}
    this.handleItemClick = this.handleItemClick.bind(this)
  }

  handleItemClick(e, { name }){
      this.setState({optionPicked: name})
  }

  renderContent(){
    switch(this.state.optionPicked){
      case "preguntas":
        return <UserContent contentType="questions" history={this.props.history} currentUser={this.props.currentUser}/>
      case "tutoriales":
        return <UserContent contentType="tutorials" history={this.props.history} currentUser={this.props.currentUser}/>
      case "respuestas":
        return <UserContent contentType="answers" history={this.props.history} currentUser={this.props.currentUser}/>
      default:
        return
    }
  }
  render(){
    return(
      <div>
      <Menu pointing secondary>
        <Menu.Item name='preguntas' active={this.state.optionPicked === 'preguntas'} onClick={this.handleItemClick} />
        <Menu.Item
          name='tutoriales'
          active={this.state.optionPicked === 'tutoriales'}
          onClick={this.handleItemClick}
        />
      </Menu>
      {this.renderContent()}
      </div>
    )
  }
}

export default UserInfo;
